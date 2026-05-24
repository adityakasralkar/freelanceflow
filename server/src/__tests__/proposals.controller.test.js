'use strict';

jest.mock('../models/proposal.model');
jest.mock('../models/client.model');
jest.mock('../services/proposal.service');
jest.mock('../utils/currencies', () => ({
  SUPPORTED_CURRENCIES: ['INR', 'USD', 'EUR', 'GBP'],
}));

const {
  getAllProposals,
  getProposalById,
  createProposal,
  updateProposal,
  updateProposalStatus,
  deleteProposal,
} = require('../models/proposal.model');
const { getClientById } = require('../models/client.model');
const { validateStatusTransition, convertToProject } = require('../services/proposal.service');
const {
  getAll,
  getOne,
  create,
  update,
  updateStatus,
  convertProposalToProject,
  remove,
} = require('../controllers/proposals.controller');

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

const next = jest.fn();
const user = { id: 'u-1' };

beforeEach(() => jest.clearAllMocks());

describe('proposals.controller – getAll', () => {
  it('returns proposals list', async () => {
    getAllProposals.mockResolvedValue({ rows: [{ id: 'pr-1' }] });
    await getAll({ user, query: {} }, mockRes(), next);
    expect(getAllProposals).toHaveBeenCalledWith('u-1', {});
  });

  it('passes status filter', async () => {
    getAllProposals.mockResolvedValue({ rows: [] });
    await getAll({ user, query: { status: 'sent' } }, mockRes(), next);
    expect(getAllProposals).toHaveBeenCalledWith('u-1', { status: 'sent' });
  });
});

describe('proposals.controller – getOne', () => {
  it('returns 404 when not found', async () => {
    getProposalById.mockResolvedValue({ rows: [] });
    const res = mockRes();
    await getOne({ user, params: { id: 'pr-99' } }, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('returns proposal when found', async () => {
    getProposalById.mockResolvedValue({ rows: [{ id: 'pr-1' }] });
    const res = mockRes();
    await getOne({ user, params: { id: 'pr-1' } }, res, next);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: 'pr-1' } });
  });
});

describe('proposals.controller – create', () => {
  it('returns 400 when body is invalid (missing client_id)', async () => {
    const req = { user, body: { title: 'Test', amount: 100 } };
    const res = mockRes();
    await create(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 400 when amount is negative', async () => {
    const req = { user, body: { client_id: '550e8400-e29b-41d4-a716-446655440000', title: 'Test', amount: -5 } };
    const res = mockRes();
    await create(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 400 when client not found (no currency provided)', async () => {
    getClientById.mockResolvedValue({ rows: [] });
    const req = { user, body: { client_id: '550e8400-e29b-41d4-a716-446655440000', title: 'Test', amount: 100 } };
    const res = mockRes();
    await create(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('creates proposal inheriting client currency', async () => {
    getClientById.mockResolvedValue({ rows: [{ id: 'c-1', currency: 'USD' }] });
    createProposal.mockResolvedValue({ rows: [{ id: 'pr-new' }] });
    const req = {
      user,
      body: { client_id: '550e8400-e29b-41d4-a716-446655440000', title: 'Test', amount: 500 },
    };
    const res = mockRes();
    await create(req, res, next);
    expect(res.status).toHaveBeenCalledWith(201);
    const created = createProposal.mock.calls[0][1];
    expect(created.currency).toBe('USD');
  });

  it('uses provided currency without fetching client', async () => {
    createProposal.mockResolvedValue({ rows: [{ id: 'pr-new' }] });
    const req = {
      user,
      body: { client_id: '550e8400-e29b-41d4-a716-446655440000', title: 'Test', amount: 500, currency: 'GBP' },
    };
    const res = mockRes();
    await create(req, res, next);
    expect(getClientById).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });
});

describe('proposals.controller – update', () => {
  it('returns 404 when proposal not found', async () => {
    updateProposal.mockResolvedValue({ rows: [] });
    const req = { user, params: { id: 'pr-99' }, body: { title: 'Updated' } };
    const res = mockRes();
    await update(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('updates proposal when valid', async () => {
    updateProposal.mockResolvedValue({ rows: [{ id: 'pr-1', title: 'Updated' }] });
    const req = { user, params: { id: 'pr-1' }, body: { title: 'Updated' } };
    const res = mockRes();
    await update(req, res, next);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });
});

describe('proposals.controller – updateStatus', () => {
  it('returns 400 for invalid status', async () => {
    const req = { user, params: { id: 'pr-1' }, body: { status: 'invalid' } };
    const res = mockRes();
    await updateStatus(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 404 when proposal not found', async () => {
    getProposalById.mockResolvedValue({ rows: [] });
    const req = { user, params: { id: 'pr-99' }, body: { status: 'sent' } };
    const res = mockRes();
    await updateStatus(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('calls next when transition throws', async () => {
    getProposalById.mockResolvedValue({ rows: [{ id: 'pr-1', status: 'accepted' }] });
    const err = new Error('Invalid transition');
    validateStatusTransition.mockImplementation(() => { throw err; });
    await updateStatus({ user, params: { id: 'pr-1' }, body: { status: 'draft' } }, mockRes(), next);
    expect(next).toHaveBeenCalledWith(err);
  });

  it('updates status successfully', async () => {
    getProposalById.mockResolvedValue({ rows: [{ id: 'pr-1', status: 'draft' }] });
    validateStatusTransition.mockImplementation(() => {});
    updateProposalStatus.mockResolvedValue({ rows: [{ id: 'pr-1', status: 'sent' }] });
    const req = { user, params: { id: 'pr-1' }, body: { status: 'sent' } };
    const res = mockRes();
    await updateStatus(req, res, next);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });
});

describe('proposals.controller – convertProposalToProject', () => {
  it('returns 201 on success', async () => {
    convertToProject.mockResolvedValue({ id: 'proj-1' });
    const req = { user, params: { id: 'pr-1' }, body: { title: 'Project' } };
    const res = mockRes();
    await convertProposalToProject(req, res, next);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('calls next on error', async () => {
    const err = new Error('Already converted');
    err.status = 409;
    convertToProject.mockRejectedValue(err);
    await convertProposalToProject({ user, params: { id: 'pr-1' }, body: {} }, mockRes(), next);
    expect(next).toHaveBeenCalledWith(err);
  });
});

describe('proposals.controller – remove', () => {
  it('returns 404 when proposal not found or not draft', async () => {
    deleteProposal.mockResolvedValue({ rows: [] });
    const req = { user, params: { id: 'pr-99' } };
    const res = mockRes();
    await remove(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('deletes draft proposal', async () => {
    deleteProposal.mockResolvedValue({ rows: [{ id: 'pr-1' }] });
    const req = { user, params: { id: 'pr-1' } };
    const res = mockRes();
    await remove(req, res, next);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });
});
