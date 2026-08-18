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
  { label: 'Applications Submitted', value: '0', icon: 'mdi-file-document-outline', color: 'primary' },
  { label: 'Interviews Scheduled', value: '0', icon: 'mdi-calendar-clock-outline', color: 'secondary' },
  { label: 'Saved Jobs', value: '0', icon: 'mdi-bookmark-outline', color: 'accent' },
]

const profileFields = computed(() => [
  { label: 'Email', value: auth.user?.email, icon: 'mdi-email-outline' },
  { label: 'Phone', value: auth.user?.phoneNumber, icon: 'mdi-phone-outline' },
  { label: 'Town', value: auth.user?.town, icon: 'mdi-map-marker-outline' },
  { label: 'Suburb', value: auth.user?.suburb, icon: 'mdi-home-city-outline' },
])
</script>

<template>
  <v-container class="tw:py-8" style="max-width: 1200px">
    <div class="tw:flex tw:flex-col tw:md:flex-row tw:md:items-center tw:md:justify-between tw:gap-3 tw:mb-8">
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
                  <v-icon icon="mdi-briefcase-search-outline" size="28" class="tw:mb-2" />
                  <div class="tw:font-semibold">Search Jobs</div>
                  <div class="tw:text-sm tw:mt-1" style="opacity: 0.85">Browse and filter open roles.</div>
                  <v-chip size="x-small" class="tw:mt-3" variant="flat">Coming soon</v-chip>
                </v-card>
              </v-col>
              <v-col cols="12" sm="6">
                <v-card class="tw:p-4" variant="tonal" color="secondary">
                  <v-icon icon="mdi-file-document-check-outline" size="28" class="tw:mb-2" />
                  <div class="tw:font-semibold">Track Applications</div>
                  <div class="tw:text-sm tw:mt-1" style="opacity: 0.85">Follow every application's status.</div>
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
            <v-card-title class="tw:font-semibold" style="color:#1E1B4B">Your Details</v-card-title>
          </v-card-item>
          <v-list bg-color="transparent">
            <v-list-item v-for="field in profileFields" :key="field.label" :title="field.value || '-'" :subtitle="field.label">
              <template #prepend>
                <v-icon :icon="field.icon" color="primary" />
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
