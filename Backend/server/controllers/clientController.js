const apiClient = require('../services/apiClient');
const asyncHandler = require('../utils/asyncHandler');
const forwardApiError = require('../utils/forwardApiError');
const forwardAuthHeader = require('../utils/forwardAuthHeader');

const updateProfile = asyncHandler(async (req, res) => {
  try {
    const { data } = await apiClient.patch('/clients/profile', req.body, forwardAuthHeader(req));
    res.status(200).json(data);
  } catch (error) {
    throw forwardApiError(error);
  }
});

module.exports = { updateProfile };
