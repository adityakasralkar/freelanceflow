'use strict';

jest.mock('../models/project.model');

const { getAllProjects, getProjectById, updateProject } = require('../models/project.model');
const { getAll, getOne, update } = require('../controllers/projects.controller');

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

const next = jest.fn();
const user = { id: 'u-1' };

beforeEach(() => jest.clearAllMocks());

describe('projects.controller – getAll', () => {
  it('returns all projects', async () => {
    getAllProjects.mockResolvedValue({ rows: [{ id: 'p-1', title: 'Website' }] });
    const req = { user, query: {} };
    const res = mockRes();

    await getAll(req, res, next);

    expect(res.json).toHaveBeenCalledWith({ success: true, data: [{ id: 'p-1', title: 'Website' }] });
  });

  it('passes status filter', async () => {
    getAllProjects.mockResolvedValue({ rows: [] });
    const req = { user, query: { status: 'active' } };
    const res = mockRes();

    await getAll(req, res, next);

    expect(getAllProjects).toHaveBeenCalledWith('u-1', { status: 'active' });
  });

  it('calls next on error', async () => {
    getAllProjects.mockRejectedValue(new Error('DB'));
    await getAll({ user, query: {} }, mockRes(), next);
    expect(next).toHaveBeenCalled();
  });
});

describe('projects.controller – getOne', () => {
  it('returns 404 when not found', async () => {
    getProjectById.mockResolvedValue({ rows: [] });
    const req = { user, params: { id: 'p-99' } };
    const res = mockRes();

    await getOne(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
  });

  it('returns project when found', async () => {
    getProjectById.mockResolvedValue({ rows: [{ id: 'p-1', title: 'Website' }] });
    const req = { user, params: { id: 'p-1' } };
    const res = mockRes();

    await getOne(req, res, next);

    expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: 'p-1', title: 'Website' } });
  });
});

describe('projects.controller – update', () => {
  it('returns 400 for invalid status enum', async () => {
    const req = { user, params: { id: 'p-1' }, body: { status: 'unknown_status' } };
    const res = mockRes();

    await update(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 404 when project not found', async () => {
    updateProject.mockResolvedValue({ rows: [] });
    const req = { user, params: { id: 'p-99' }, body: { title: 'New title' } };
    const res = mockRes();

    await update(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('updates project with valid body', async () => {
    updateProject.mockResolvedValue({ rows: [{ id: 'p-1', title: 'Updated', status: 'active' }] });
    const req = { user, params: { id: 'p-1' }, body: { title: 'Updated', status: 'active' } };
    const res = mockRes();

    await update(req, res, next);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  it('accepts all valid status values', async () => {
    for (const status of ['active', 'on_hold', 'completed', 'archived']) {
      updateProject.mockResolvedValue({ rows: [{ id: 'p-1', status }] });
      const req = { user, params: { id: 'p-1' }, body: { status } };
      const res = mockRes();
      await update(req, res, next);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
      jest.clearAllMocks();
    }
  });
});
