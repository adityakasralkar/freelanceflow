const { z } = require('zod');

/**
 * Production-grade password rules:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one digit
 * - At least one special character
 *
 * Used by every endpoint that creates or changes a password.
 * Mirror these rules in the frontend Zod schema (client/src/utils/passwordRules.ts).
 */
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain an uppercase letter')
  .regex(/[a-z]/, 'Password must contain a lowercase letter')
  .regex(/[0-9]/, 'Password must contain a digit')
  .regex(/[^A-Za-z0-9]/, 'Password must contain a special character');

module.exports = { passwordSchema };
