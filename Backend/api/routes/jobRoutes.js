const express = require('express');
const jobController = require('../controllers/jobController');
const authenticate = require('../middleware/authenticate');
const requireRole = require('../middleware/requireRole');
const validate = require('../middleware/validate');
const { createJobValidator } = require('../middleware/validators/jobValidators');

const router = express.Router();

router.post(
  '/',
  authenticate,
  requireRole('employer'),
  createJobValidator,
  validate,
  jobController.createJob
);

router.get('/mine', authenticate, requireRole('employer'), jobController.listMyJobs);

module.exports = router;
