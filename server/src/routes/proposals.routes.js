const { Router } = require('express');
const {
  getAll, getOne, create, update, updateStatus, convertProposalToProject, remove,
} = require('../controllers/proposals.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const router = Router();

router.use(verifyToken);

router.get('/', getAll);
router.post('/', create);
router.get('/:id', getOne);
router.patch('/:id', update);
router.delete('/:id', remove);
router.patch('/:id/status', updateStatus);
router.post('/:id/convert', convertProposalToProject);

module.exports = router;
