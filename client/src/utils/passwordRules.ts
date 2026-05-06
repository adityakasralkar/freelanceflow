import { z } from 'zod';

/**
 * Password validation rules — mirror of `server/src/utils/passwordValidator.js`.
 * Keep these in sync with the backend Zod schema.
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Must contain an uppercase letter')
  .regex(/[a-z]/, 'Must contain a lowercase letter')
  .regex(/[0-9]/, 'Must contain a digit')
  .regex(/[^A-Za-z0-9]/, 'Must contain a special character');

export const passwordHelperText =
  'At least 8 characters with uppercase, lowercase, digit, and special character.';
