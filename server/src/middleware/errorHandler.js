const { reportError } = require('../otel');

// Status code that will be sent for this error (PostgreSQL codes are mapped).
function statusFor(err) {
  if (err.code === '23505') return 409;
  if (err.code === '23503') return 400;
  return err.status || 500;
}

function errorHandler(err, req, res, next) {
  reportError(err, req, statusFor(err));

  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  } else {
    console.error(`[${new Date().toISOString()}] ${err.message}`);
  }

  // PostgreSQL unique violation
  if (err.code === '23505') {
    return res.status(409).json({ success: false, error: 'Resource already exists', code: 409 });
  }

  // PostgreSQL foreign key violation
  if (err.code === '23503') {
    return res.status(400).json({ success: false, error: 'Referenced resource not found', code: 400 });
  }

  const status = err.status || 500;
  const message = err.message || 'Internal server error';

  res.status(status).json({ success: false, error: message, code: status });
}

module.exports = errorHandler;
