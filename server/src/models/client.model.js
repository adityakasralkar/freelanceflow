const { query } = require('../config/db');

function getAllClients(freelancerId) {
  return query(
    'SELECT * FROM clients WHERE freelancer_id = $1 ORDER BY created_at DESC',
    [freelancerId]
  );
}

function getClientById(id, freelancerId) {
  return query(
    'SELECT * FROM clients WHERE id = $1 AND freelancer_id = $2',
    [id, freelancerId]
  );
}

function createClient(freelancerId, data) {
  const { name, company, email, phone, location, currency } = data;
  return query(
    `INSERT INTO clients (freelancer_id, name, company, email, phone, location, currency)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [freelancerId, name, company || null, email || null, phone || null, location || null, currency || 'INR']
  );
}

function updateClient(id, freelancerId, data) {
  const allowed = ['name', 'company', 'email', 'phone', 'location', 'currency'];
  const fields = Object.entries(data).filter(([k, v]) => allowed.includes(k) && v !== undefined);
  if (fields.length === 0) return getClientById(id, freelancerId);
  const setClause = fields.map(([k], i) => `${k} = $${i + 3}`).join(', ');
  const values = fields.map(([, v]) => v);
  return query(
    `UPDATE clients SET ${setClause} WHERE id = $1 AND freelancer_id = $2 RETURNING *`,
    [id, freelancerId, ...values]
  );
}

function deleteClient(id, freelancerId) {
  return query(
    'DELETE FROM clients WHERE id = $1 AND freelancer_id = $2 RETURNING *',
    [id, freelancerId]
  );
}

module.exports = { getAllClients, getClientById, createClient, updateClient, deleteClient };
