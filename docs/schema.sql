-- FreelanceFlow Database Schema
-- Run once to initialize all tables. Safe to re-run (uses IF NOT EXISTS).

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- users
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email                       VARCHAR(255) UNIQUE NOT NULL,
  password_hash               VARCHAR(255) NOT NULL,
  role                        VARCHAR(20) NOT NULL CHECK (role IN ('freelancer', 'client')),
  name                        VARCHAR(255) NOT NULL,
  email_verified              BOOLEAN DEFAULT FALSE,
  email_verification_token    VARCHAR(255),
  email_verification_expires  TIMESTAMPTZ,
  password_reset_token        VARCHAR(255),
  password_reset_expires      TIMESTAMPTZ,
  created_at                  TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- clients
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS clients (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  freelancer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name          VARCHAR(255) NOT NULL,
  company       VARCHAR(255),
  email         VARCHAR(255),
  phone         VARCHAR(50),
  location      VARCHAR(255),
  currency      VARCHAR(3) DEFAULT 'INR',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- proposals
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS proposals (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  freelancer_id  UUID REFERENCES users(id) ON DELETE CASCADE,
  client_id      UUID REFERENCES clients(id) ON DELETE SET NULL,
  title          VARCHAR(500) NOT NULL,
  description    TEXT,
  amount         NUMERIC(12,2) NOT NULL,
  status         VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'declined')),
  valid_until    DATE,
  payment_terms  VARCHAR(100),
  deliverables   JSONB DEFAULT '[]',
  currency       VARCHAR(3) DEFAULT 'INR',
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- projects
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id   UUID REFERENCES proposals(id) ON DELETE SET NULL,
  freelancer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  client_id     UUID REFERENCES clients(id) ON DELETE SET NULL,
  title         VARCHAR(500) NOT NULL,
  description   TEXT,
  start_date    DATE,
  end_date      DATE,
  total_amount  NUMERIC(12,2),
  status        VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'on_hold', 'completed', 'archived')),
  currency      VARCHAR(3) DEFAULT 'INR',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- milestones
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS milestones (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   UUID REFERENCES projects(id) ON DELETE CASCADE,
  title        VARCHAR(500) NOT NULL,
  description  TEXT,
  due_date     DATE,
  amount       NUMERIC(12,2) NOT NULL,
  status       VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'in_progress', 'completed')),
  completed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- invoices
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS invoices (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id     UUID REFERENCES projects(id) ON DELETE SET NULL,
  milestone_id   UUID REFERENCES milestones(id) ON DELETE SET NULL,
  freelancer_id  UUID REFERENCES users(id) ON DELETE CASCADE,
  client_id      UUID REFERENCES clients(id) ON DELETE SET NULL,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  issue_date     DATE NOT NULL,
  due_date       DATE NOT NULL,
  subtotal       NUMERIC(12,2) NOT NULL,
  tax_amount     NUMERIC(12,2) DEFAULT 0,
  tax_rate       NUMERIC(5,4) DEFAULT 0,
  tax_label      VARCHAR(20),
  total_amount   NUMERIC(12,2) NOT NULL,
  status         VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue')),
  currency       VARCHAR(3) DEFAULT 'INR',
  notes          TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- invoice_items
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS invoice_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id  UUID REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity    NUMERIC(8,2) DEFAULT 1,
  rate        NUMERIC(12,2) NOT NULL,
  amount      NUMERIC(12,2) NOT NULL
);

-- -----------------------------------------------------------------------------
-- invitations
-- -----------------------------------------------------------------------------
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

-- -----------------------------------------------------------------------------
-- Indexes
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_clients_freelancer_id       ON clients(freelancer_id);
CREATE INDEX IF NOT EXISTS idx_proposals_freelancer_id     ON proposals(freelancer_id);
CREATE INDEX IF NOT EXISTS idx_proposals_client_id         ON proposals(client_id);
CREATE INDEX IF NOT EXISTS idx_proposals_status            ON proposals(status);
CREATE INDEX IF NOT EXISTS idx_projects_freelancer_id      ON projects(freelancer_id);
CREATE INDEX IF NOT EXISTS idx_projects_client_id          ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_proposal_id        ON projects(proposal_id);
CREATE INDEX IF NOT EXISTS idx_projects_status             ON projects(status);
CREATE INDEX IF NOT EXISTS idx_milestones_project_id       ON milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_milestones_status           ON milestones(status);
CREATE INDEX IF NOT EXISTS idx_invoices_freelancer_id      ON invoices(freelancer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_client_id          ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_project_id         ON invoices(project_id);
CREATE INDEX IF NOT EXISTS idx_invoices_milestone_id       ON invoices(milestone_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status             ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id    ON invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_users_email_verification_token ON users(email_verification_token);
CREATE INDEX IF NOT EXISTS idx_users_password_reset_token     ON users(password_reset_token);
CREATE INDEX IF NOT EXISTS idx_invitations_token              ON invitations(token);
CREATE INDEX IF NOT EXISTS idx_invitations_email              ON invitations(LOWER(email));
CREATE INDEX IF NOT EXISTS idx_invitations_freelancer_id      ON invitations(freelancer_id);
CREATE INDEX IF NOT EXISTS idx_invitations_client_id          ON invitations(client_id);
