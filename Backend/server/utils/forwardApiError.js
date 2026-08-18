const ApiError = require('./ApiError');

// Translates an axios error from a call to the upstream api into the
// same ApiError shape this server's own errorHandler already knows
// how to render, so callers of this server see a consistent response
// whether the failure happened here or upstream.
const forwardApiError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    return new ApiError(
      status,
      (data && data.message) || 'Upstream API error',
      (data && data.errors) || null
    );
  }

  return new ApiError(502, 'Unable to reach the API service');
};

module.exports = forwardApiError;
