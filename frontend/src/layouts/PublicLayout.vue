<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import AppSnackbar from '@/components/common/AppSnackbar.vue'
import BrandMark from '@/components/common/BrandMark.vue'

const router = useRouter()
const auth = useAuthStore()
const ui = useUiStore()
const { mdAndUp } = useDisplay()

const drawer = ref(false)

const navLinks = computed(() => [
  { label: 'Find a Job', to: '/register?role=client' },
  { label: 'Post a Job', to: '/register?role=employer' },
])

function handleLogout() {
  auth.logout()
  ui.info('You have been logged out')
  router.push('/')
}
</script>

<template>
  <v-app style="background: transparent">
    <v-app-bar flat color="surface" class="jb-glass" style="box-shadow: 0 1px 0 rgba(226,232,240,0.9), 0 12px 24px -16px rgba(15,23,42,0.15);">
      <v-container class="tw:flex tw:items-center tw:py-0" style="max-width: 1200px">
        <router-link to="/" class="tw:flex tw:items-center tw:gap-2 tw:no-underline">
          <BrandMark />
        </router-link>

        <v-spacer />

        <div v-if="mdAndUp" class="tw:flex tw:items-center tw:gap-2">
          <v-btn
            v-for="link in navLinks"
            :key="link.label"
            :to="link.to"
            variant="text"
            color="default"
          >
            {{ link.label }}
          </v-btn>
        </div>

        <v-spacer v-if="mdAndUp" />

        <template v-if="mdAndUp">
          <template v-if="auth.isAuthenticated">
            <v-btn :to="auth.dashboardPath" color="primary" variant="flat" class="tw:mr-2">
              Dashboard
            </v-btn>
            <v-btn variant="outlined" @click="handleLogout">Logout</v-btn>
          </template>
          <template v-else>
            <v-btn to="/login" variant="text" class="tw:mr-2">Login</v-btn>
            <v-btn to="/register" color="primary" variant="flat" class="jb-btn-gradient">Create Account</v-btn>
          </template>
        </template>

        <v-app-bar-nav-icon v-else @click="drawer = !drawer" />
      </v-container>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary location="end">
      <v-list>
        <v-list-item v-for="link in navLinks" :key="link.label" :to="link.to" @click="drawer = false">
          {{ link.label }}
        </v-list-item>
        <v-divider class="tw:my-2" />
        <template v-if="auth.isAuthenticated">
          <v-list-item :to="auth.dashboardPath" @click="drawer = false">Dashboard</v-list-item>
          <v-list-item @click="drawer = false; handleLogout()">Logout</v-list-item>
        </template>
        <template v-else>
          <v-list-item to="/login" @click="drawer = false">Login</v-list-item>
          <v-list-item to="/register" @click="drawer = false">Create Account</v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>

    <v-footer class="tw:flex-col" color="surface" style="border-top: 1px solid rgba(226,232,240,0.8)">
      <div class="tw:w-full tw:flex tw:flex-col tw:md:flex-row tw:items-center tw:justify-between tw:gap-3 tw:py-6 tw:px-4" style="max-width: 1200px; margin: 0 auto;">
        <BrandMark size="small" />
        <span class="tw:text-sm" style="color: rgba(15,23,42,0.55)">
          &copy; {{ new Date().getFullYear() }} JobBoard. All rights reserved.
        </span>
      </div>
    </v-footer>

    <AppSnackbar />
  </v-app>
</template>
