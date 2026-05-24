const { z } = require('zod');
const { query } = require('../config/db');
const {
  getMilestonesByProject,
  getMilestoneById,
  createMilestone,
  updateMilestone,
  completeMilestone,
} = require('../models/milestone.model');

const milestoneSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  due_date: z.string(),
  amount: z.number().positive(),
});

async function getByProject(req, res, next) {
  try {
    const result = await getMilestonesByProject(req.params.projectId);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const parsed = milestoneSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: parsed.error.errors, code: 400 });
    }
    const result = await createMilestone(req.params.projectId, parsed.data);
    res.status(201).json({ success: true, data: result.rows[0], message: 'Milestone created successfully' });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const parsed = milestoneSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: parsed.error.errors, code: 400 });
    }
    const result = await updateMilestone(req.params.id, parsed.data);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Milestone not found', code: 404 });
    }
    res.json({ success: true, data: result.rows[0], message: 'Milestone updated successfully' });
  } catch (err) {
    next(err);
  }
}

async function complete(req, res, next) {
  try {
    const milestoneResult = await getMilestoneById(req.params.id);
    if (milestoneResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Milestone not found', code: 404 });
    }

    if (milestoneResult.rows[0].status === 'completed') {
      return res.status(400).json({ success: false, error: 'Milestone is already completed', code: 400 });
    }

    const updated = await completeMilestone(req.params.id);
    const milestone = updated.rows[0];

    // Check if an invoice already exists for this milestone
    const invoiceCheck = await query(
      'SELECT id FROM invoices WHERE milestone_id = $1',
      [req.params.id]
    );
    const canGenerateInvoice = invoiceCheck.rows.length === 0;

    res.json({
      success: true,
      data: { milestone, canGenerateInvoice },
      message: 'Milestone marked as complete',
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getByProject, create, update, complete };
