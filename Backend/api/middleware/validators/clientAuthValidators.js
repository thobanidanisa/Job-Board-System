const { body } = require('express-validator');

const registerClientValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('surname').trim().notEmpty().withMessage('Surname is required'),
  body('idNumber')
    .trim()
    .matches(/^[0-9]{13}$/)
    .withMessage('ID number must be exactly 13 digits'),
  body('dateOfBirth')
    .isISO8601()
    .withMessage('Date of birth must be a valid date (YYYY-MM-DD)'),
  body('gender').trim().notEmpty().withMessage('Gender is required'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('A valid email is required')
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
  body('provinceId')
    .isInt({ min: 1 })
    .withMessage('A valid province is required')
    .toInt(),
  body('town').trim().notEmpty().withMessage('Town is required'),
  body('streetName').trim().notEmpty().withMessage('Street name is required'),
  body('suburb').trim().notEmpty().withMessage('Suburb is required'),
  body('postalCode')
    .trim()
    .matches(/^[0-9]{4}$/)
    .withMessage('Postal code must be 4 digits'),
];

const loginClientValidator = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('A valid email is required')
    .normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

module.exports = { registerClientValidator, loginClientValidator };
