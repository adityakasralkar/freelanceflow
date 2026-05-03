const { z } = require('zod');
const { getAllProjects, getProjectById, updateProject } = require('../models/project.model');

const updateProjectSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  status: z.enum(['active', 'on_hold', 'completed', 'archived']).optional(),
});

async function getAll(req, res, next) {
  try {
    const filters = {};
    if (req.query.status) filters.status = req.query.status;
    const result = await getAllProjects(req.user.id, filters);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const result = await getProjectById(req.params.id, req.user.id);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Project not found', code: 404 });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const parsed = updateProjectSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: parsed.error.errors, code: 400 });
    }
    const result = await updateProject(req.params.id, req.user.id, parsed.data);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Project not found', code: 404 });
    }
    res.json({ success: true, data: result.rows[0], message: 'Project updated successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getOne, update };
