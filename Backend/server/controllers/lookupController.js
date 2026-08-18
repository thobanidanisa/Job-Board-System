const apiClient = require('../services/apiClient');
const asyncHandler = require('../utils/asyncHandler');
const forwardApiError = require('../utils/forwardApiError');

const listProvinces = asyncHandler(async (req, res) => {
  try {
    const { data } = await apiClient.get('/lookups/provinces');
    res.status(200).json(data);
  } catch (error) {
    throw forwardApiError(error);
  }
});

module.exports = { listProvinces };
