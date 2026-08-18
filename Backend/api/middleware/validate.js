const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

// Runs after express-validator checks; turns collected errors into a
// single 422 ApiError so every route reports validation failures the
// same way.
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const details = errors.array().map((e) => ({
      field: e.path,
      message: e.msg,
    }));
    return next(new ApiError(422, 'Validation failed', details));
  }

  next();
};

module.exports = validate;
