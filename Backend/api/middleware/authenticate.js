const { verifyToken } = require('../utils/jwt');
const ApiError = require('../utils/ApiError');

// Verifies the Authorization: Bearer <token> header and attaches the
// decoded identity as req.auth = { id, role }. Downstream authorization
// (e.g. requireRole) reads from req.auth rather than re-decoding the token.
function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(new ApiError(401, 'Authentication required'));
  }

  try {
    const payload = verifyToken(token);
    req.auth = { id: payload.sub, role: payload.role };
    next();
  } catch {
    next(new ApiError(401, 'Invalid or expired session'));
  }
}

module.exports = authenticate;
