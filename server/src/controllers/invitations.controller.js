const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const {
  createInvitation,
  findByToken,
  findActiveByClientId,
  revokeAllPendingForClient,
  markAccepted,
  markRevoked,
  deriveStatus,
} = require('../models/invitation.model');
const {
  getClientById,
} = require('../models/client.model');
const {
  findByEmail,
  findById,
  createUser,
} = require('../models/user.model');
const { passwordSchema } = require('../utils/passwordValidator');
const { generateToken, expiryDays } = require('../utils/tokenGenerator');
const { sendInvitationEmail } = require('../services/email.service');

const INVITATION_EXPIRY_DAYS = 7;

function safeUser(user) {
  const {
    password_hash, // eslint-disable-line @typescript-eslint/no-unused-vars
    email_verification_token, // eslint-disable-line @typescript-eslint/no-unused-vars
    email_verification_expires, // eslint-disable-line @typescript-eslint/no-unused-vars
    password_reset_token, // eslint-disable-line @typescript-eslint/no-unused-vars
    password_reset_expires, // eslint-disable-line @typescript-eslint/no-unused-vars
    ...rest
  } = user;
  return rest;
}

function generateJwt(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

function validationError(res, error) {
  return res.status(400).json({
    success: false,
    error: 'Validation failed',
    details: error.issues || error.errors,
    code: 400,
  });
}

// ---------------------------------------------------------------------------
// FREELANCER-FACING (mounted under /api/clients/:id/invite)
// ---------------------------------------------------------------------------

/** GET /api/clients/:id/invite — get current invite status for a client. */
async function getInviteStatus(req, res, next) {
  try {
    const clientResult = await getClientById(req.params.id, req.user.id);
    if (clientResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Client not found', code: 404 });
    }

    const activeResult = await findActiveByClientId(req.params.id);
    if (activeResult.rows.length === 0) {
      return res.json({ success: true, data: { status: 'none' } });
    }

    const inv = activeResult.rows[0];
    res.json({
      success: true,
      data: {
        status: deriveStatus(inv),
        invitation_id: inv.id,
        email: inv.email,
        expires_at: inv.expires_at,
        created_at: inv.created_at,
      },
    });
  } catch (err) {
    next(err);
  }
}

/** POST /api/clients/:id/invite — send (or re-send) an invitation. */
async function sendInvite(req, res, next) {
  try {
    const clientResult = await getClientById(req.params.id, req.user.id);
    if (clientResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Client not found', code: 404 });
    }
    const client = clientResult.rows[0];

    if (!client.email) {
      return res.status(400).json({
        success: false,
        error: 'Client must have an email address to receive an invitation',
        code: 400,
      });
    }

    // If client already has a user account from a previous accepted invite,
    // there's no need to re-invite — they should just log in.
    const existingUser = await findByEmail(client.email);
    if (existingUser.rows.length > 0) {
      const u = existingUser.rows[0];
      if (u.role === 'freelancer') {
        return res.status(409).json({
          success: false,
          error: 'This email is already registered as a freelancer account',
          code: 409,
        });
      }
      // role === 'client' — already onboarded, no invite needed.
      return res.status(409).json({
        success: false,
        error: 'This client already has an active account',
        code: 'ALREADY_ONBOARDED',
      });
    }

    // Revoke any existing pending invite first (re-invite case).
    await revokeAllPendingForClient(client.id);

    const token = generateToken();
    const expiresAt = expiryDays(INVITATION_EXPIRY_DAYS);

    const result = await createInvitation({
      freelancerId: req.user.id,
      clientId: client.id,
      email: client.email,
      token,
      expiresAt,
    });
    const invitation = result.rows[0];

    // Lookup freelancer name for the email body.
    const freelancerResult = await findById(req.user.id);
    const freelancerName =
      (freelancerResult.rows[0] && freelancerResult.rows[0].name) || 'Your freelancer';

    try {
      await sendInvitationEmail(client.email, token, freelancerName, client.name);
    } catch (mailErr) {
      console.error('Failed to send invitation email:', mailErr.message);
    }

    res.status(201).json({
      success: true,
      data: {
        invitation_id: invitation.id,
        email: invitation.email,
        expires_at: invitation.expires_at,
        status: 'pending',
      },
      message: 'Invitation sent',
    });
  } catch (err) {
    next(err);
  }
}

/** DELETE /api/clients/:id/invite — revoke any pending invitation. */
async function revokeInvite(req, res, next) {
  try {
    const clientResult = await getClientById(req.params.id, req.user.id);
    if (clientResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Client not found', code: 404 });
    }

    const result = await revokeAllPendingForClient(req.params.id);
    res.json({
      success: true,
      message: result.rowCount > 0 ? 'Invitation revoked' : 'No pending invitation to revoke',
    });
  } catch (err) {
    next(err);
  }
}

// ---------------------------------------------------------------------------
// PUBLIC (mounted under /api/invitations/:token)
// ---------------------------------------------------------------------------

/** GET /api/invitations/:token — public details for the accept-invite page. */
async function getInvitationByToken(req, res, next) {
  try {
    const result = await findByToken(req.params.token);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Invitation not found',
        code: 404,
      });
    }

    const inv = result.rows[0];
    const status = deriveStatus(inv);

    res.json({
      success: true,
      data: {
        status,
        email: inv.email,
        client_name: inv.client_name,
        client_company: inv.client_company,
        freelancer_name: inv.freelancer_name,
        expires_at: inv.expires_at,
      },
    });
  } catch (err) {
    next(err);
  }
}

const acceptSchema = z.object({
  password: passwordSchema,
});

/** POST /api/invitations/:token/accept — public, body: { password }. */
async function acceptInvitation(req, res, next) {
  try {
    const parsed = acceptSchema.safeParse(req.body);
    if (!parsed.success) return validationError(res, parsed.error);

    const result = await findByToken(req.params.token);
    if (result.rows.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid invitation link',
        code: 400,
      });
    }

    const inv = result.rows[0];
    const status = deriveStatus(inv);
    if (status === 'accepted') {
      return res.status(400).json({
        success: false,
        error: 'This invitation has already been accepted',
        code: 'ALREADY_ACCEPTED',
      });
    }
    if (status === 'revoked') {
      return res.status(400).json({
        success: false,
        error: 'This invitation has been revoked',
        code: 'REVOKED',
      });
    }
    if (status === 'expired') {
      return res.status(400).json({
        success: false,
        error: 'This invitation has expired. Please ask for a new one.',
        code: 'EXPIRED',
      });
    }

    // Block if a user with this email already exists.
    const existing = await findByEmail(inv.email);
    if (existing.rows.length > 0) {
      const u = existing.rows[0];
      if (u.role === 'freelancer') {
        return res.status(409).json({
          success: false,
          error: 'This email is already registered as a freelancer account',
          code: 'EMAIL_TAKEN_FREELANCER',
        });
      }
      return res.status(409).json({
        success: false,
        error: 'A client account with this email already exists. Please log in instead.',
        code: 'ALREADY_ONBOARDED',
      });
    }

    // Create the client user. Clicking the email link is the verification.
    const passwordHash = await bcrypt.hash(parsed.data.password, 10);
    const created = await createUser({
      name: inv.client_name,
      email: inv.email,
      passwordHash,
      role: 'client',
      email_verified: true,
    });
    const user = created.rows[0];

    await markAccepted(inv.id);

    const cleanUser = safeUser(user);
    const jwtToken = generateJwt(cleanUser);

    res.status(201).json({
      success: true,
      data: { user: cleanUser, token: jwtToken },
      message: 'Welcome — your account is ready.',
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getInviteStatus,
  sendInvite,
  revokeInvite,
  getInvitationByToken,
  acceptInvitation,
};
