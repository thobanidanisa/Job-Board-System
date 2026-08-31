import apiClient from './apiClient'

const updateProfile = (payload) => apiClient.patch('/employers/profile', payload)

export default { updateProfile }
