const { Router } = require('express');
const { getByProject, create, update, complete } = require('../controllers/milestones.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const router = Router({ mergeParams: true });

router.use(verifyToken);

// Mounted under /api/projects/:projectId/milestones
router.get('/', getByProject);
router.post('/', create);

// Mounted under /api/milestones
router.patch('/:id', update);
router.patch('/:id/complete', complete);

module.exports = router;
