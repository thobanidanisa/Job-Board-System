const { body } = require('express-validator');

const REQUIRED_DOCUMENT_TYPES = [
  'CV',
  'ID Copy',
  'Qualification Certificate',
  'Cover Letter',
  'Proof of Address',
];

const createJobValidator = [
  body('jobTitle').trim().notEmpty().withMessage('Job title is required'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('categoryId')
    .isInt({ min: 1 })
    .withMessage('A valid category is required')
    .toInt(),
  body('provinceId')
    .isInt({ min: 1 })
    .withMessage('A valid province is required')
    .toInt(),
  body('town').trim().notEmpty().withMessage('Town is required'),
  body('applicationStartDate')
    .isISO8601()
    .withMessage('A valid application start date is required'),
  body('applicationEndDate')
    .isISO8601()
    .withMessage('A valid application end date is required')
    .custom((value, { req }) => {
      if (new Date(value) < new Date(req.body.applicationStartDate)) {
        throw new Error('Application end date must be on or after the start date');
      }
      return true;
    }),
  body('salaryMin')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage('Minimum salary must be a non-negative number')
    .toFloat(),
  body('salaryMax')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage('Maximum salary must be a non-negative number')
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.salaryMin && value < req.body.salaryMin) {
        throw new Error('Maximum salary must be greater than or equal to minimum salary');
      }
      return true;
    }),
  body('status')
    .optional()
    .isIn(['Draft', 'Open'])
    .withMessage('Status must be Draft or Open'),
  body('skillTags').optional().isArray({ max: 20 }).withMessage('Skill tags must be a list'),
  body('skillTags.*')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each skill tag must be 1-50 characters'),
  body('requiredDocuments').optional().isArray().withMessage('Required documents must be a list'),
  body('requiredDocuments.*')
    .isIn(REQUIRED_DOCUMENT_TYPES)
    .withMessage('Invalid required document type'),
];

// Partial update: every field is optional (only whatever's present gets
// validated/changed), status accepts the full lifecycle instead of just
// Draft/Open, and the cross-field checks only fire when both sides of the
// pair are actually present in this request.
const updateJobValidator = [
  body('jobTitle').optional().trim().notEmpty().withMessage('Job title cannot be empty'),
  body('department').optional().trim().notEmpty().withMessage('Department cannot be empty'),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
  body('categoryId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('A valid category is required')
    .toInt(),
  body('provinceId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('A valid province is required')
    .toInt(),
  body('town').optional().trim().notEmpty().withMessage('Town cannot be empty'),
  body('applicationStartDate')
    .optional()
    .isISO8601()
    .withMessage('A valid application start date is required'),
  body('applicationEndDate')
    .optional()
    .isISO8601()
    .withMessage('A valid application end date is required')
    .custom((value, { req }) => {
      if (req.body.applicationStartDate && new Date(value) < new Date(req.body.applicationStartDate)) {
        throw new Error('Application end date must be on or after the start date');
      }
      return true;
    }),
  body('salaryMin')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage('Minimum salary must be a non-negative number')
    .toFloat(),
  body('salaryMax')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage('Maximum salary must be a non-negative number')
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.salaryMin && value < req.body.salaryMin) {
        throw new Error('Maximum salary must be greater than or equal to minimum salary');
      }
      return true;
    }),
  body('status')
    .optional()
    .isIn(['Draft', 'Open', 'Closed', 'Cancelled'])
    .withMessage('Invalid status'),
  body('skillTags').optional().isArray({ max: 20 }).withMessage('Skill tags must be a list'),
  body('skillTags.*')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each skill tag must be 1-50 characters'),
  body('requiredDocuments').optional().isArray().withMessage('Required documents must be a list'),
  body('requiredDocuments.*')
    .isIn(REQUIRED_DOCUMENT_TYPES)
    .withMessage('Invalid required document type'),
];

module.exports = { createJobValidator, updateJobValidator, REQUIRED_DOCUMENT_TYPES };
