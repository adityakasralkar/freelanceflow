const { Router } = require('express');
const {
  getAll, getOne, generateFromMilestoneController, updateStatus,
} = require('../controllers/invoices.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const router = Router();

router.use(verifyToken);

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/generate/:milestoneId', generateFromMilestoneController);
router.patch('/:id/status', updateStatus);

module.exports = router;
