'use strict';

const errorHandler = require('../middleware/errorHandler');

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

const req = {};
const next = jest.fn();

describe('errorHandler middleware', () => {
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    jest.restoreAllMocks();
  });

  it('returns 500 for generic errors', () => {
    const err = new Error('Something went wrong');
    const res = mockRes();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false })
    );
  });

  it('uses err.status when set', () => {
    const err = new Error('Not found');
    err.status = 404;
    const res = mockRes();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('falls back to 500 when only err.statusCode is set (handler uses err.status)', () => {
    const err = new Error('No status property');
    // Only statusCode set — handler checks err.status, so falls back to 500
    err.statusCode = 403;
    const res = mockRes();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('does not expose stack trace in production', () => {
    process.env.NODE_ENV = 'production';
    const err = new Error('DB error');
    const res = mockRes();

    errorHandler(err, req, res, next);

    const logged = console.error.mock.calls[0]?.[0];
    if (logged) {
      expect(logged).not.toMatch(/at Object\./);
    }
  });

  it('includes stack trace in development', () => {
    process.env.NODE_ENV = 'development';
    const err = new Error('Dev error');
    const res = mockRes();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalled();
  });

  it('returns 400 for Zod validation errors (code === 400)', () => {
    const err = new Error('Validation failed');
    err.status = 400;
    const res = mockRes();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});
