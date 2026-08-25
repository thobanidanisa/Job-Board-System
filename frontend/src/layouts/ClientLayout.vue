<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import AppSnackbar from '@/components/common/AppSnackbar.vue'
import BrandMark from '@/components/common/BrandMark.vue'

const router = useRouter()
const auth = useAuthStore()
const ui = useUiStore()
const { smAndUp, mdAndUp } = useDisplay()

// Permanent on desktop, closed by default on mobile/tablet (where the
// drawer becomes a temporary overlay and would otherwise cover the page
// behind a scrim on first load).
const drawer = ref(mdAndUp.value)

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
  <v-app style="background: transparent">
    <v-app-bar flat color="surface" class="jb-glass" style="box-shadow: 0 1px 0 rgba(226,232,240,0.9), 0 12px 24px -16px rgba(15,23,42,0.15);">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <router-link to="/client/dashboard" class="tw:no-underline tw:ml-1">
        <BrandMark size="small" />
      </router-link>
      <v-spacer />
      <v-chip v-if="mdAndUp" color="secondary" variant="tonal" size="small" class="tw:mr-3">Job Seeker</v-chip>
      <v-menu>
        <template #activator="{ props }">
          <v-btn v-bind="props" variant="text" class="tw:normal-case tw:px-2">
            <v-avatar color="primary" size="32" :class="smAndUp ? 'tw:mr-2' : ''">
              <span class="tw:text-white tw:text-sm tw:font-semibold">
                {{ auth.displayName?.charAt(0) || 'U' }}
              </span>
            </v-avatar>
            <span v-if="smAndUp">{{ auth.displayName }}</span>
            <v-icon icon="mdi-chevron-down" end />
          </v-btn>
        </template>
        <v-list>
          <v-list-item prepend-icon="mdi-logout" title="Logout" @click="handleLogout" />
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" class="jb-glass-nav" style="border-right: 1px solid rgba(226,232,240,0.6);">
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

    <v-main>
      <router-view />
    </v-main>

    <AppSnackbar />
  </v-app>
</template>
