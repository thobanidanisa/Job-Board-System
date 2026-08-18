const express = require('express');
const employerAuthController = require('../controllers/employerAuthController');
const validate = require('../middleware/validate');
const {
  registerEmployerValidator,
  loginEmployerValidator,
} = require('../middleware/validators/employerAuthValidators');

const router = express.Router();

router.post('/register', registerEmployerValidator, validate, employerAuthController.register);
router.post('/login', loginEmployerValidator, validate, employerAuthController.login);

module.exports = router;
