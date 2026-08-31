<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import AmbientBackground from '@/components/common/AmbientBackground.vue'
import PublicLayout from '@/layouts/PublicLayout.vue'
import ClientLayout from '@/layouts/ClientLayout.vue'
import EmployerLayout from '@/layouts/EmployerLayout.vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const ui = useUiStore()

const layouts = {
  public: PublicLayout,
  client: ClientLayout,
  employer: EmployerLayout,
}

const activeLayout = computed(() => layouts[route.meta.layout] || PublicLayout)

// apiClient dispatches this instead of doing a window.location redirect, so
// an expired session unwinds through the router like any other navigation -
// no full page reload.
function handleSessionExpired() {
  if (!auth.isAuthenticated && !auth.token) return
  auth.logout()
  ui.info('Your session has expired. Please log in again.')
  router.push({ name: 'login' })
}

onMounted(() => {
  // Drop a persisted-but-expired session before the first render settles,
  // so logged-out chrome shows immediately rather than after a failed call.
  auth.checkSession()
  window.addEventListener('jobboard:session-expired', handleSessionExpired)
})

onUnmounted(() => {
  window.removeEventListener('jobboard:session-expired', handleSessionExpired)
})
</script>

<template>
  <AmbientBackground />
  <component :is="activeLayout" />
</template>
