const { query } = require('../config/db');

function getAllProposals(freelancerId, filters = {}) {
  const conditions = ['p.freelancer_id = $1'];
  const values = [freelancerId];

  if (filters.status) {
    conditions.push(`p.status = $${values.length + 1}`);
    values.push(filters.status);
  }

  const where = conditions.join(' AND ');
  return query(
    `SELECT p.*, c.name AS client_name, c.email AS client_email, c.company AS client_company
     FROM proposals p
     LEFT JOIN clients c ON c.id = p.client_id
     WHERE ${where}
     ORDER BY p.created_at DESC`,
    values
  );
}

function getProposalById(id, freelancerId) {
  return query(
    `SELECT p.*, c.name AS client_name, c.email AS client_email, c.company AS client_company
     FROM proposals p
     LEFT JOIN clients c ON c.id = p.client_id
     WHERE p.id = $1 AND p.freelancer_id = $2`,
    [id, freelancerId]
  );
}

function createProposal(freelancerId, data) {
  const { client_id, title, description, amount, status, valid_until, payment_terms, deliverables } = data;
  return query(
    `INSERT INTO proposals (freelancer_id, client_id, title, description, amount, status, valid_until, payment_terms, deliverables)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      freelancerId,
      client_id,
      title,
      description || null,
      amount,
      status || 'draft',
      valid_until || null,
      payment_terms || null,
      JSON.stringify(deliverables || []),
    ]
  );
}

function updateProposal(id, freelancerId, data) {
  const allowed = ['title', 'description', 'amount', 'valid_until', 'payment_terms', 'deliverables', 'client_id'];
  const fields = Object.entries(data).filter(([k]) => allowed.includes(k));
  if (fields.length === 0) return getProposalById(id, freelancerId);

  const setClause = fields.map(([k], i) => `${k} = $${i + 3}`).join(', ');
  const values = fields.map(([, v]) => v);
  return query(
    `UPDATE proposals SET ${setClause} WHERE id = $1 AND freelancer_id = $2 RETURNING *`,
    [id, freelancerId, ...values]
  );
}

function updateProposalStatus(id, freelancerId, status) {
  return query(
    `UPDATE proposals SET status = $3 WHERE id = $1 AND freelancer_id = $2 RETURNING *`,
    [id, freelancerId, status]
  );
}

function deleteProposal(id, freelancerId) {
  return query(
    `DELETE FROM proposals WHERE id = $1 AND freelancer_id = $2 AND status = 'draft' RETURNING *`,
    [id, freelancerId]
  );
}

module.exports = {
  getAllProposals,
  getProposalById,
  createProposal,
  updateProposal,
  updateProposalStatus,
  deleteProposal,
};
