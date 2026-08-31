const apiClient = require('../services/apiClient');
const asyncHandler = require('../utils/asyncHandler');
const forwardApiError = require('../utils/forwardApiError');
const forwardAuthHeader = require('../utils/forwardAuthHeader');

const createJob = asyncHandler(async (req, res) => {
  try {
    const { data } = await apiClient.post('/jobs', req.body, forwardAuthHeader(req));
    res.status(201).json(data);
  } catch (error) {
    throw forwardApiError(error);
  }
});

const listMyJobs = asyncHandler(async (req, res) => {
  try {
    const { data } = await apiClient.get('/jobs/mine', forwardAuthHeader(req));
    res.status(200).json(data);
  } catch (error) {
    throw forwardApiError(error);
  }
});

const getJob = asyncHandler(async (req, res) => {
  try {
    const { data } = await apiClient.get(`/jobs/${req.params.id}`, forwardAuthHeader(req));
    res.status(200).json(data);
  } catch (error) {
    throw forwardApiError(error);
  }
});

const updateJob = asyncHandler(async (req, res) => {
  try {
    const { data } = await apiClient.patch(`/jobs/${req.params.id}`, req.body, forwardAuthHeader(req));
    res.status(200).json(data);
  } catch (error) {
    throw forwardApiError(error);
  }
});

module.exports = { createJob, listMyJobs, getJob, updateJob };
