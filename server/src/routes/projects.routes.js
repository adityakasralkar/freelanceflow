const { Router } = require('express');
const { getAll, getOne, update } = require('../controllers/projects.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const router = Router();

router.use(verifyToken);

router.get('/', getAll);
router.get('/:id', getOne);
router.patch('/:id', update);

module.exports = router;
