'use strict';

jest.mock('../models/client.model');
jest.mock('../utils/currencies', () => ({
  SUPPORTED_CURRENCIES: ['INR', 'USD', 'EUR', 'GBP'],
}));

const {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
} = require('../models/client.model');
const { getAll, getOne, create, update, remove } = require('../controllers/clients.controller');

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

const next = jest.fn();
const user = { id: 'u-1' };

beforeEach(() => jest.clearAllMocks());

describe('clients.controller – getAll', () => {
  it('returns all clients for the user', async () => {
    getAllClients.mockResolvedValue({ rows: [{ id: 'c-1', name: 'Acme' }] });
    const req = { user };
    const res = mockRes();

    await getAll(req, res, next);

    expect(getAllClients).toHaveBeenCalledWith('u-1');
    expect(res.json).toHaveBeenCalledWith({ success: true, data: [{ id: 'c-1', name: 'Acme' }] });
  });

  it('calls next on error', async () => {
    const err = new Error('DB fail');
    getAllClients.mockRejectedValue(err);
    await getAll({ user }, mockRes(), next);
    expect(next).toHaveBeenCalledWith(err);
  });
});

describe('clients.controller – getOne', () => {
  it('returns 404 when client not found', async () => {
    getClientById.mockResolvedValue({ rows: [] });
    const req = { user, params: { id: 'c-99' } };
    const res = mockRes();

    await getOne(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
  });

  it('returns client when found', async () => {
    getClientById.mockResolvedValue({ rows: [{ id: 'c-1', name: 'Acme' }] });
    const req = { user, params: { id: 'c-1' } };
    const res = mockRes();

    await getOne(req, res, next);

    expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: 'c-1', name: 'Acme' } });
  });
});

describe('clients.controller – create', () => {
  it('returns 400 for invalid body (missing name)', async () => {
    const req = { user, body: {} };
    const res = mockRes();

    await create(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 400 for invalid email', async () => {
    const req = { user, body: { name: 'Test', email: 'not-an-email' } };
    const res = mockRes();

    await create(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('creates client with valid body', async () => {
    createClient.mockResolvedValue({ rows: [{ id: 'c-2', name: 'New Client' }] });
    const req = { user, body: { name: 'New Client', email: 'new@client.com' } };
    const res = mockRes();

    await create(req, res, next);

    expect(createClient).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('returns 400 for unsupported currency', async () => {
    const req = { user, body: { name: 'X', currency: 'XYZ' } };
    const res = mockRes();

    await create(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('clients.controller – update', () => {
  it('returns 400 for invalid update payload', async () => {
    const req = { user, params: { id: 'c-1' }, body: { email: 'bad' } };
    const res = mockRes();

    await update(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 404 when client not found', async () => {
    updateClient.mockResolvedValue({ rows: [] });
    const req = { user, params: { id: 'c-99' }, body: { name: 'Updated' } };
    const res = mockRes();

    await update(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('updates client when valid', async () => {
    updateClient.mockResolvedValue({ rows: [{ id: 'c-1', name: 'Updated' }] });
    const req = { user, params: { id: 'c-1' }, body: { name: 'Updated' } };
    const res = mockRes();

    await update(req, res, next);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });
});

describe('clients.controller – remove', () => {
  it('returns 404 when client not found', async () => {
    deleteClient.mockResolvedValue({ rows: [] });
    const req = { user, params: { id: 'c-99' } };
    const res = mockRes();

    await remove(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('deletes client when found', async () => {
    deleteClient.mockResolvedValue({ rows: [{ id: 'c-1' }] });
    const req = { user, params: { id: 'c-1' } };
    const res = mockRes();

    await remove(req, res, next);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });
});
