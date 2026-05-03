const { query } = require('../config/db');
const generateInvoiceNumber = require('../utils/generateInvoiceNumber');

const VALID_TRANSITIONS = {
  draft: ['sent'],
  sent: ['paid', 'overdue'],
  paid: [],
  overdue: ['paid'],
};

async function generateFromMilestone(milestoneId, freelancerId, extraData = {}) {
  // Fetch milestone + project (to inherit currency)
  const msResult = await query(
    `SELECT m.*, p.client_id, p.freelancer_id AS project_freelancer_id, p.id AS project_id, p.currency AS project_currency
     FROM milestones m
     JOIN projects p ON p.id = m.project_id
     WHERE m.id = $1`,
    [milestoneId]
  );

  if (msResult.rows.length === 0) {
    const err = new Error('Milestone not found');
    err.status = 404;
    throw err;
  }

  const milestone = msResult.rows[0];

  if (milestone.project_freelancer_id !== freelancerId) {
    const err = new Error('Access forbidden');
    err.status = 403;
    throw err;
  }

  if (milestone.status !== 'completed') {
    const err = new Error('Only completed milestones can be invoiced');
    err.status = 400;
    throw err;
  }

  // Check no invoice already exists
  const existing = await query(
    'SELECT id FROM invoices WHERE milestone_id = $1',
    [milestoneId]
  );
  if (existing.rows.length > 0) {
    const err = new Error('Invoice already exists for this milestone');
    err.status = 409;
    throw err;
  }

  const invoiceNumber = await generateInvoiceNumber();

  const subtotal = parseFloat(milestone.amount);
  const taxRate = extraData.tax_rate !== undefined ? Number(extraData.tax_rate) : 0;
  const taxLabel = extraData.tax_label || null;
  const taxAmount = +(subtotal * taxRate).toFixed(2);
  const totalAmount = +(subtotal + taxAmount).toFixed(2);
  const currency = extraData.currency || milestone.project_currency || 'INR';

  const issueDate = extraData.issue_date || new Date().toISOString().split('T')[0];
  const dueDate = extraData.due_date || (() => {
    const d = new Date();
    d.setDate(d.getDate() + 15);
    return d.toISOString().split('T')[0];
  })();

  // Insert invoice
  const invResult = await query(
    `INSERT INTO invoices (project_id, milestone_id, freelancer_id, client_id, invoice_number,
                           issue_date, due_date, subtotal, tax_amount, tax_rate, tax_label,
                           total_amount, status, currency, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'draft', $13, $14)
     RETURNING *`,
    [
      milestone.project_id,
      milestoneId,
      freelancerId,
      milestone.client_id,
      invoiceNumber,
      issueDate,
      dueDate,
      subtotal,
      taxAmount,
      taxRate,
      taxLabel,
      totalAmount,
      currency,
      extraData.notes || null,
    ]
  );

  const invoice = invResult.rows[0];

  // Insert single line item from milestone
  const itemResult = await query(
    `INSERT INTO invoice_items (invoice_id, description, quantity, rate, amount)
     VALUES ($1, $2, 1, $3, $3)
     RETURNING *`,
    [invoice.id, milestone.title, subtotal]
  );

  return { ...invoice, items: itemResult.rows };
}

function validateInvoiceStatusTransition(currentStatus, newStatus) {
  const allowed = VALID_TRANSITIONS[currentStatus] || [];
  if (!allowed.includes(newStatus)) {
    const err = new Error(
      `Cannot transition invoice from '${currentStatus}' to '${newStatus}'. Allowed: ${allowed.join(', ') || 'none'}`
    );
    err.status = 400;
    throw err;
  }
}

module.exports = { generateFromMilestone, validateInvoiceStatusTransition };
