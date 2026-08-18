import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '@/services/authService'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const user = ref(null)
    const role = ref(null) // 'client' | 'employer'
    const token = ref(null)

    const isAuthenticated = computed(() => Boolean(token.value))
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
