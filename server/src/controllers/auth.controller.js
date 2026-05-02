const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const { findByEmail, findById, createUser } = require('../models/user.model');

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['freelancer', 'client']),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
}

async function register(req, res, next) {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: parsed.error.errors, code: 400 });
    }

    const { name, email, password, role } = parsed.data;

    const existing = await findByEmail(email);
    if (existing.rows.length > 0) {
      return res.status(409).json({ success: false, error: 'Email already registered', code: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await createUser(name, email, passwordHash, role);
    const user = result.rows[0];
    const token = generateToken(user);

    res.status(201).json({ success: true, data: { user, token }, message: 'Registration successful' });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: parsed.error.errors, code: 400 });
    }

    const { email, password } = parsed.data;

    const result = await findByEmail(email);
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid email or password', code: 401 });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ success: false, error: 'Invalid email or password', code: 401 });
    }

    const { password_hash, ...safeUser } = user;
    const token = generateToken(safeUser);

    res.json({ success: true, data: { user: safeUser, token }, message: 'Login successful' });
  } catch (err) {
    next(err);
  }
}

async function getMe(req, res, next) {
  try {
    const result = await findById(req.user.id);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found', code: 404 });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, getMe };
