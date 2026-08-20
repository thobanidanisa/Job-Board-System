// Builds axios request config that forwards the caller's Authorization
// header upstream to Backend/api. Needed for any protected route - public
// routes (register/login/lookups) don't need this since apiClient sends
// no headers upstream by default.
const forwardAuthHeader = (req) =>
  req.headers.authorization ? { headers: { Authorization: req.headers.authorization } } : {};

module.exports = forwardAuthHeader;
