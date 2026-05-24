const { query } = require('../config/db');

function getMilestonesByProject(projectId) {
  return query(
    'SELECT * FROM milestones WHERE project_id = $1 ORDER BY due_date ASC',
    [projectId]
  );
}

function getMilestoneById(id) {
  return query('SELECT * FROM milestones WHERE id = $1', [id]);
}

function createMilestone(projectId, data) {
  const { title, description, due_date, amount } = data;
  return query(
    `INSERT INTO milestones (project_id, title, description, due_date, amount)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [projectId, title, description || null, due_date, amount]
  );
}

function updateMilestone(id, data) {
  const allowed = ['title', 'description', 'due_date', 'amount', 'status'];
  const fields = Object.entries(data).filter(([k]) => allowed.includes(k));
  if (fields.length === 0) return getMilestoneById(id);

  const setClause = fields.map(([k], i) => `${k} = $${i + 2}`).join(', ');
  const values = fields.map(([, v]) => v);
  return query(
    `UPDATE milestones SET ${setClause} WHERE id = $1 RETURNING *`,
    [id, ...values]
  );
}

function completeMilestone(id) {
  return query(
    `UPDATE milestones SET status = 'completed', completed_at = NOW()
     WHERE id = $1 AND status != 'completed' RETURNING *`,
    [id]
  );
}

module.exports = { getMilestonesByProject, getMilestoneById, createMilestone, updateMilestone, completeMilestone };
