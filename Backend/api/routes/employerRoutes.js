const express = require('express');
const employerController = require('../controllers/employerController');
const authenticate = require('../middleware/authenticate');
const requireRole = require('../middleware/requireRole');
const validate = require('../middleware/validate');
const { updateEmployerProfileValidator } = require('../middleware/validators/employerProfileValidator');

const router = express.Router();

router.patch(
  '/profile',
  authenticate,
  requireRole('employer'),
  updateEmployerProfileValidator,
  validate,
  employerController.updateProfile
);

module.exports = router;
