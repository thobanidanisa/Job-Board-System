import apiClient from './apiClient'

const createJob = (payload) => apiClient.post('/jobs', payload)
const getMyJobs = () => apiClient.get('/jobs/mine')
const getJob = (jobId) => apiClient.get(`/jobs/${jobId}`)
const updateJob = (jobId, payload) => apiClient.patch(`/jobs/${jobId}`, payload)

export default { createJob, getMyJobs, getJob, updateJob }
