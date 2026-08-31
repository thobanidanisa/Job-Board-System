// Browser origins allowed to call this service.
//
// CLIENT_APP_URL may hold a single origin or a comma-separated list (e.g. a
// production domain plus a staging one). Outside production, any localhost
// port is also accepted - otherwise Vite falling back from 5173 to 5174
// (which it does whenever 5173 is busy) breaks every request with a CORS
// error that looks nothing like the actual cause.
const LOCALHOST_PATTERN = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

const parseAllowedOrigins = () =>
  (process.env.CLIENT_APP_URL || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // No Origin header at all: curl/Postman, and server-to-server calls
    // (the gateway calling the api). Always allowed.
    if (!origin) return callback(null, true);

    if (parseAllowedOrigins().includes(origin)) return callback(null, true);

    if (process.env.NODE_ENV !== 'production' && LOCALHOST_PATTERN.test(origin)) {
      return callback(null, true);
    }

    // Reject by omitting the CORS headers rather than throwing, so an
    // unknown origin gets a clean browser-side block instead of a 500.
    return callback(null, false);
  },
  credentials: true,
};

module.exports = corsOptions;
