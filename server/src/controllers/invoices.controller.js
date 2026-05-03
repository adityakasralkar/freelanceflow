const { z } = require('zod');
const {
  getAllInvoices,
  getInvoiceById,
  updateInvoiceStatus,
} = require('../models/invoice.model');
const {
  generateFromMilestone,
  validateInvoiceStatusTransition,
} = require('../services/invoice.service');

const statusSchema = z.object({
  status: z.enum(['draft', 'sent', 'paid', 'overdue']),
});

async function getAll(req, res, next) {
  try {
    const filters = {};
    if (req.query.status) filters.status = req.query.status;
    const result = await getAllInvoices(req.user.id, filters);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const result = await getInvoiceById(req.params.id, req.user.id);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Invoice not found', code: 404 });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

async function generateFromMilestoneController(req, res, next) {
  try {
    const invoice = await generateFromMilestone(req.params.milestoneId, req.user.id, req.body);
    res.status(201).json({ success: true, data: invoice, message: 'Invoice generated successfully' });
  } catch (err) {
    next(err);
  }
}

async function updateStatus(req, res, next) {
  try {
    const parsed = statusSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: parsed.error.errors, code: 400 });
    }

    const current = await getInvoiceById(req.params.id, req.user.id);
    if (current.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Invoice not found', code: 404 });
    }

    validateInvoiceStatusTransition(current.rows[0].status, parsed.data.status);

    const result = await updateInvoiceStatus(req.params.id, parsed.data.status);
    res.json({ success: true, data: result.rows[0], message: 'Invoice status updated' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getOne, generateFromMilestoneController, updateStatus };
