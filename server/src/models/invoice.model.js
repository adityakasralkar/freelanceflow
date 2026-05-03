const { query } = require('../config/db');

function getAllInvoices(freelancerId, filters = {}) {
  const conditions = ['i.freelancer_id = $1'];
  const values = [freelancerId];

  if (filters.status) {
    conditions.push(`i.status = $${values.length + 1}`);
    values.push(filters.status);
  }

  const where = conditions.join(' AND ');
  return query(
    `SELECT i.*,
            c.name AS client_name, c.company AS client_company,
            p.title AS project_title
     FROM invoices i
     LEFT JOIN clients c ON c.id = i.client_id
     LEFT JOIN projects p ON p.id = i.project_id
     WHERE ${where}
     ORDER BY i.created_at DESC`,
    values
  );
}

async function getInvoiceById(id, freelancerId) {
  const invResult = await query(
    `SELECT i.*,
            c.name AS client_name, c.company AS client_company, c.email AS client_email,
            c.phone AS client_phone, c.location AS client_location,
            p.title AS project_title
     FROM invoices i
     LEFT JOIN clients c ON c.id = i.client_id
     LEFT JOIN projects p ON p.id = i.project_id
     WHERE i.id = $1 AND i.freelancer_id = $2`,
    [id, freelancerId]
  );

  if (invResult.rows.length === 0) return { rows: [] };

  const invoice = invResult.rows[0];
  const itemsResult = await query(
    'SELECT * FROM invoice_items WHERE invoice_id = $1 ORDER BY id',
    [id]
  );

  return { rows: [{ ...invoice, items: itemsResult.rows }] };
}

function createInvoice(data) {
  const {
    project_id, milestone_id, freelancer_id, client_id, invoice_number,
    issue_date, due_date, subtotal, gst_amount, total_amount, status, notes,
  } = data;
  return query(
    `INSERT INTO invoices (project_id, milestone_id, freelancer_id, client_id, invoice_number,
                           issue_date, due_date, subtotal, gst_amount, total_amount, status, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
     RETURNING *`,
    [project_id, milestone_id, freelancer_id, client_id, invoice_number,
     issue_date, due_date, subtotal, gst_amount, total_amount, status || 'draft', notes || null]
  );
}

function createInvoiceItem(invoiceId, item) {
  const { description, quantity, rate, amount } = item;
  return query(
    `INSERT INTO invoice_items (invoice_id, description, quantity, rate, amount)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [invoiceId, description, quantity || 1, rate, amount]
  );
}

function updateInvoiceStatus(id, status) {
  return query(
    `UPDATE invoices SET status = $2 WHERE id = $1 RETURNING *`,
    [id, status]
  );
}

module.exports = { getAllInvoices, getInvoiceById, createInvoice, createInvoiceItem, updateInvoiceStatus };
