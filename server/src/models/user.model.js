const { query } = require('../config/db');

const SAFE_USER_COLUMNS = 'id, email, role, name, email_verified, created_at';

function findByEmail(email) {
  return query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
}

function findById(id) {
  return query(`SELECT ${SAFE_USER_COLUMNS} FROM users WHERE id = $1`, [id]);
}

function findByVerificationToken(token) {
  return query('SELECT * FROM users WHERE email_verification_token = $1', [token]);
}

function findByPasswordResetToken(token) {
  return query('SELECT * FROM users WHERE password_reset_token = $1', [token]);
}

/**
 * Create a user. `data` keys: name, email, passwordHash, role,
 * email_verification_token (optional), email_verification_expires (optional).
 */
function createUser(data) {
  const {
    name,
    email,
    passwordHash,
    role,
    email_verification_token = null,
    email_verification_expires = null,
    email_verified = false,
  } = data;

  return query(
    `INSERT INTO users
       (name, email, password_hash, role,
        email_verification_token, email_verification_expires, email_verified)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING ${SAFE_USER_COLUMNS}`,
    [name, email, passwordHash, role, email_verification_token, email_verification_expires, email_verified]
  );
}

function setEmailVerified(userId) {
  return query(
    `UPDATE users
        SET email_verified = TRUE,
            email_verification_token = NULL,
            email_verification_expires = NULL
      WHERE id = $1
      RETURNING ${SAFE_USER_COLUMNS}`,
    [userId]
  );
}

function setVerificationToken(userId, token, expires) {
  return query(
    `UPDATE users
        SET email_verification_token = $2,
            email_verification_expires = $3
      WHERE id = $1`,
    [userId, token, expires]
  );
}

function setPasswordResetToken(userId, token, expires) {
  return query(
    `UPDATE users
        SET password_reset_token = $2,
            password_reset_expires = $3
      WHERE id = $1`,
    [userId, token, expires]
  );
}

function setNewPassword(userId, passwordHash) {
  return query(
    `UPDATE users
        SET password_hash = $2,
            password_reset_token = NULL,
            password_reset_expires = NULL
      WHERE id = $1
      RETURNING ${SAFE_USER_COLUMNS}`,
    [userId, passwordHash]
  );
}

function updateUser(id, fields) {
  const keys = Object.keys(fields);
  const values = Object.values(fields);
  const setClause = keys.map((k, i) => `${k} = $${i + 2}`).join(', ');
  return query(
    `UPDATE users SET ${setClause} WHERE id = $1 RETURNING ${SAFE_USER_COLUMNS}`,
    [id, ...values]
  );
}

module.exports = {
  findByEmail,
  findById,
  findByVerificationToken,
  findByPasswordResetToken,
  createUser,
  setEmailVerified,
  setVerificationToken,
  setPasswordResetToken,
  setNewPassword,
  updateUser,
};
