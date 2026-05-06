-- Migration 002: Auth foundation — email verification, password reset, invitations
-- Safe to re-run (uses IF NOT EXISTS where possible)

-- ----------------------------------------------------------------------------
-- users — add verification + password reset columns
-- ----------------------------------------------------------------------------
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified              BOOLEAN     DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verification_token    VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verification_expires  TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_token        VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_expires      TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_users_email_verification_token ON users(email_verification_token);
CREATE INDEX IF NOT EXISTS idx_users_password_reset_token     ON users(password_reset_token);

-- ----------------------------------------------------------------------------
-- invitations — freelancer invites client by email
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS invitations (
  id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  freelancer_id  UUID         NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
  client_id      UUID         NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  email          VARCHAR(255) NOT NULL,
  token          VARCHAR(255) UNIQUE NOT NULL,
  expires_at     TIMESTAMPTZ  NOT NULL,
  accepted_at    TIMESTAMPTZ,
  revoked_at     TIMESTAMPTZ,
  created_at     TIMESTAMPTZ  DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invitations_token         ON invitations(token);
CREATE INDEX IF NOT EXISTS idx_invitations_email         ON invitations(LOWER(email));
CREATE INDEX IF NOT EXISTS idx_invitations_freelancer_id ON invitations(freelancer_id);
CREATE INDEX IF NOT EXISTS idx_invitations_client_id     ON invitations(client_id);
