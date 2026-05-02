const { query } = require('../config/db');

function findByEmail(email) {
  return query('SELECT * FROM users WHERE email = $1', [email]);
}

function findById(id) {
  return query(
    'SELECT id, email, role, name, created_at FROM users WHERE id = $1',
    [id]
  );
}

function createUser(name, email, passwordHash, role) {
  return query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, email, role, name, created_at`,
    [name, email, passwordHash, role]
  );
}

function updateUser(id, fields) {
  const keys = Object.keys(fields);
  const values = Object.values(fields);
  const setClause = keys.map((k, i) => `${k} = $${i + 2}`).join(', ');
  return query(
    `UPDATE users SET ${setClause} WHERE id = $1 RETURNING id, email, role, name, created_at`,
    [id, ...values]
  );
}

module.exports = { findByEmail, findById, createUser, updateUser };
