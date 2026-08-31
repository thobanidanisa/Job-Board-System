const { body } = require('express-validator');

// Same field rules as registerEmployerValidator, minus email/password -
// changing login credentials is a separate concern outside profile edit.
const updateEmployerProfileValidator = [
  body('companyName').trim().notEmpty().withMessage('Company name is required'),
  body('contactPerson').trim().notEmpty().withMessage('Contact person is required'),
  body('hrEmail')
    .trim()
    .isEmail()
    .withMessage('A valid HR email is required')
    .normalizeEmail(),
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

module.exports = { updateEmployerProfileValidator };
