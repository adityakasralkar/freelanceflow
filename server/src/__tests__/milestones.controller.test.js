'use strict';

// Mock db before requiring any modules that depend on it
jest.mock('../config/db', () => ({ query: jest.fn() }));
jest.mock('../models/milestone.model');

const { query } = require('../config/db');
const {
  getMilestoneById,
  completeMilestone,
  createMilestone,
  updateMilestone,
  getMilestonesByProject,
} = require('../models/milestone.model');
const { complete, create, update, getByProject } = require('../controllers/milestones.controller');

// Minimal Express req/res mock helpers
function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

function mockReq(params = {}, body = {}) {
  return { params, body };
}

const next = jest.fn();

describe('milestones controller — complete()', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 404 when milestone does not exist', async () => {
    getMilestoneById.mockResolvedValue({ rows: [] });
    const req = mockReq({ id: 'non-existent' });
    const res = mockRes();

    await complete(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, error: 'Milestone not found' })
    );
  });

  it('returns 400 when milestone is already completed', async () => {
    getMilestoneById.mockResolvedValue({
      rows: [{ id: 'ms-1', status: 'completed' }],
    });
    const req = mockReq({ id: 'ms-1' });
    const res = mockRes();

    await complete(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, error: 'Milestone is already completed' })
    );
    // completeMilestone should NOT be called after guard
    expect(completeMilestone).not.toHaveBeenCalled();
  });

  it('marks an in-progress milestone complete and checks for existing invoice', async () => {
    const milestone = { id: 'ms-1', status: 'in_progress', title: 'Phase 1' };
    getMilestoneById.mockResolvedValue({ rows: [{ id: 'ms-1', status: 'in_progress' }] });
    completeMilestone.mockResolvedValue({ rows: [{ ...milestone, status: 'completed' }] });
    // No existing invoice
    query.mockResolvedValue({ rows: [] });

    const req = mockReq({ id: 'ms-1' });
    const res = mockRes();

    await complete(req, res, next);

    expect(completeMilestone).toHaveBeenCalledWith('ms-1');
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({ canGenerateInvoice: true }),
      })
    );
  });

  it('sets canGenerateInvoice=false when invoice already exists', async () => {
    getMilestoneById.mockResolvedValue({ rows: [{ id: 'ms-1', status: 'in_progress' }] });
    completeMilestone.mockResolvedValue({ rows: [{ id: 'ms-1', status: 'completed' }] });
    // Invoice already exists
    query.mockResolvedValue({ rows: [{ id: 'inv-1' }] });

    const req = mockReq({ id: 'ms-1' });
    const res = mockRes();

    await complete(req, res, next);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ canGenerateInvoice: false }),
      })
    );
  });

  it('calls next(err) when an unexpected error occurs', async () => {
    const err = new Error('DB explosion');
    getMilestoneById.mockRejectedValue(err);

    const req = mockReq({ id: 'ms-1' });
    const res = mockRes();

    await complete(req, res, next);

    expect(next).toHaveBeenCalledWith(err);
    expect(res.json).not.toHaveBeenCalled();
  });
});

describe('milestones controller — create()', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 400 for missing required fields', async () => {
    const req = mockReq({ projectId: 'proj-1' }, { title: '' });
    const res = mockRes();

    await create(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 400 if amount is negative', async () => {
    const req = mockReq({ projectId: 'proj-1' }, {
      title: 'Phase 1',
      due_date: '2026-06-01',
      amount: -100,
    });
    const res = mockRes();

    await create(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('creates a milestone with valid data', async () => {
    const newMilestone = { id: 'ms-new', title: 'Phase 1', amount: 25000 };
    createMilestone.mockResolvedValue({ rows: [newMilestone] });

    const req = mockReq({ projectId: 'proj-1' }, {
      title: 'Phase 1',
      due_date: '2026-06-01',
      amount: 25000,
    });
    const res = mockRes();

    await create(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, data: newMilestone })
    );
  });
});

describe('milestones controller — update()', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 404 when milestone not found', async () => {
    updateMilestone.mockResolvedValue({ rows: [] });

    const req = mockReq({ id: 'ms-ghost' }, { title: 'Updated' });
    const res = mockRes();

    await update(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('returns updated milestone', async () => {
    const updated = { id: 'ms-1', title: 'Updated title' };
    updateMilestone.mockResolvedValue({ rows: [updated] });

    const req = mockReq({ id: 'ms-1' }, { title: 'Updated title' });
    const res = mockRes();

    await update(req, res, next);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, data: updated })
    );
  });
});

describe('milestones controller — getByProject()', () => {
  it('returns all milestones for a project', async () => {
    const milestones = [{ id: 'ms-1' }, { id: 'ms-2' }];
    getMilestonesByProject.mockResolvedValue({ rows: milestones });

    const req = mockReq({ projectId: 'proj-1' });
    const res = mockRes();

    await getByProject(req, res, next);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, data: milestones })
    );
  });
});
