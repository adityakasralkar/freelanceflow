const { z } = require('zod');
const {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
} = require('../models/client.model');
const { SUPPORTED_CURRENCIES } = require('../utils/currencies');

const clientSchema = z.object({
  name: z.string().min(1),
  company: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  currency: z.enum(SUPPORTED_CURRENCIES).optional(),
});

async function getAll(req, res, next) {
  try {
    const result = await getAllClients(req.user.id);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const result = await getClientById(req.params.id, req.user.id);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Client not found', code: 404 });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const parsed = clientSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: parsed.error.errors, code: 400 });
    }
    const result = await createClient(req.user.id, parsed.data);
    res.status(201).json({ success: true, data: result.rows[0], message: 'Client created successfully' });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const parsed = clientSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: parsed.error.errors, code: 400 });
    }
    const result = await updateClient(req.params.id, req.user.id, parsed.data);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Client not found', code: 404 });
    }
    res.json({ success: true, data: result.rows[0], message: 'Client updated successfully' });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const result = await deleteClient(req.params.id, req.user.id);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Client not found', code: 404 });
    }
    res.json({ success: true, message: 'Client deleted successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getOne, create, update, remove };
