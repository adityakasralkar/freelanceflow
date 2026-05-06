const rateLimit = require('express-rate-limit');

const standardResponse = (req, res) => {
  res.status(429).json({
    success: false,
    error: 'Too many requests. Please try again later.',
    code: 429,
  });
};

// Strict: login endpoint — 5 FAILED attempts per 15 minutes per IP.
// Successful logins don't count against the limit.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: standardResponse,
});

// Forgot password: 3 attempts per hour per IP
const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 3,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: standardResponse,
});

// General auth (register, resend verification): 10 per 5 minutes
const generalAuthLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: standardResponse,
});

module.exports = { loginLimiter, forgotPasswordLimiter, generalAuthLimiter };
