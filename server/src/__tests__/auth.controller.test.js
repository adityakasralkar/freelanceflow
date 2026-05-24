'use strict';

jest.mock('../config/db', () => ({ query: jest.fn() }));
jest.mock('../models/user.model');
jest.mock('../services/email.service');
jest.mock('../utils/tokenGenerator', () => ({
  generateToken: jest.fn().mockReturnValue('mock-token-123'),
  expiryHours: jest.fn().mockReturnValue(new Date('2026-12-31')),
}));

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  findByEmail,
  createUser,
  findByVerificationToken,
  setEmailVerified,
} = require('../models/user.model');
const { sendVerificationEmail } = require('../services/email.service');
const { register, login, verifyEmail } = require('../controllers/auth.controller');

process.env.JWT_SECRET = 'test-secret';
process.env.JWT_EXPIRES_IN = '7d';

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

const next = jest.fn();

describe('auth controller — register()', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 400 for missing fields', async () => {
    const req = { body: { email: 'bad@example.com' } };
    const res = mockRes();

    await register(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 400 for weak password', async () => {
    const req = { body: { name: 'Test User', email: 'test@example.com', password: '123' } };
    const res = mockRes();

    await register(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 409 when email already exists', async () => {
    findByEmail.mockResolvedValue({ rows: [{ id: 'existing', email: 'test@example.com' }] });

    const req = {
      body: { name: 'Test User', email: 'test@example.com', password: 'Password123!' },
    };
    const res = mockRes();

    await register(req, res, next);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.stringContaining('already exists') })
    );
  });

  it('creates a new freelancer account successfully', async () => {
    findByEmail.mockResolvedValue({ rows: [] });
    createUser.mockResolvedValue({
      rows: [{ id: 'user-1', name: 'Test User', email: 'test@example.com', role: 'freelancer' }],
    });
    sendVerificationEmail.mockResolvedValue(undefined);

    const req = {
      body: { name: 'Test User', email: 'test@example.com', password: 'Password123!' },
    };
    const res = mockRes();

    await register(req, res, next);

    expect(createUser).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true })
    );
  });
});

describe('auth controller — login()', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 400 for invalid email format', async () => {
    const req = { body: { email: 'not-an-email', password: 'password' } };
    const res = mockRes();

    await login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 401 when user does not exist', async () => {
    findByEmail.mockResolvedValue({ rows: [] });

    const req = { body: { email: 'nobody@example.com', password: 'password' } };
    const res = mockRes();

    await login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('returns 401 for wrong password', async () => {
    findByEmail.mockResolvedValue({
      rows: [{ id: 'u-1', email: 'user@example.com', password_hash: await bcrypt.hash('correct', 10), email_verified: true, role: 'freelancer' }],
    });

    const req = { body: { email: 'user@example.com', password: 'wrong' } };
    const res = mockRes();

    await login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('returns 403 when email is not verified', async () => {
    const hash = await bcrypt.hash('Password123!', 10);
    findByEmail.mockResolvedValue({
      rows: [{ id: 'u-1', email: 'user@example.com', password_hash: hash, email_verified: false, role: 'freelancer' }],
    });

    const req = { body: { email: 'user@example.com', password: 'Password123!' } };
    const res = mockRes();

    await login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('returns 200 with token and user for valid credentials', async () => {
    const password = 'Password123!';
    const hash = await bcrypt.hash(password, 10);
    const user = { id: 'u-1', name: 'Test', email: 'user@example.com', password_hash: hash, email_verified: true, role: 'freelancer' };
    findByEmail.mockResolvedValue({ rows: [user] });

    const req = { body: { email: 'user@example.com', password } };
    const res = mockRes();

    await login(req, res, next);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          token: expect.any(String),
          user: expect.objectContaining({ email: 'user@example.com' }),
        }),
      })
    );
    // Verify the returned token is a valid JWT
    const returnedToken = res.json.mock.calls[0][0].data.token;
    const payload = jwt.verify(returnedToken, 'test-secret');
    expect(payload.id).toBe('u-1');
  });
});

describe('auth controller — verifyEmail()', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 400 when token is missing', async () => {
    const req = { body: {} };
    const res = mockRes();

    await verifyEmail(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 400 when token is invalid or expired', async () => {
    findByVerificationToken.mockResolvedValue({ rows: [] });

    const req = { body: { token: 'invalid-token' } };
    const res = mockRes();

    await verifyEmail(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('verifies email successfully', async () => {
    const user = { id: 'u-1', email_verification_expires: new Date(Date.now() + 3600000) };
    findByVerificationToken.mockResolvedValue({ rows: [user] });
    setEmailVerified.mockResolvedValue({ rows: [{ ...user, email_verified: true }] });

    const req = { body: { token: 'valid-token-123' } };
    const res = mockRes();

    await verifyEmail(req, res, next);

    expect(setEmailVerified).toHaveBeenCalledWith('u-1');
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true })
    );
  });
});
