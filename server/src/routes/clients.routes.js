const { Router } = require('express');
const { getAll, getOne, create, update, remove } = require('../controllers/clients.controller');
const {
  getInviteStatus,
  sendInvite,
  revokeInvite,
} = require('../controllers/invitations.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { generalAuthLimiter } = require('../middleware/rateLimiter');

const router = Router();

router.use(verifyToken);

router.get('/', getAll);
router.post('/', create);
router.get('/:id', getOne);
router.patch('/:id', update);
router.delete('/:id', remove);

// Invitations (freelancer-side)
router.get('/:id/invite', getInviteStatus);
router.post('/:id/invite', generalAuthLimiter, sendInvite);
router.delete('/:id/invite', revokeInvite);

module.exports = router;
