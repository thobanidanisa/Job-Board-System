import apiClient from './apiClient'

const getProvinces = () => apiClient.get('/lookups/provinces')
const getCategories = () => apiClient.get('/lookups/categories')

export default { getProvinces, getCategories }
