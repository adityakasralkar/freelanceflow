-- Migration 001: Add multi-currency support and configurable tax
-- Safe to re-run (uses IF NOT EXISTS where possible)

-- Add currency to clients, proposals, projects, invoices
ALTER TABLE clients   ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'INR';
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'INR';
ALTER TABLE projects  ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'INR';
ALTER TABLE invoices  ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'INR';

-- Rename gst_amount → tax_amount on invoices (only if old column still exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'invoices' AND column_name = 'gst_amount'
  ) THEN
    ALTER TABLE invoices RENAME COLUMN gst_amount TO tax_amount;
  END IF;
END $$;

-- Add tax_rate (0-1, e.g. 0.18 = 18%) and tax_label (e.g. 'GST', 'VAT')
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS tax_rate  NUMERIC(5,4) DEFAULT 0;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS tax_label VARCHAR(20);
