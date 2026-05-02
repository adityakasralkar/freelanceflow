const { Router } = require('express');
const { register, login, getMe } = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', verifyToken, getMe);

module.exports = router;
