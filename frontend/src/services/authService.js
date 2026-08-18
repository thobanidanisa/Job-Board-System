import apiClient from './apiClient'

const registerClient = (payload) => apiClient.post('/clients/auth/register', payload)
const loginClient = (payload) => apiClient.post('/clients/auth/login', payload)

const registerEmployer = (payload) => apiClient.post('/employers/auth/register', payload)
const loginEmployer = (payload) => apiClient.post('/employers/auth/login', payload)

export default { registerClient, loginClient, registerEmployer, loginEmployer }
