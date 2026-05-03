const { query } = require('../config/db');
const { getProposalById } = require('../models/proposal.model');

const VALID_TRANSITIONS = {
  draft: ['sent'],
  sent: ['accepted', 'declined'],
  accepted: [],
  declined: [],
};

function validateStatusTransition(currentStatus, newStatus) {
  const allowed = VALID_TRANSITIONS[currentStatus] || [];
  if (!allowed.includes(newStatus)) {
    const err = new Error(
      `Cannot transition from '${currentStatus}' to '${newStatus}'. Allowed: ${allowed.join(', ') || 'none'}`
    );
    err.status = 400;
    throw err;
  }
}

async function convertToProject(proposalId, freelancerId, projectData) {
  const proposalResult = await getProposalById(proposalId, freelancerId);
  if (proposalResult.rows.length === 0) {
    const err = new Error('Proposal not found');
    err.status = 404;
    throw err;
  }

  const proposal = proposalResult.rows[0];
  if (proposal.status !== 'accepted') {
    const err = new Error('Only accepted proposals can be converted to projects');
    err.status = 400;
    throw err;
  }

  // Create project from proposal — inherit currency
  const projectResult = await query(
    `INSERT INTO projects (proposal_id, freelancer_id, client_id, title, description, start_date, end_date, total_amount, status, currency)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'active', $9)
     RETURNING *`,
    [
      proposalId,
      freelancerId,
      proposal.client_id,
      projectData.title || proposal.title,
      projectData.description || proposal.description,
      projectData.start_date || null,
      projectData.end_date || null,
      proposal.amount,
      proposal.currency || 'INR',
    ]
  );

  return projectResult.rows[0];
}

module.exports = { validateStatusTransition, convertToProject };
