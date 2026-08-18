const axios = require('axios');

// Every call this server makes to the upstream api (Backend/api) goes
// through this single axios instance so the base URL and timeout are
// configured in exactly one place.
const apiClient = axios.create({
  baseURL: process.env.API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

module.exports = apiClient;
