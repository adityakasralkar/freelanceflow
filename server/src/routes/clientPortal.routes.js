const { Router } = require('express');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');
const {
  loadClientIds,
  listMyProjects,
  getOneProject,
  listMyInvoices,
  getOneInvoice,
  acknowledgeMyInvoice,
} = require('../controllers/clientPortal.controller');

const router = Router();

// All client portal routes require an authenticated user with role='client'
router.use(verifyToken);
router.use(requireRole('client'));
router.use(loadClientIds);

router.get('/my-projects', listMyProjects);
router.get('/my-projects/:id', getOneProject);
router.get('/my-invoices', listMyInvoices);
router.get('/my-invoices/:id', getOneInvoice);
router.patch('/my-invoices/:id/acknowledge', acknowledgeMyInvoice);

module.exports = router;
