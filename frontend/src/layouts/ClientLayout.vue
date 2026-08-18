<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import AppSnackbar from '@/components/common/AppSnackbar.vue'
import BrandMark from '@/components/common/BrandMark.vue'

const router = useRouter()
const auth = useAuthStore()
const ui = useUiStore()

const drawer = ref(true)

const menuItems = [
  { label: 'Dashboard', icon: 'mdi-view-dashboard-outline', to: '/client/dashboard', available: true },
  { label: 'Search Jobs', icon: 'mdi-briefcase-search-outline', available: false },
  { label: 'My Applications', icon: 'mdi-file-document-check-outline', available: false },
  { label: 'Profile', icon: 'mdi-account-outline', available: false },
]

function handleLogout() {
  auth.logout()
  ui.info('You have been logged out')
  router.push('/')
}
</script>

<template>
  <v-app>
    <v-app-bar flat color="surface" style="border-bottom: 1px solid rgba(226,232,240,0.8)">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <router-link to="/client/dashboard" class="tw:no-underline tw:ml-1">
        <BrandMark size="small" />
      </router-link>
      <v-spacer />
      <v-chip color="secondary" variant="tonal" size="small" class="tw:mr-3">Job Seeker</v-chip>
      <v-menu>
        <template #activator="{ props }">
          <v-btn v-bind="props" variant="text" class="tw:normal-case">
            <v-avatar color="primary" size="32" class="tw:mr-2">
              <span class="tw:text-white tw:text-sm tw:font-semibold">
                {{ auth.displayName?.charAt(0) || 'U' }}
              </span>
            </v-avatar>
            {{ auth.displayName }}
            <v-icon icon="mdi-chevron-down" end />
          </v-btn>
        </template>
        <v-list>
          <v-list-item prepend-icon="mdi-logout" title="Logout" @click="handleLogout" />
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer">
      <v-list nav>
        <v-list-item
          v-for="item in menuItems"
          :key="item.label"
          :to="item.available ? item.to : undefined"
          :disabled="!item.available"
          :prepend-icon="item.icon"
          :title="item.label"
        >
          <template v-if="!item.available" #append>
            <v-chip size="x-small" variant="tonal">Soon</v-chip>
          </template>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main style="background: rgb(var(--v-theme-background))">
      <router-view />
    </v-main>

    <AppSnackbar />
  </v-app>
</template>
