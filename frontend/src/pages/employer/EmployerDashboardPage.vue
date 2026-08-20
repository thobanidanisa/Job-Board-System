<script setup>
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useJobsStore } from '@/stores/jobs'
import TiltCard from '@/components/common/TiltCard.vue'

const auth = useAuthStore()
const jobsStore = useJobsStore()

onMounted(() => {
  jobsStore.fetchMyJobs()
})

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

const stats = computed(() => [
  { label: 'Active Job Posts', value: String(jobsStore.activeCount), icon: 'mdi-briefcase-outline', badge: 'primary' },
  { label: 'Applications Received', value: '0', icon: 'mdi-account-multiple-outline', badge: 'secondary' },
  { label: 'Interviews Scheduled', value: '0', icon: 'mdi-calendar-clock-outline', badge: 'accent' },
])

const profileFields = computed(() => [
  { label: 'Login Email', value: auth.user?.email, icon: 'mdi-email-outline' },
  { label: 'HR Email', value: auth.user?.hrEmail, icon: 'mdi-email-fast-outline' },
  { label: 'Phone', value: auth.user?.phoneNumber, icon: 'mdi-phone-outline' },
  { label: 'Industry', value: auth.user?.industryType, icon: 'mdi-domain' },
  { label: 'Town', value: auth.user?.town, icon: 'mdi-map-marker-outline' },
])
</script>

<template>
  <v-container class="tw:py-10" style="max-width: 1200px">
    <div class="tw:flex tw:flex-col tw:md:flex-row tw:md:items-center tw:md:justify-between tw:gap-4 tw:mb-8">
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
      class="tw:mb-8"
      icon="mdi-clock-outline"
    >
      Your company is pending verification. You can still set up your account while we review it.
    </v-alert>

    <v-row>
      <v-col v-for="stat in stats" :key="stat.label" cols="12" sm="4">
        <TiltCard :max-tilt="4" :glow="stat.badge === 'accent' ? 'secondary' : stat.badge">
          <v-card class="tw:pa-5" elevation="0">
            <div class="tw:flex tw:items-center tw:gap-4">
              <div class="jb-badge" :class="`jb-badge--${stat.badge}`" style="width: 52px; height: 52px;">
                <v-icon :icon="stat.icon" size="24" />
              </div>
              <div>
                <div class="tw:text-2xl tw:font-bold" style="color:#1E1B4B">{{ stat.value }}</div>
                <div class="tw:text-sm" style="color: rgba(30,27,75,0.6)">{{ stat.label }}</div>
              </div>
            </div>
          </v-card>
        </TiltCard>
      </v-col>
    </v-row>

    <v-row class="tw:mt-6">
      <v-col cols="12" md="7">
        <div class="jb-card tw:pa-6 tw:h-full">
          <div class="tw:font-semibold tw:text-lg tw:mb-5" style="color:#1E1B4B">What's next</div>
          <v-row>
            <v-col cols="12" sm="6">
              <router-link
                to="/employer/jobs/new"
                class="jb-card jb-card--hoverable tw:pa-5 tw:block tw:no-underline"
                style="background: var(--jb-grad-primary); color: #fff; border: none;"
              >
                <v-icon icon="mdi-briefcase-plus-outline" size="28" class="tw:mb-3" />
                <div class="tw:font-semibold">Post a Job</div>
                <div class="tw:text-sm tw:mt-1" style="opacity: 0.85">Publish a new role for candidates.</div>
                <v-chip size="x-small" class="tw:mt-4" variant="flat" color="white">
                  <span style="color: #4338CA">Get started</span>
                </v-chip>
              </router-link>
            </v-col>
            <v-col cols="12" sm="6">
              <div class="jb-card jb-card--hoverable tw:pa-5" style="background: var(--jb-grad-secondary); color: #fff; border: none;">
                <v-icon icon="mdi-account-multiple-check-outline" size="28" class="tw:mb-3" />
                <div class="tw:font-semibold">Review Applications</div>
                <div class="tw:text-sm tw:mt-1" style="opacity: 0.85">See and decide on candidates.</div>
                <v-chip size="x-small" class="tw:mt-4" variant="flat">Coming soon</v-chip>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-col>

      <v-col cols="12" md="5">
        <div class="jb-card tw:h-full">
          <div class="tw:font-semibold tw:text-lg tw:pa-6 tw:pb-2" style="color:#1E1B4B">Company Details</div>
          <v-list bg-color="transparent" class="tw:pb-4">
            <v-list-item v-for="field in profileFields" :key="field.label" :title="field.value || '-'" :subtitle="field.label">
              <template #prepend>
                <div class="jb-badge jb-badge--secondary tw:mr-2" style="width: 36px; height: 36px;">
                  <v-icon :icon="field.icon" size="18" />
                </div>
              </template>
            </v-list-item>
          </v-list>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
