const { Router } = require('express');
const {
  register,
  login,
  verifyEmail,
  resendVerification,
  getMe,
} = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const {
  loginLimiter,
  generalAuthLimiter,
} = require('../middleware/rateLimiter');

const router = Router();

router.post('/register', generalAuthLimiter, register);
router.post('/login', loginLimiter, login);
router.post('/verify-email', generalAuthLimiter, verifyEmail);
router.post('/resend-verification', generalAuthLimiter, resendVerification);
router.get('/me', verifyToken, getMe);

module.exports = router;
