const express = require('express');
const employerAuthController = require('../controllers/employerAuthController');

const router = express.Router();

router.post('/register', employerAuthController.register);
router.post('/login', employerAuthController.login);

module.exports = router;
