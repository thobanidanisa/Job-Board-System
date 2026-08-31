import axios from 'axios'

// The key pinia-plugin-persistedstate uses to persist the auth store (see
// stores/auth.js `persist.key`). Read directly here rather than importing
// the store, which would create an apiClient <-> auth store <-> authService
// import cycle.
const AUTH_STORAGE_KEY = 'jobboard.auth'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

function readPersistedToken() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    return raw ? JSON.parse(raw).token : null
  } catch {
    return null
  }
}

apiClient.interceptors.request.use((config) => {
  const token = readPersistedToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Login/register legitimately answer 401 for bad credentials - that is a
// form error to show inline, NOT an expired session, so those endpoints are
// exempt from the session-expiry handling below.
const isAuthEndpoint = (url = '') => url.includes('/auth/login') || url.includes('/auth/register')

// Normalizes every failure into a single shape so callers only ever deal
// with { message, errors, status } regardless of whether the backend
// responded with an error, the request never reached it, or something
// else went wrong while building the request. A 401 on any other endpoint
// means the session really is dead: clear it and announce it via a window
// event, which App.vue turns into a normal SPA redirect. (Deliberately not
// a window.location assignment - that full-page reload is what made
// logging out and failed logins feel like the app was restarting.)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response

      if (status === 401 && !isAuthEndpoint(error.config?.url)) {
        localStorage.removeItem(AUTH_STORAGE_KEY)
        window.dispatchEvent(new CustomEvent('jobboard:session-expired'))
      }

      return Promise.reject({
        status,
        message: data?.message || 'Something went wrong. Please try again.',
        errors: data?.errors || null,
      })
    }

    if (error.request) {
      return Promise.reject({
        status: 0,
        message: 'Unable to reach the server. Check your connection and try again.',
        errors: null,
      })
    }

    return Promise.reject({ status: 0, message: error.message, errors: null })
  },
)

export default apiClient
