<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import lookupService from '@/services/lookupService'
import { required, isEmail, isPhoneNumber, isPostalCode } from '@/utils/validators'
import { INDUSTRY_OPTIONS } from '@/utils/constants'

const auth = useAuthStore()
const ui = useUiStore()

const form = ref(null)
const loading = ref(false)
const formError = ref('')

const provinces = ref([])
const provincesLoading = ref(true)

const model = ref({
  companyName: auth.user?.companyName ?? '',
  contactPerson: auth.user?.contactPerson ?? '',
  hrEmail: auth.user?.hrEmail ?? '',
  phoneNumber: auth.user?.phoneNumber ?? '',
  industryType: auth.user?.industryType ?? '',
  provinceId: auth.user?.provinceId ?? null,
  town: auth.user?.town ?? '',
  streetName: auth.user?.streetName ?? '',
  suburb: auth.user?.suburb ?? '',
  postalCode: auth.user?.postalCode ?? '',
})

const verificationColor = computed(() => {
  const status = auth.user?.verificationStatus
  if (status === 'Verified') return 'success'
  if (status === 'Rejected') return 'error'
  return 'warning'
})

onMounted(async () => {
  try {
    const { data } = await lookupService.getProvinces()
    provinces.value = data.data.provinces
  } catch {
    ui.error('Could not load provinces. Please refresh the page.')
  } finally {
    provincesLoading.value = false
  }
})

async function submit() {
  formError.value = ''
  const { valid } = await form.value.validate()
  if (!valid) return

  loading.value = true
  try {
    await auth.updateEmployerProfile(model.value)
    ui.success('Company profile updated successfully!')
  } catch (err) {
    formError.value = err.errors?.length
      ? `${err.message}: ${err.errors.map((e) => e.message).join(', ')}`
      : err.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <v-container class="tw:py-10" style="max-width: 820px">
    <div class="tw:flex tw:flex-col tw:sm:flex-row tw:sm:items-center tw:sm:justify-between tw:gap-4 tw:mb-8">
      <div>
        <h1 class="tw:text-2xl tw:font-bold" style="color:#1E1B4B">Company Profile</h1>
        <p class="tw:text-sm tw:mt-1" style="color: rgba(30,27,75,0.6)">
          Keep your company details up to date.
        </p>
      </div>
      <v-chip :color="verificationColor" variant="tonal" prepend-icon="mdi-shield-check-outline">
        {{ auth.user?.verificationStatus }} verification
      </v-chip>
    </div>

    <div class="jb-card jb-card--glass tw:pa-6 tw:md:pa-7 tw:mb-6">
      <div class="tw:flex tw:items-center tw:gap-3 tw:mb-1">
        <div class="jb-badge jb-badge--secondary" style="width: 36px; height: 36px;">
          <v-icon icon="mdi-account-outline" size="18" />
        </div>
        <span class="tw:font-semibold tw:text-lg" style="color:#1E1B4B">Login Email</span>
      </div>
      <p class="tw:text-sm tw:mb-3 tw:ml-1" style="color: rgba(30,27,75,0.6)">
        {{ auth.user?.email }} &middot; contact support to change your login email or password.
      </p>
    </div>

    <v-alert v-if="formError" type="error" variant="tonal" density="compact" class="tw:mb-6">
      {{ formError }}
    </v-alert>

    <v-form ref="form" @submit.prevent="submit">
      <div class="jb-card jb-card--glass tw:pa-6 tw:md:pa-7 tw:mb-6">
        <div class="tw:flex tw:items-center tw:gap-3 tw:mb-5">
          <div class="jb-badge jb-badge--primary" style="width: 36px; height: 36px;">
            <v-icon icon="mdi-domain" size="18" />
          </div>
          <span class="tw:font-semibold tw:text-lg" style="color:#1E1B4B">Company Details</span>
        </div>
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field v-model="model.companyName" label="Company Name" :rules="[required('Company name')]" />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field v-model="model.contactPerson" label="Contact Person" :rules="[required('Contact person')]" />
          </v-col>

          <v-col cols="12" sm="6">
            <v-combobox
              v-model="model.industryType"
              label="Industry"
              :items="INDUSTRY_OPTIONS"
              :rules="[required('Industry')]"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="model.phoneNumber"
              label="Phone Number"
              :rules="[required('Phone number'), isPhoneNumber]"
            />
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="model.hrEmail"
              label="HR Email"
              type="email"
              prepend-inner-icon="mdi-email-outline"
              :rules="[required('HR email'), isEmail]"
            />
          </v-col>
        </v-row>
      </div>

      <div class="jb-card jb-card--glass tw:pa-6 tw:md:pa-7 tw:mb-6">
        <div class="tw:flex tw:items-center tw:gap-3 tw:mb-5">
          <div class="jb-badge jb-badge--secondary" style="width: 36px; height: 36px;">
            <v-icon icon="mdi-map-marker-outline" size="18" />
          </div>
          <span class="tw:font-semibold tw:text-lg" style="color:#1E1B4B">Location</span>
        </div>
        <v-row>
          <v-col cols="12" sm="6">
            <v-select
              v-model="model.provinceId"
              label="Province"
              :items="provinces"
              item-title="provinceName"
              item-value="provinceId"
              :loading="provincesLoading"
              :rules="[required('Province')]"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field v-model="model.town" label="Town" :rules="[required('Town')]" />
          </v-col>

          <v-col cols="12" sm="4">
            <v-text-field v-model="model.streetName" label="Street Name" hint="Optional" />
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field v-model="model.suburb" label="Suburb" hint="Optional" />
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="model.postalCode"
              label="Postal Code"
              hint="Optional"
              maxlength="4"
              :rules="[isPostalCode]"
            />
          </v-col>
        </v-row>
      </div>

      <v-btn type="button" color="primary" size="large" class="jb-btn-gradient" :loading="loading" @click="submit">
        Save Changes
      </v-btn>
    </v-form>
  </v-container>
</template>
