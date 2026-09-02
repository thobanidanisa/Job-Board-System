const express = require('express');
const clientController = require('../controllers/clientController');
const authenticate = require('../middleware/authenticate');
const requireRole = require('../middleware/requireRole');
const validate = require('../middleware/validate');
const { updateClientProfileValidator } = require('../middleware/validators/clientProfileValidator');

const router = express.Router();

router.patch(
  '/profile',
  authenticate,
  requireRole('client'),
  updateClientProfileValidator,
  validate,
  clientController.updateProfile
);

module.exports = router;
