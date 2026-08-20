import apiClient from './apiClient'

const createJob = (payload) => apiClient.post('/jobs', payload)
const getMyJobs = () => apiClient.get('/jobs/mine')

export default { createJob, getMyJobs }
