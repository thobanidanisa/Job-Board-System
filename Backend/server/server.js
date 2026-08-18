require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const errorHandler = require('./middleware/errorHandler');

const clientAuthRoutes = require('./routes/clientAuthRoutes');
const employerAuthRoutes = require('./routes/employerAuthRoutes');

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
   Routes - forwarded to the upstream api (Backend/api) via apiClient
   --------------------------------------------------------------- */
app.use('/api/clients/auth', clientAuthRoutes);
app.use('/api/employers/auth', employerAuthRoutes);

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Job Board Server running on port ${PORT}`);
});
