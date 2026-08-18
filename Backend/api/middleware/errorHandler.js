// Centralized error handler - must be registered last in api.js
const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  const statusCode = err.statusCode || 500;

  const response = {
    success: false,
    message: err.message || 'Internal server error',
  };

  if (err.details) {
    response.errors = err.details;
  }

  if (statusCode === 500) {
    // Unexpected errors are logged server-side; the client only ever
    // sees a generic message so internals are never leaked.
    console.error(err);
    response.message = 'Internal server error';
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
