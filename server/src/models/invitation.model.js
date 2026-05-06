const { query } = require('../config/db');

function createInvitation({ freelancerId, clientId, email, token, expiresAt }) {
  return query(
    `INSERT INTO invitations (freelancer_id, client_id, email, token, expires_at)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [freelancerId, clientId, email, token, expiresAt]
  );
}

/** Find an invitation by its public token, joining client + freelancer for context. */
function findByToken(token) {
  return query(
    `SELECT i.*,
            c.name AS client_name, c.company AS client_company,
            u.name AS freelancer_name, u.email AS freelancer_email
       FROM invitations i
       JOIN clients c ON c.id = i.client_id
       JOIN users   u ON u.id = i.freelancer_id
      WHERE i.token = $1`,
    [token]
  );
}

/** Most recent active (not accepted, not revoked, not expired) invitation for a client. */
function findActiveByClientId(clientId) {
  return query(
    `SELECT *
       FROM invitations
      WHERE client_id = $1
        AND accepted_at IS NULL
        AND revoked_at IS NULL
        AND expires_at > NOW()
      ORDER BY created_at DESC
      LIMIT 1`,
    [clientId]
  );
}

/** Revoke any pending invitations for a client (used when freelancer re-invites). */
function revokeAllPendingForClient(clientId) {
  return query(
    `UPDATE invitations
        SET revoked_at = NOW()
      WHERE client_id = $1
        AND accepted_at IS NULL
        AND revoked_at IS NULL`,
    [clientId]
  );
}

function markAccepted(id) {
  return query(
    `UPDATE invitations SET accepted_at = NOW() WHERE id = $1 RETURNING *`,
    [id]
  );
}

function markRevoked(id) {
  return query(
    `UPDATE invitations SET revoked_at = NOW() WHERE id = $1 RETURNING *`,
    [id]
  );
}

function deriveStatus(inv) {
  if (inv.accepted_at) return 'accepted';
  if (inv.revoked_at) return 'revoked';
  if (inv.expires_at && new Date(inv.expires_at) < new Date()) return 'expired';
  return 'pending';
}

module.exports = {
  createInvitation,
  findByToken,
  findActiveByClientId,
  revokeAllPendingForClient,
  markAccepted,
  markRevoked,
  deriveStatus,
};
