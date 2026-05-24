'use strict';

jest.mock('../models/invoice.model');
jest.mock('../services/invoice.service');

const {
  getAllInvoices,
  getInvoiceById,
  updateInvoiceStatus,
} = require('../models/invoice.model');
const {
  generateFromMilestone,
  validateInvoiceStatusTransition,
} = require('../services/invoice.service');
const {
  getAll,
  getOne,
  generateFromMilestoneController,
  updateStatus,
} = require('../controllers/invoices.controller');

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

const next = jest.fn();
const user = { id: 'u-1' };

beforeEach(() => jest.clearAllMocks());

describe('invoices.controller – getAll', () => {
  it('returns all invoices', async () => {
    getAllInvoices.mockResolvedValue({ rows: [{ id: 'inv-1' }] });
    const req = { user, query: {} };
    const res = mockRes();

    await getAll(req, res, next);

    expect(res.json).toHaveBeenCalledWith({ success: true, data: [{ id: 'inv-1' }] });
  });

  it('passes status filter when provided', async () => {
    getAllInvoices.mockResolvedValue({ rows: [] });
    const req = { user, query: { status: 'paid' } };
    const res = mockRes();

    await getAll(req, res, next);

    expect(getAllInvoices).toHaveBeenCalledWith('u-1', { status: 'paid' });
  });

  it('calls next on error', async () => {
    getAllInvoices.mockRejectedValue(new Error('DB'));
    await getAll({ user, query: {} }, mockRes(), next);
    expect(next).toHaveBeenCalled();
  });
});

describe('invoices.controller – getOne', () => {
  it('returns 404 when not found', async () => {
    getInvoiceById.mockResolvedValue({ rows: [] });
    const req = { user, params: { id: 'inv-99' } };
    const res = mockRes();

    await getOne(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('returns invoice when found', async () => {
    getInvoiceById.mockResolvedValue({ rows: [{ id: 'inv-1', status: 'draft' }] });
    const req = { user, params: { id: 'inv-1' } };
    const res = mockRes();

    await getOne(req, res, next);

    expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: 'inv-1', status: 'draft' } });
  });
});

describe('invoices.controller – generateFromMilestoneController', () => {
  it('calls service and returns 201', async () => {
    generateFromMilestone.mockResolvedValue({ id: 'inv-new' });
    const req = { user, params: { milestoneId: 'm-1' }, body: {} };
    const res = mockRes();

    await generateFromMilestoneController(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  it('calls next when service throws', async () => {
    const err = new Error('Not found');
    err.status = 404;
    generateFromMilestone.mockRejectedValue(err);
    await generateFromMilestoneController(
      { user, params: { milestoneId: 'm-99' }, body: {} },
      mockRes(),
      next
    );
    expect(next).toHaveBeenCalledWith(err);
  });
});

describe('invoices.controller – updateStatus', () => {
  it('returns 400 for invalid status value', async () => {
    const req = { user, params: { id: 'inv-1' }, body: { status: 'unknown' } };
    const res = mockRes();

    await updateStatus(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 404 when invoice not found', async () => {
    getInvoiceById.mockResolvedValue({ rows: [] });
    const req = { user, params: { id: 'inv-99' }, body: { status: 'paid' } };
    const res = mockRes();

    await updateStatus(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('calls next when transition validation throws', async () => {
    getInvoiceById.mockResolvedValue({ rows: [{ id: 'inv-1', status: 'paid' }] });
    const err = new Error('Invalid transition');
    err.status = 400;
    validateInvoiceStatusTransition.mockImplementation(() => { throw err; });
    const req = { user, params: { id: 'inv-1' }, body: { status: 'draft' } };

    await updateStatus(req, mockRes(), next);

    expect(next).toHaveBeenCalledWith(err);
  });

  it('updates status successfully', async () => {
    getInvoiceById.mockResolvedValue({ rows: [{ id: 'inv-1', status: 'draft' }] });
    validateInvoiceStatusTransition.mockImplementation(() => {});
    updateInvoiceStatus.mockResolvedValue({ rows: [{ id: 'inv-1', status: 'sent' }] });
    const req = { user, params: { id: 'inv-1' }, body: { status: 'sent' } };
    const res = mockRes();

    await updateStatus(req, res, next);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });
});
