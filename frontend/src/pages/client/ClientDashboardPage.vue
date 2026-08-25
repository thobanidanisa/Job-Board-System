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

const stats = [
  { label: 'Applications Submitted', value: '0', icon: 'mdi-file-document-outline', badge: 'primary' },
  { label: 'Interviews Scheduled', value: '0', icon: 'mdi-calendar-clock-outline', badge: 'secondary' },
  { label: 'Saved Jobs', value: '0', icon: 'mdi-bookmark-outline', badge: 'accent' },
]

const profileFields = computed(() => [
  { label: 'Email', value: auth.user?.email, icon: 'mdi-email-outline' },
  { label: 'Phone', value: auth.user?.phoneNumber, icon: 'mdi-phone-outline' },
  { label: 'Town', value: auth.user?.town, icon: 'mdi-map-marker-outline' },
  { label: 'Suburb', value: auth.user?.suburb, icon: 'mdi-home-city-outline' },
])
</script>

<template>
  <v-container class="tw:py-10" style="max-width: 1200px">
    <div class="tw:flex tw:flex-col tw:md:flex-row tw:md:items-center tw:md:justify-between tw:gap-4 tw:mb-10">
      <div>
        <h1 class="tw:text-2xl tw:font-bold" style="color:#1E1B4B">
          Welcome back, {{ auth.user?.name }}
        </h1>
        <p class="tw:text-sm tw:mt-1" style="color: rgba(30,27,75,0.6)">Member since {{ memberSince }}</p>
      </div>
      <v-chip color="secondary" variant="tonal" prepend-icon="mdi-account-check-outline">
        Job Seeker Account
      </v-chip>
    </div>

    <v-row>
      <v-col v-for="stat in stats" :key="stat.label" cols="12" sm="4">
        <TiltCard :max-tilt="4" :glow="stat.badge === 'accent' ? 'primary' : stat.badge">
          <v-card class="tw:pa-5 jb-card--glass" elevation="0">
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
        <div class="jb-card jb-card--glass tw:pa-6 tw:h-full">
          <div class="tw:font-semibold tw:text-lg tw:mb-5" style="color:#1E1B4B">What's next</div>
          <v-row>
            <v-col cols="12" sm="6">
              <div class="jb-card jb-card--hoverable tw:pa-5" style="background: var(--jb-grad-primary); color: #fff; border: none;">
                <v-icon icon="mdi-briefcase-search-outline" size="28" class="tw:mb-3" />
                <div class="tw:font-semibold">Search Jobs</div>
                <div class="tw:text-sm tw:mt-1" style="opacity: 0.85">Browse and filter open roles.</div>
                <v-chip size="x-small" class="tw:mt-4" variant="flat">Coming soon</v-chip>
              </div>
            </v-col>
            <v-col cols="12" sm="6">
              <div class="jb-card jb-card--hoverable tw:pa-5" style="background: var(--jb-grad-secondary); color: #fff; border: none;">
                <v-icon icon="mdi-file-document-check-outline" size="28" class="tw:mb-3" />
                <div class="tw:font-semibold">Track Applications</div>
                <div class="tw:text-sm tw:mt-1" style="opacity: 0.85">Follow every application's status.</div>
                <v-chip size="x-small" class="tw:mt-4" variant="flat">Coming soon</v-chip>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-col>

      <v-col cols="12" md="5">
        <div class="jb-card jb-card--glass tw:h-full">
          <div class="tw:font-semibold tw:text-lg tw:pa-6 tw:pb-2" style="color:#1E1B4B">Your Details</div>
          <v-list bg-color="transparent" class="tw:pb-4">
            <v-list-item v-for="field in profileFields" :key="field.label" :title="field.value || '-'" :subtitle="field.label">
              <template #prepend>
                <div class="jb-badge jb-badge--primary tw:mr-2" style="width: 36px; height: 36px;">
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
