require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const errorHandler = require('./middleware/errorHandler');

const clientAuthRoutes = require('./routes/clientAuthRoutes');
const employerAuthRoutes = require('./routes/employerAuthRoutes');
const employerRoutes = require('./routes/employerRoutes');
const lookupRoutes = require('./routes/lookupRoutes');
const jobRoutes = require('./routes/jobRoutes');
// Forgot-password / OTP-via-email flow is paused for now - re-add
// passwordResetRoutes here once that feature is picked back up.

const app = express();

/* ---------------------------------------------------------------
   Core middleware
   --------------------------------------------------------------- */
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_APP_URL,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

/* ---------------------------------------------------------------
   Health check
   --------------------------------------------------------------- */
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

/* ---------------------------------------------------------------
   Routes
   --------------------------------------------------------------- */
app.use('/api/clients/auth', clientAuthRoutes);
app.use('/api/employers/auth', employerAuthRoutes);
app.use('/api/employers', employerRoutes);
app.use('/api/lookups', lookupRoutes);
app.use('/api/jobs', jobRoutes);

/* ---------------------------------------------------------------
   404 handler - must come after all real routes
   --------------------------------------------------------------- */
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

/* ---------------------------------------------------------------
   Centralized error handler - must be the LAST app.use()
   --------------------------------------------------------------- */
app.use(errorHandler);

const PORT = process.env.PORT || 2000;

app.listen(PORT, () => {
  console.log(`Job Board API running on port ${PORT}`);
});