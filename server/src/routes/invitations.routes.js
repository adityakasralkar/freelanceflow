const { Router } = require('express');
const {
  getInvitationByToken,
  acceptInvitation,
} = require('../controllers/invitations.controller');
const { generalAuthLimiter } = require('../middleware/rateLimiter');

const router = Router();

// Public — no auth, used to render the accept-invite page and complete signup.
router.get('/:token', getInvitationByToken);
router.post('/:token/accept', generalAuthLimiter, acceptInvitation);

module.exports = router;
