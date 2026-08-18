const { body } = require('express-validator');

const registerEmployerValidator = [
  body('companyName').trim().notEmpty().withMessage('Company name is required'),
  body('contactPerson').trim().notEmpty().withMessage('Contact person is required'),
  body('hrEmail')
    .trim()
    .isEmail()
    .withMessage('A valid HR email is required')
    .normalizeEmail(),
  body('email')
    .trim()
    .isEmail()
    .withMessage('A valid login email is required')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/\d/)
    .withMessage('Password must contain at least one number'),
  body('phoneNumber')
    .trim()
    .matches(/^\+?[0-9]{9,15}$/)
    .withMessage('Phone number must be 9-15 digits, optionally starting with +'),
  body('industryType').trim().notEmpty().withMessage('Industry type is required'),
  body('provinceId')
    .isInt({ min: 1 })
    .withMessage('A valid province is required')
    .toInt(),
  body('town').trim().notEmpty().withMessage('Town is required'),
  body('streetName').optional({ checkFalsy: true }).trim(),
  body('suburb').optional({ checkFalsy: true }).trim(),
  body('postalCode')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[0-9]{4}$/)
    .withMessage('Postal code must be 4 digits'),
];

const loginEmployerValidator = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('A valid email is required')
    .normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

module.exports = { registerEmployerValidator, loginEmployerValidator };
