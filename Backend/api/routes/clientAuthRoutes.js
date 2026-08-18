const express = require('express');
const clientAuthController = require('../controllers/clientAuthController');
const validate = require('../middleware/validate');
const {
  registerClientValidator,
  loginClientValidator,
} = require('../middleware/validators/clientAuthValidators');

const router = express.Router();

router.post('/register', registerClientValidator, validate, clientAuthController.register);
router.post('/login', loginClientValidator, validate, clientAuthController.login);

module.exports = router;
