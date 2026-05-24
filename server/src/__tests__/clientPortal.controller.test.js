'use strict';

jest.mock('../models/clientPortal.model');

const {
  getClientIdsForUserEmail,
  getMyProjects,
  getMyProjectById,
  getMyInvoices,
  getMyInvoiceById,
  acknowledgeInvoice,
} = require('../models/clientPortal.model');
const {
  loadClientIds,
  listMyProjects,
  getOneProject,
  listMyInvoices,
  getOneInvoice,
  acknowledgeMyInvoice,
} = require('../controllers/clientPortal.controller');

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

const next = jest.fn();
const user = { id: 'u-1', email: 'client@example.com' };

beforeEach(() => jest.clearAllMocks());

describe('loadClientIds', () => {
  it('sets req.clientIds and calls next', async () => {
    getClientIdsForUserEmail.mockResolvedValue(['c-1', 'c-2']);
    const req = { user };
    await loadClientIds(req, mockRes(), next);
    expect(req.clientIds).toEqual(['c-1', 'c-2']);
    expect(next).toHaveBeenCalled();
  });

  it('calls next with error on failure', async () => {
    const err = new Error('DB fail');
    getClientIdsForUserEmail.mockRejectedValue(err);
    await loadClientIds({ user }, mockRes(), next);
    expect(next).toHaveBeenCalledWith(err);
  });
});

describe('listMyProjects', () => {
  it('returns projects list', async () => {
    getMyProjects.mockResolvedValue({ rows: [{ id: 'p-1' }] });
    const req = { clientIds: ['c-1'] };
    const res = mockRes();
    await listMyProjects(req, res, next);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: [{ id: 'p-1' }] });
  });
});

describe('getOneProject', () => {
  it('returns 404 when not found', async () => {
    getMyProjectById.mockResolvedValue({ rows: [] });
    const req = { clientIds: ['c-1'], params: { id: 'p-99' } };
    const res = mockRes();
    await getOneProject(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('returns project when found', async () => {
    getMyProjectById.mockResolvedValue({ rows: [{ id: 'p-1' }] });
    const req = { clientIds: ['c-1'], params: { id: 'p-1' } };
    const res = mockRes();
    await getOneProject(req, res, next);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: 'p-1' } });
  });
});

describe('listMyInvoices', () => {
  it('returns invoices list', async () => {
    getMyInvoices.mockResolvedValue({ rows: [{ id: 'inv-1' }] });
    const req = { clientIds: ['c-1'] };
    const res = mockRes();
    await listMyInvoices(req, res, next);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: [{ id: 'inv-1' }] });
  });
});

describe('getOneInvoice', () => {
  it('returns 404 when not found', async () => {
    getMyInvoiceById.mockResolvedValue({ rows: [] });
    const req = { clientIds: ['c-1'], params: { id: 'inv-99' } };
    const res = mockRes();
    await getOneInvoice(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('returns invoice when found', async () => {
    getMyInvoiceById.mockResolvedValue({ rows: [{ id: 'inv-1' }] });
    const req = { clientIds: ['c-1'], params: { id: 'inv-1' } };
    const res = mockRes();
    await getOneInvoice(req, res, next);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: 'inv-1' } });
  });
});

describe('acknowledgeMyInvoice', () => {
  it('returns 400 when invoice not found or not sent', async () => {
    acknowledgeInvoice.mockResolvedValue({ rows: [] });
    const req = { clientIds: ['c-1'], params: { id: 'inv-99' } };
    const res = mockRes();
    await acknowledgeMyInvoice(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('acknowledges invoice successfully', async () => {
    acknowledgeInvoice.mockResolvedValue({ rows: [{ id: 'inv-1', status: 'paid' }] });
    const req = { clientIds: ['c-1'], params: { id: 'inv-1' } };
    const res = mockRes();
    await acknowledgeMyInvoice(req, res, next);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });
});
