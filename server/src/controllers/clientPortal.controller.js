const {
  getClientIdsForUserEmail,
  getMyProjects,
  getMyProjectById,
  getMyInvoices,
  getMyInvoiceById,
  acknowledgeInvoice,
} = require('../models/clientPortal.model');

async function loadClientIds(req, res, next) {
  try {
    req.clientIds = await getClientIdsForUserEmail(req.user.email);
    next();
  } catch (err) {
    next(err);
  }
}

async function listMyProjects(req, res, next) {
  try {
    const result = await getMyProjects(req.clientIds);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
}

async function getOneProject(req, res, next) {
  try {
    const result = await getMyProjectById(req.params.id, req.clientIds);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Project not found', code: 404 });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

async function listMyInvoices(req, res, next) {
  try {
    const result = await getMyInvoices(req.clientIds);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
}

async function getOneInvoice(req, res, next) {
  try {
    const result = await getMyInvoiceById(req.params.id, req.clientIds);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Invoice not found', code: 404 });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

async function acknowledgeMyInvoice(req, res, next) {
  try {
    const result = await acknowledgeInvoice(req.params.id, req.clientIds);
    if (result.rows.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invoice not found or not in sent status',
        code: 400,
      });
    }
    res.json({ success: true, data: result.rows[0], message: 'Invoice acknowledged as paid' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  loadClientIds,
  listMyProjects,
  getOneProject,
  listMyInvoices,
  getOneInvoice,
  acknowledgeMyInvoice,
};
