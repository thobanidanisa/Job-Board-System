import apiClient from './apiClient'

const getProvinces = () => apiClient.get('/lookups/provinces')

export default { getProvinces }
