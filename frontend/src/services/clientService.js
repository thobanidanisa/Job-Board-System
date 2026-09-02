import apiClient from './apiClient'

const updateProfile = (payload) => apiClient.patch('/clients/profile', payload)

export default { updateProfile }
