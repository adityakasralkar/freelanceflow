const { query } = require('../config/db');

function getAllProjects(freelancerId, filters = {}) {
  const conditions = ['p.freelancer_id = $1'];
  const values = [freelancerId];

  if (filters.status) {
    conditions.push(`p.status = $${values.length + 1}`);
    values.push(filters.status);
  }

  const where = conditions.join(' AND ');
  return query(
    `SELECT p.*, c.name AS client_name, c.email AS client_email, c.company AS client_company
     FROM projects p
     LEFT JOIN clients c ON c.id = p.client_id
     WHERE ${where}
     ORDER BY p.created_at DESC`,
    values
  );
}

function getProjectById(id, freelancerId) {
  return query(
    `SELECT p.*,
            c.name AS client_name, c.email AS client_email, c.company AS client_company,
            pr.title AS proposal_title,
            pr.amount AS proposal_amount,
            pr.payment_terms,
            pr.deliverables AS proposal_deliverables
     FROM projects p
     LEFT JOIN clients c ON c.id = p.client_id
     LEFT JOIN proposals pr ON pr.id = p.proposal_id
     WHERE p.id = $1 AND p.freelancer_id = $2`,
    [id, freelancerId]
  );
}

function createProject(data) {
  const { proposal_id, freelancer_id, client_id, title, description, start_date, end_date, total_amount } = data;
  return query(
    `INSERT INTO projects (proposal_id, freelancer_id, client_id, title, description, start_date, end_date, total_amount, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'active')
     RETURNING *`,
    [proposal_id, freelancer_id, client_id, title, description || null, start_date || null, end_date || null, total_amount || null]
  );
}

function updateProject(id, freelancerId, data) {
  const allowed = ['title', 'description', 'start_date', 'end_date', 'status'];
  const fields = Object.entries(data).filter(([k]) => allowed.includes(k));
  if (fields.length === 0) return getProjectById(id, freelancerId);

  const setClause = fields.map(([k], i) => `${k} = $${i + 3}`).join(', ');
  const values = fields.map(([, v]) => v);
  return query(
    `UPDATE projects SET ${setClause} WHERE id = $1 AND freelancer_id = $2 RETURNING *`,
    [id, freelancerId, ...values]
  );
}

module.exports = { getAllProjects, getProjectById, createProject, updateProject };
