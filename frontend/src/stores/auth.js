import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '@/services/authService'
import employerService from '@/services/employerService'
import { isTokenExpired } from '@/utils/token'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const user = ref(null)
    const role = ref(null) // 'client' | 'employer'
    const token = ref(null)

    // A persisted token that has expired must NOT count as a live session,
    // otherwise the UI shows logged-in chrome (Logout button, dashboards)
    // for a token every API call will reject with a 401.
    const isAuthenticated = computed(() => Boolean(token.value) && !isTokenExpired(token.value))
    const isClient = computed(() => role.value === 'client')
    const isEmployer = computed(() => role.value === 'employer')
    const dashboardPath = computed(() =>
      role.value === 'employer' ? '/employer/dashboard' : '/client/dashboard',
    )
    const displayName = computed(() => {
      if (!user.value) return ''
      return role.value === 'employer' ? user.value.companyName : user.value.name
    })

    function setSession({ userData, userRole, authToken }) {
      user.value = userData
      role.value = userRole
      token.value = authToken
    }

    async function loginClient(payload) {
      const { data } = await authService.loginClient(payload)
      setSession({ userData: data.data.client, userRole: 'client', authToken: data.data.token })
    }

    async function loginEmployer(payload) {
      const { data } = await authService.loginEmployer(payload)
      setSession({ userData: data.data.employer, userRole: 'employer', authToken: data.data.token })
    }

    async function registerClient(payload) {
      const { data } = await authService.registerClient(payload)
      setSession({ userData: data.data.client, userRole: 'client', authToken: data.data.token })
    }

    async function registerEmployer(payload) {
      const { data } = await authService.registerEmployer(payload)
      setSession({ userData: data.data.employer, userRole: 'employer', authToken: data.data.token })
    }

    // Merges the updated employer fields into the current session so the
    // app bar/dashboard reflect the change immediately, no re-login needed.
    async function updateEmployerProfile(payload) {
      const { data } = await employerService.updateProfile(payload)
      user.value = { ...user.value, ...data.data.employer }
      return user.value
    }

    // Called on app start and before each guarded navigation so an expired
    // session is cleared from both the store and localStorage, rather than
    // lingering until the next request fails.
    function checkSession() {
      if (token.value && isTokenExpired(token.value)) {
        logout()
        return false
      }
      return Boolean(token.value)
    }

    function logout() {
      user.value = null
      role.value = null
      token.value = null
    }

    return {
      user,
      role,
      token,
      isAuthenticated,
      isClient,
      isEmployer,
      dashboardPath,
      displayName,
      loginClient,
      loginEmployer,
      registerClient,
      registerEmployer,
      updateEmployerProfile,
      checkSession,
      logout,
    }
  },
  {
    persist: {
      key: 'jobboard.auth',
      pick: ['user', 'role', 'token'],
    },
  },
)
