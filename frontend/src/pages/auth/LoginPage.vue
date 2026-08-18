<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import { required, isEmail } from '@/utils/validators'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const ui = useUiStore()

const tab = ref(route.query.role === 'employer' ? 'employer' : 'client')

const clientForm = ref(null)
const employerForm = ref(null)

const clientModel = ref({ email: '', password: '' })
const employerModel = ref({ email: '', password: '' })

const showClientPassword = ref(false)
const showEmployerPassword = ref(false)

const loading = ref(false)
const formError = ref('')

function redirectAfterLogin() {
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : null
  router.push(redirect || auth.dashboardPath)
}

async function submitClient() {
  formError.value = ''
  const { valid } = await clientForm.value.validate()
  if (!valid) return

  loading.value = true
  try {
    await auth.loginClient(clientModel.value)
    ui.success('Welcome back!')
    redirectAfterLogin()
  } catch (err) {
    formError.value = err.message
  } finally {
    loading.value = false
  }
}

async function submitEmployer() {
  formError.value = ''
  const { valid } = await employerForm.value.validate()
  if (!valid) return

  loading.value = true
  try {
    await auth.loginEmployer(employerModel.value)
    ui.success('Welcome back!')
    redirectAfterLogin()
  } catch (err) {
    formError.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="tw:relative tw:overflow-hidden tw:flex tw:items-center tw:justify-center" style="min-height: calc(100vh - 64px - 90px); padding: 56px 16px;">
    <div class="jb-blob-field">
      <div class="jb-blob" style="width: 360px; height: 360px; top: -80px; left: -60px; background: #4F46E5;" />
      <div class="jb-blob" style="width: 320px; height: 320px; bottom: -100px; right: -60px; background: #0EA5A4; animation-delay: -5s;" />
    </div>

    <v-card
      class="jb-glass tw:w-full"
      max-width="460"
      style="position: relative; z-index: 1; box-shadow: var(--jb-shadow-lift);"
      rounded="lg"
    >
      <v-card-text class="tw:p-8 tw:md:p-10">
        <div class="tw:text-center tw:mb-6">
          <h1 class="tw:text-2xl tw:font-bold" style="color:#1E1B4B">Welcome back</h1>
          <p class="tw:text-sm tw:mt-1" style="color: rgba(30,27,75,0.65)">Log in to continue to JobBoard</p>
        </div>

        <v-tabs v-model="tab" grow color="primary" class="tw:mb-6">
          <v-tab value="client">Job Seeker</v-tab>
          <v-tab value="employer">Employer</v-tab>
        </v-tabs>

        <v-alert v-if="formError" type="error" variant="tonal" density="compact" class="tw:mb-4">
          {{ formError }}
        </v-alert>

        <v-window v-model="tab">
          <v-window-item value="client">
            <v-form ref="clientForm" @submit.prevent="submitClient">
              <v-text-field
                v-model="clientModel.email"
                label="Email"
                type="email"
                prepend-inner-icon="mdi-email-outline"
                :rules="[required('Email'), isEmail]"
                class="tw:mb-1"
              />
              <v-text-field
                v-model="clientModel.password"
                label="Password"
                :type="showClientPassword ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="showClientPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                :rules="[required('Password')]"
                @click:append-inner="showClientPassword = !showClientPassword"
              />
              <v-btn type="submit" color="primary" size="large" block :loading="loading" class="jb-btn-gradient tw:mt-4">
                Log In
              </v-btn>
            </v-form>
          </v-window-item>

          <v-window-item value="employer">
            <v-form ref="employerForm" @submit.prevent="submitEmployer">
              <v-text-field
                v-model="employerModel.email"
                label="Email"
                type="email"
                prepend-inner-icon="mdi-email-outline"
                :rules="[required('Email'), isEmail]"
                class="tw:mb-1"
              />
              <v-text-field
                v-model="employerModel.password"
                label="Password"
                :type="showEmployerPassword ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="showEmployerPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                :rules="[required('Password')]"
                @click:append-inner="showEmployerPassword = !showEmployerPassword"
              />
              <v-btn type="submit" color="primary" size="large" block :loading="loading" class="jb-btn-gradient tw:mt-4">
                Log In
              </v-btn>
            </v-form>
          </v-window-item>
        </v-window>

        <p class="tw:text-center tw:text-sm tw:mt-6" style="color: rgba(30,27,75,0.65)">
          Don't have an account?
          <router-link :to="`/register?role=${tab}`" style="color:#4F46E5; font-weight:600; text-decoration:none">
            Create one
          </router-link>
        </p>
      </v-card-text>
    </v-card>
  </section>
</template>
