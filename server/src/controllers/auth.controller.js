const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const {
  findByEmail,
  findById,
  findByVerificationToken,
  findByPasswordResetToken,
  createUser,
  setEmailVerified,
  setVerificationToken,
  setPasswordResetToken,
  setNewPassword,
} = require('../models/user.model');
const { passwordSchema } = require('../utils/passwordValidator');
const { generateToken, expiryHours } = require('../utils/tokenGenerator');
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require('../services/email.service');

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

// Public registration is **freelancer-only**. Client accounts are created via
// the invitation flow (see PROMPT 4 — feature/auth-invitations).
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(255),
  email: z.string().email('Enter a valid email').max(255),
  password: passwordSchema,
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const tokenSchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

const emailSchema = z.object({
  email: z.string().email(),
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function safeUser(user) {
  // Strip every sensitive column before returning to the client.
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
// POST /api/auth/register — freelancer-only
// ---------------------------------------------------------------------------
async function register(req, res, next) {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) return validationError(res, parsed.error);

    const { name, email, password } = parsed.data;

    const existing = await findByEmail(email);
    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'An account with this email already exists',
        code: 409,
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = generateToken();
    const verificationExpires = expiryHours(24);

    const result = await createUser({
      name,
      email,
      passwordHash,
      role: 'freelancer',
      email_verification_token: verificationToken,
      email_verification_expires: verificationExpires,
      email_verified: false,
    });
    const user = result.rows[0];

    // Send verification email — non-blocking on console fallback.
    try {
      await sendVerificationEmail(email, verificationToken, name);
    } catch (mailErr) {
      console.error('Failed to send verification email:', mailErr.message);
      // Continue anyway — user can resend later.
    }

    // No JWT issued. User must verify before logging in.
    res.status(201).json({
      success: true,
      data: { user: safeUser(user) },
      message:
        'Account created. Please check your email to verify your account before logging in.',
    });
  } catch (err) {
    next(err);
  }
}

// ---------------------------------------------------------------------------
// POST /api/auth/login
// ---------------------------------------------------------------------------
async function login(req, res, next) {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return validationError(res, parsed.error);

    const { email, password } = parsed.data;

    const result = await findByEmail(email);
    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
        code: 401,
      });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
        code: 401,
      });
    }

    if (!user.email_verified) {
      return res.status(403).json({
        success: false,
        error:
          'Please verify your email before logging in. Check your inbox or request a new link.',
        code: 'EMAIL_NOT_VERIFIED',
      });
    }

    const cleanUser = safeUser(user);
    const token = generateJwt(cleanUser);

    res.json({
      success: true,
      data: { user: cleanUser, token },
      message: 'Login successful',
    });
  } catch (err) {
    next(err);
  }
}

// ---------------------------------------------------------------------------
// POST /api/auth/verify-email  { token }
// ---------------------------------------------------------------------------
async function verifyEmail(req, res, next) {
  try {
    const parsed = tokenSchema.safeParse(req.body);
    if (!parsed.success) return validationError(res, parsed.error);

    const result = await findByVerificationToken(parsed.data.token);
    if (result.rows.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid verification link',
        code: 400,
      });
    }

    const user = result.rows[0];

    if (user.email_verified) {
      return res.json({
        success: true,
        message: 'Email already verified. Please log in.',
      });
    }

    if (
      user.email_verification_expires &&
      new Date(user.email_verification_expires) < new Date()
    ) {
      return res.status(400).json({
        success: false,
        error: 'Verification link has expired. Please request a new one.',
        code: 'TOKEN_EXPIRED',
      });
    }

    const updated = await setEmailVerified(user.id);
    const cleanUser = safeUser(updated.rows[0]);
    const token = generateJwt(cleanUser);

    res.json({
      success: true,
      data: { user: cleanUser, token },
      message: 'Email verified. You are now signed in.',
    });
  } catch (err) {
    next(err);
  }
}

// ---------------------------------------------------------------------------
// POST /api/auth/resend-verification  { email }
// ---------------------------------------------------------------------------
async function resendVerification(req, res, next) {
  try {
    const parsed = emailSchema.safeParse(req.body);
    if (!parsed.success) return validationError(res, parsed.error);

    const result = await findByEmail(parsed.data.email);

    // Constant-success response to avoid leaking which emails exist.
    const safeMessage = {
      success: true,
      message:
        'If an unverified account with that email exists, a new verification link has been sent.',
    };

    if (result.rows.length === 0) return res.json(safeMessage);
    const user = result.rows[0];
    if (user.email_verified) return res.json(safeMessage);

    const verificationToken = generateToken();
    const verificationExpires = expiryHours(24);

    await setVerificationToken(user.id, verificationToken, verificationExpires);

    try {
      await sendVerificationEmail(user.email, verificationToken, user.name);
    } catch (mailErr) {
      console.error('Failed to send verification email:', mailErr.message);
    }

    res.json(safeMessage);
  } catch (err) {
    next(err);
  }
}

// ---------------------------------------------------------------------------
// POST /api/auth/forgot-password  { email }
// ---------------------------------------------------------------------------
async function forgotPassword(req, res, next) {
  try {
    const parsed = emailSchema.safeParse(req.body);
    if (!parsed.success) return validationError(res, parsed.error);

    const result = await findByEmail(parsed.data.email);

    // Same response in every case to avoid leaking which emails are registered.
    const safeMessage = {
      success: true,
      message:
        'If an account with that email exists, a password reset link has been sent.',
    };

    if (result.rows.length === 0) return res.json(safeMessage);
    const user = result.rows[0];

    const resetToken = generateToken();
    const resetExpires = expiryHours(1);

    await setPasswordResetToken(user.id, resetToken, resetExpires);

    try {
      await sendPasswordResetEmail(user.email, resetToken, user.name);
    } catch (mailErr) {
      console.error('Failed to send password reset email:', mailErr.message);
    }

    res.json(safeMessage);
  } catch (err) {
    next(err);
  }
}

// ---------------------------------------------------------------------------
// POST /api/auth/reset-password  { token, password }
// ---------------------------------------------------------------------------
const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: passwordSchema,
});

async function resetPassword(req, res, next) {
  try {
    const parsed = resetPasswordSchema.safeParse(req.body);
    if (!parsed.success) return validationError(res, parsed.error);

    const { token, password } = parsed.data;

    const result = await findByPasswordResetToken(token);
    if (result.rows.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or already-used reset link',
        code: 400,
      });
    }

    const user = result.rows[0];

    if (
      user.password_reset_expires &&
      new Date(user.password_reset_expires) < new Date()
    ) {
      return res.status(400).json({
        success: false,
        error: 'Reset link has expired. Please request a new one.',
        code: 'TOKEN_EXPIRED',
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const updated = await setNewPassword(user.id, passwordHash);
    const cleanUser = safeUser(updated.rows[0]);
    const jwtToken = generateJwt(cleanUser);

    res.json({
      success: true,
      data: { user: cleanUser, token: jwtToken },
      message: 'Password updated. You are now signed in.',
    });
  } catch (err) {
    next(err);
  }
}

// ---------------------------------------------------------------------------
// GET /api/auth/me
// ---------------------------------------------------------------------------
async function getMe(req, res, next) {
  try {
    const result = await findById(req.user.id);
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: 'User not found', code: 404 });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  getMe,
};
