function errorHandler(err, req, res, next) {
  console.error(err.stack);

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
