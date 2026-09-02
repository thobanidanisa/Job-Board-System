const express = require('express');
const clientController = require('../controllers/clientController');

const router = express.Router();

router.patch('/profile', clientController.updateProfile);

module.exports = router;
