const { Router } = require('express');
const {
  register,
  login,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  getMe,
} = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const {
  loginLimiter,
  generalAuthLimiter,
  forgotPasswordLimiter,
} = require('../middleware/rateLimiter');

const router = Router();

router.post('/register', generalAuthLimiter, register);
router.post('/login', loginLimiter, login);
router.post('/verify-email', generalAuthLimiter, verifyEmail);
router.post('/resend-verification', generalAuthLimiter, resendVerification);
router.post('/forgot-password', forgotPasswordLimiter, forgotPassword);
router.post('/reset-password', generalAuthLimiter, resetPassword);
router.get('/me', verifyToken, getMe);

module.exports = router;
