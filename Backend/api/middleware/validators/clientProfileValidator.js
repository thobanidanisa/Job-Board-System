const { body } = require('express-validator');

// Same field rules as registerClientValidator, minus the ones a profile
// form shouldn't touch: email/password (separate concern) and
// idNumber/dateOfBirth (identity, fixed at registration).
const updateClientProfileValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('surname').trim().notEmpty().withMessage('Surname is required'),
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

module.exports = { updateClientProfileValidator };
