const { z } = require('zod');
const {
  getAllProposals,
  getProposalById,
  createProposal,
  updateProposal,
  updateProposalStatus,
  deleteProposal,
} = require('../models/proposal.model');
const { getClientById } = require('../models/client.model');
const { validateStatusTransition, convertToProject } = require('../services/proposal.service');
const { SUPPORTED_CURRENCIES } = require('../utils/currencies');

const proposalSchema = z.object({
  client_id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  amount: z.number().positive(),
  valid_until: z.string().optional(),
  payment_terms: z.string().optional(),
  deliverables: z.array(z.string()).optional(),
  currency: z.enum(SUPPORTED_CURRENCIES).optional(),
});

const statusSchema = z.object({
  status: z.enum(['draft', 'sent', 'accepted', 'declined']),
});

async function getAll(req, res, next) {
  try {
    const filters = {};
    if (req.query.status) filters.status = req.query.status;
    const result = await getAllProposals(req.user.id, filters);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const result = await getProposalById(req.params.id, req.user.id);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Proposal not found', code: 404 });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const parsed = proposalSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: parsed.error.errors, code: 400 });
    }

    // Inherit currency from client if not explicitly provided
    let currency = parsed.data.currency;
    if (!currency) {
      const clientResult = await getClientById(parsed.data.client_id, req.user.id);
      if (clientResult.rows.length === 0) {
        return res.status(400).json({ success: false, error: 'Client not found', code: 400 });
      }
      currency = clientResult.rows[0].currency || 'INR';
    }

    const result = await createProposal(req.user.id, { ...parsed.data, currency, status: 'draft' });
    res.status(201).json({ success: true, data: result.rows[0], message: 'Proposal created successfully' });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const parsed = proposalSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: parsed.error.errors, code: 400 });
    }
    const result = await updateProposal(req.params.id, req.user.id, parsed.data);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Proposal not found', code: 404 });
    }
    res.json({ success: true, data: result.rows[0], message: 'Proposal updated successfully' });
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

    const current = await getProposalById(req.params.id, req.user.id);
    if (current.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Proposal not found', code: 404 });
    }

    validateStatusTransition(current.rows[0].status, parsed.data.status);

    const result = await updateProposalStatus(req.params.id, req.user.id, parsed.data.status);
    res.json({ success: true, data: result.rows[0], message: 'Proposal status updated' });
  } catch (err) {
    next(err);
  }
}

async function convertProposalToProject(req, res, next) {
  try {
    const project = await convertToProject(req.params.id, req.user.id, req.body);
    res.status(201).json({ success: true, data: project, message: 'Proposal converted to project' });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const result = await deleteProposal(req.params.id, req.user.id);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Proposal not found or not in draft status', code: 404 });
    }
    res.json({ success: true, message: 'Proposal deleted successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getOne, create, update, updateStatus, convertProposalToProject, remove };
