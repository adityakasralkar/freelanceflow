'use strict';

const jwt = require('jsonwebtoken');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

process.env.JWT_SECRET = 'test-secret';

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

const next = jest.fn();

beforeEach(() => jest.clearAllMocks());

describe('verifyToken', () => {
  it('returns 401 when no authorization header', () => {
    const req = { headers: {} };
    const res = mockRes();
    verifyToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ code: 401 }));
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when header does not start with Bearer', () => {
    const req = { headers: { authorization: 'Basic abc123' } };
    const res = mockRes();
    verifyToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('returns 401 for invalid/tampered token', () => {
    const req = { headers: { authorization: 'Bearer invalid.token.here' } };
    const res = mockRes();
    verifyToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Invalid or expired token' }));
  });

  it('returns 401 for expired token', () => {
    const expired = jwt.sign({ id: 'u-1', role: 'freelancer' }, 'test-secret', { expiresIn: -1 });
    const req = { headers: { authorization: `Bearer ${expired}` } };
    const res = mockRes();
    verifyToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('sets req.user and calls next for valid token', () => {
    const token = jwt.sign({ id: 'u-1', email: 'a@b.com', role: 'freelancer' }, 'test-secret', { expiresIn: '1h' });
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = mockRes();
    verifyToken(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.user).toMatchObject({ id: 'u-1', email: 'a@b.com', role: 'freelancer' });
  });
});

describe('requireRole', () => {
  it('returns 403 when no user on request', () => {
    const middleware = requireRole('freelancer');
    const req = {};
    const res = mockRes();
    middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('returns 403 when role does not match', () => {
    const middleware = requireRole('freelancer');
    const req = { user: { role: 'client' } };
    const res = mockRes();
    middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next when role matches', () => {
    const middleware = requireRole('freelancer');
    const req = { user: { role: 'freelancer' } };
    const res = mockRes();
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('calls next for client role when required', () => {
    const middleware = requireRole('client');
    const req = { user: { role: 'client' } };
    const res = mockRes();
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
