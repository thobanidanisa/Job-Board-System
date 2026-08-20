const ApiError = require('../utils/ApiError');

// Must run after authenticate. Rejects a validly-authenticated caller
// whose role doesn't match (e.g. a client token calling an employer-only
// route).
const requireRole = (role) => (req, res, next) => {
  if (req.auth?.role !== role) {
    return next(new ApiError(403, 'You do not have permission to perform this action'));
  }
  next();
};

module.exports = requireRole;
