const { Router } = require('express');
const { getAll, getOne, create, update, remove } = require('../controllers/clients.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const router = Router();

router.use(verifyToken);

router.get('/', getAll);
router.post('/', create);
router.get('/:id', getOne);
router.patch('/:id', update);
router.delete('/:id', remove);

module.exports = router;
