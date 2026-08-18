<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import TiltCard from '@/components/common/TiltCard.vue'

const auth = useAuthStore()

const memberSince = computed(() => {
  if (!auth.user?.createdAt) return '-'
  return new Date(auth.user.createdAt).toLocaleDateString('en-ZA', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
})

const verificationColor = computed(() => {
  const status = auth.user?.verificationStatus
  if (status === 'Verified') return 'success'
  if (status === 'Rejected') return 'error'
  return 'warning'
})

const stats = [
  { label: 'Active Job Posts', value: '0', icon: 'mdi-briefcase-outline', color: 'primary' },
  { label: 'Applications Received', value: '0', icon: 'mdi-account-multiple-outline', color: 'secondary' },
  { label: 'Interviews Scheduled', value: '0', icon: 'mdi-calendar-clock-outline', color: 'accent' },
]

const profileFields = computed(() => [
  { label: 'Login Email', value: auth.user?.email, icon: 'mdi-email-outline' },
  { label: 'HR Email', value: auth.user?.hrEmail, icon: 'mdi-email-fast-outline' },
  { label: 'Phone', value: auth.user?.phoneNumber, icon: 'mdi-phone-outline' },
  { label: 'Industry', value: auth.user?.industryType, icon: 'mdi-domain' },
  { label: 'Town', value: auth.user?.town, icon: 'mdi-map-marker-outline' },
])
</script>

<template>
  <v-container class="tw:py-8" style="max-width: 1200px">
    <div class="tw:flex tw:flex-col tw:md:flex-row tw:md:items-center tw:md:justify-between tw:gap-3 tw:mb-8">
      <div>
        <h1 class="tw:text-2xl tw:font-bold" style="color:#1E1B4B">
          Welcome back, {{ auth.user?.companyName }}
        </h1>
        <p class="tw:text-sm tw:mt-1" style="color: rgba(30,27,75,0.6)">Member since {{ memberSince }}</p>
      </div>
      <v-chip :color="verificationColor" variant="tonal" prepend-icon="mdi-shield-check-outline">
        {{ auth.user?.verificationStatus }} verification
      </v-chip>
    </div>

    <v-alert
      v-if="auth.user?.verificationStatus === 'Pending'"
      type="info"
      variant="tonal"
      density="comfortable"
      class="tw:mb-6"
      icon="mdi-clock-outline"
    >
      Your company is pending verification. You can still set up your account while we review it.
    </v-alert>

    <v-row>
      <v-col v-for="stat in stats" :key="stat.label" cols="12" sm="4">
        <TiltCard :max-tilt="4">
          <v-card class="tw:p-4" variant="flat" style="border: 1px solid rgba(226,232,240,0.9)">
            <div class="tw:flex tw:items-center tw:gap-4">
              <v-avatar :color="stat.color" variant="tonal" size="52">
                <v-icon :icon="stat.icon" size="26" />
              </v-avatar>
              <div>
                <div class="tw:text-2xl tw:font-bold" style="color:#1E1B4B">{{ stat.value }}</div>
                <div class="tw:text-sm" style="color: rgba(30,27,75,0.6)">{{ stat.label }}</div>
              </div>
            </div>
          </v-card>
        </TiltCard>
      </v-col>
    </v-row>

    <v-row class="tw:mt-2">
      <v-col cols="12" md="7">
        <v-card class="tw:p-1" variant="flat" style="border: 1px solid rgba(226,232,240,0.9)">
          <v-card-item>
            <v-card-title class="tw:font-semibold" style="color:#1E1B4B">What's next</v-card-title>
          </v-card-item>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6">
                <v-card class="tw:p-4" variant="tonal" color="primary">
                  <v-icon icon="mdi-briefcase-plus-outline" size="28" class="tw:mb-2" />
                  <div class="tw:font-semibold">Post a Job</div>
                  <div class="tw:text-sm tw:mt-1" style="opacity: 0.85">Publish a new role for candidates.</div>
                  <v-chip size="x-small" class="tw:mt-3" variant="flat">Coming soon</v-chip>
                </v-card>
              </v-col>
              <v-col cols="12" sm="6">
                <v-card class="tw:p-4" variant="tonal" color="secondary">
                  <v-icon icon="mdi-account-multiple-check-outline" size="28" class="tw:mb-2" />
                  <div class="tw:font-semibold">Review Applications</div>
                  <div class="tw:text-sm tw:mt-1" style="opacity: 0.85">See and decide on candidates.</div>
                  <v-chip size="x-small" class="tw:mt-3" variant="flat">Coming soon</v-chip>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="5">
        <v-card class="tw:p-1" variant="flat" style="border: 1px solid rgba(226,232,240,0.9)">
          <v-card-item>
            <v-card-title class="tw:font-semibold" style="color:#1E1B4B">Company Details</v-card-title>
          </v-card-item>
          <v-list bg-color="transparent">
            <v-list-item v-for="field in profileFields" :key="field.label" :title="field.value || '-'" :subtitle="field.label">
              <template #prepend>
                <v-icon :icon="field.icon" color="secondary" />
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
