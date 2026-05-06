const crypto = require('crypto');

/**
 * Generate a cryptographically secure URL-safe random token.
 * 32 bytes → 64-character hex string.
 */
function generateToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex');
}

/** Date that's `hours` hours from now. */
function expiryHours(hours) {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}

/** Date that's `days` days from now. */
function expiryDays(days) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

module.exports = { generateToken, expiryHours, expiryDays };
