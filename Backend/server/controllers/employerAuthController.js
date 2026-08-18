const apiClient = require('../services/apiClient');
const asyncHandler = require('../utils/asyncHandler');
const forwardApiError = require('../utils/forwardApiError');

const register = asyncHandler(async (req, res) => {
  try {
    const { data } = await apiClient.post('/employers/auth/register', req.body);
    res.status(201).json(data);
  } catch (error) {
    throw forwardApiError(error);
  }
});

const login = asyncHandler(async (req, res) => {
  try {
    const { data } = await apiClient.post('/employers/auth/login', req.body);
    res.status(200).json(data);
  } catch (error) {
    throw forwardApiError(error);
  }
});

module.exports = { register, login };
