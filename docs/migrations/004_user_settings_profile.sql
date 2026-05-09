-- Migration 004: Freelancer settings and invoice profile fields
-- Safe to re-run (uses IF NOT EXISTS where possible)

ALTER TABLE users ADD COLUMN IF NOT EXISTS phone                 VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS location              VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS business_name         VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS gst_number            VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS gst_enabled           BOOLEAN      DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS business_address      TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS invoice_prefix        VARCHAR(20)  DEFAULT 'INV-';
ALTER TABLE users ADD COLUMN IF NOT EXISTS default_payment_terms VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS default_due_days      INTEGER      DEFAULT 14;
ALTER TABLE users ADD COLUMN IF NOT EXISTS upi_id                VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS bank_name             VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS account_number        VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS ifsc_code             VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS account_holder_name   VARCHAR(255);
