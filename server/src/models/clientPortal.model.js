const { query } = require('../config/db');

// Look up all clients records linked to this user's email.
// Returns array of client_ids the user has access to.
async function getClientIdsForUserEmail(email) {
  const result = await query('SELECT id FROM clients WHERE LOWER(email) = LOWER($1)', [email]);
  return result.rows.map((r) => r.id);
}

function getMyProjects(clientIds) {
  if (clientIds.length === 0) return Promise.resolve({ rows: [] });
  return query(
    `SELECT p.*,
            u.name AS freelancer_name, u.email AS freelancer_email
     FROM projects p
     LEFT JOIN users u ON u.id = p.freelancer_id
     WHERE p.client_id = ANY($1::uuid[])
     ORDER BY p.created_at DESC`,
    [clientIds]
  );
}

async function getMyProjectById(projectId, clientIds) {
  if (clientIds.length === 0) return { rows: [] };
  const projResult = await query(
    `SELECT p.*,
            u.name AS freelancer_name, u.email AS freelancer_email
     FROM projects p
     LEFT JOIN users u ON u.id = p.freelancer_id
     WHERE p.id = $1 AND p.client_id = ANY($2::uuid[])`,
    [projectId, clientIds]
  );
  if (projResult.rows.length === 0) return { rows: [] };

  const milestones = await query(
    'SELECT * FROM milestones WHERE project_id = $1 ORDER BY due_date ASC',
    [projectId]
  );
  return { rows: [{ ...projResult.rows[0], milestones: milestones.rows }] };
}

function getMyInvoices(clientIds) {
  if (clientIds.length === 0) return Promise.resolve({ rows: [] });
  return query(
    `SELECT i.*,
            p.title AS project_title,
            u.name AS freelancer_name
     FROM invoices i
     LEFT JOIN projects p ON p.id = i.project_id
     LEFT JOIN users u ON u.id = i.freelancer_id
     WHERE i.client_id = ANY($1::uuid[])
     ORDER BY i.created_at DESC`,
    [clientIds]
  );
}

async function getMyInvoiceById(invoiceId, clientIds) {
  if (clientIds.length === 0) return { rows: [] };
  const invResult = await query(
    `SELECT i.*,
            p.title AS project_title,
            u.name AS freelancer_name, u.email AS freelancer_email,
            c.name AS client_name, c.company AS client_company,
            c.email AS client_email, c.phone AS client_phone, c.location AS client_location
     FROM invoices i
     LEFT JOIN projects p ON p.id = i.project_id
     LEFT JOIN users u ON u.id = i.freelancer_id
     LEFT JOIN clients c ON c.id = i.client_id
     WHERE i.id = $1 AND i.client_id = ANY($2::uuid[])`,
    [invoiceId, clientIds]
  );
  if (invResult.rows.length === 0) return { rows: [] };

  const items = await query(
    'SELECT * FROM invoice_items WHERE invoice_id = $1 ORDER BY id',
    [invoiceId]
  );
  return { rows: [{ ...invResult.rows[0], items: items.rows }] };
}

function acknowledgeInvoice(invoiceId, clientIds) {
  if (clientIds.length === 0) return Promise.resolve({ rows: [] });
  return query(
    `UPDATE invoices SET status = 'paid'
     WHERE id = $1 AND client_id = ANY($2::uuid[]) AND status = 'sent'
     RETURNING *`,
    [invoiceId, clientIds]
  );
}

module.exports = {
  getClientIdsForUserEmail,
  getMyProjects,
  getMyProjectById,
  getMyInvoices,
  getMyInvoiceById,
  acknowledgeInvoice,
};
