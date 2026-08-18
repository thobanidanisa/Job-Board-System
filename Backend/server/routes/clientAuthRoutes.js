const express = require('express');
const clientAuthController = require('../controllers/clientAuthController');

const router = express.Router();

router.post('/register', clientAuthController.register);
router.post('/login', clientAuthController.login);

module.exports = router;
