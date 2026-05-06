-- Migration 003: Grandfather existing users as email-verified.
-- All accounts that existed before email verification was introduced are
-- considered verified — they predate the requirement.
-- New accounts created after this point will have email_verified = FALSE
-- and must verify via the email flow.
-- Idempotent: running on a fresh DB is a no-op (no rows yet).

UPDATE users SET email_verified = TRUE WHERE email_verified = FALSE;
