'use strict';

jest.mock('../config/db', () => ({ query: jest.fn() }));
jest.mock('../models/proposal.model');

const { query } = require('../config/db');
const { getProposalById } = require('../models/proposal.model');
const { validateStatusTransition, convertToProject } = require('../services/proposal.service');

describe('validateStatusTransition()', () => {
  it('allows draft → sent', () => {
    expect(() => validateStatusTransition('draft', 'sent')).not.toThrow();
  });

  it('allows sent → accepted', () => {
    expect(() => validateStatusTransition('sent', 'accepted')).not.toThrow();
  });

  it('allows sent → declined', () => {
    expect(() => validateStatusTransition('sent', 'declined')).not.toThrow();
  });

  it('throws 400 for draft → accepted (skip sent)', () => {
    expect(() => validateStatusTransition('draft', 'accepted')).toThrow();
    try {
      validateStatusTransition('draft', 'accepted');
    } catch (err) {
      expect(err.status).toBe(400);
    }
  });

  it('throws 400 for accepted → sent (no going back)', () => {
    expect(() => validateStatusTransition('accepted', 'sent')).toThrow();
    try {
      validateStatusTransition('accepted', 'sent');
    } catch (err) {
      expect(err.status).toBe(400);
    }
  });

  it('throws for unknown current status', () => {
    expect(() => validateStatusTransition('unknown', 'sent')).toThrow();
  });
});

describe('convertToProject()', () => {
  const freelancerId = 'freelancer-1';
  const proposalId = 'proposal-1';
  const acceptedProposal = {
    id: proposalId,
    status: 'accepted',
    client_id: 'client-1',
    title: 'Website Redesign',
    description: 'A redesign project',
    amount: 45000,
    currency: 'INR',
  };

  beforeEach(() => jest.clearAllMocks());

  it('throws 404 when proposal does not exist', async () => {
    getProposalById.mockResolvedValue({ rows: [] });

    await expect(
      convertToProject(proposalId, freelancerId, {})
    ).rejects.toMatchObject({ status: 404, message: 'Proposal not found' });
  });

  it('throws 400 when proposal is not accepted', async () => {
    getProposalById.mockResolvedValue({
      rows: [{ ...acceptedProposal, status: 'sent' }],
    });

    await expect(
      convertToProject(proposalId, freelancerId, {})
    ).rejects.toMatchObject({ status: 400 });
  });

  it('throws 409 when a project already exists for this proposal', async () => {
    getProposalById.mockResolvedValue({ rows: [acceptedProposal] });
    // First query: existing project check → returns a row
    query.mockResolvedValueOnce({ rows: [{ id: 'existing-project' }] });

    await expect(
      convertToProject(proposalId, freelancerId, {})
    ).rejects.toMatchObject({ status: 409, message: 'A project already exists for this proposal' });
  });

  it('creates a project when no duplicate exists', async () => {
    const newProject = { id: 'proj-new', title: 'Website Redesign', status: 'active' };
    getProposalById.mockResolvedValue({ rows: [acceptedProposal] });
    // First query: no existing project
    query.mockResolvedValueOnce({ rows: [] });
    // Second query: INSERT returning new project
    query.mockResolvedValueOnce({ rows: [newProject] });

    const result = await convertToProject(proposalId, freelancerId, { title: 'Website Redesign' });

    expect(result).toEqual(newProject);
    expect(query).toHaveBeenCalledTimes(2);
  });

  it('uses proposal title when project title is not provided', async () => {
    const newProject = { id: 'proj-new', title: acceptedProposal.title };
    getProposalById.mockResolvedValue({ rows: [acceptedProposal] });
    query.mockResolvedValueOnce({ rows: [] });
    query.mockResolvedValueOnce({ rows: [newProject] });

    const result = await convertToProject(proposalId, freelancerId, {});

    // The INSERT should include the proposal's title as fallback
    const insertCall = query.mock.calls[1];
    expect(insertCall[1]).toContain(acceptedProposal.title);
    expect(result.title).toBe(acceptedProposal.title);
  });
});
