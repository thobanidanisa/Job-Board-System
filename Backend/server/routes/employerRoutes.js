const express = require('express');
const employerController = require('../controllers/employerController');

const router = express.Router();

router.patch('/profile', employerController.updateProfile);

module.exports = router;
