<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import lookupService from '@/services/lookupService'
import {
  required,
  isEmail,
  isIdNumber,
  isPhoneNumber,
  isPostalCode,
  isStrongPassword,
  isAtLeast16,
  notInFuture,
  matchesPassword,
  isChecked,
} from '@/utils/validators'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const ui = useUiStore()

const tab = ref(route.query.role === 'employer' ? 'employer' : 'client')

const provinces = ref([])
const provincesLoading = ref(true)

const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say']
const industryOptions = [
  'IT', 'Sales', 'Admin', 'Construction', 'Finance', 'Healthcare',
  'Education', 'Logistics', 'Hospitality', 'Marketing', 'Manufacturing', 'Retail',
]

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

/* ---------------------------- Client form ---------------------------- */

const clientForm = ref(null)
const clientLoading = ref(false)
const clientFormError = ref('')
const showClientPassword = ref(false)

const clientModel = ref({
  name: '',
  surname: '',
  idNumber: '',
  dateOfBirth: '',
  gender: '',
  email: '',
  password: '',
  confirmPassword: '',
  phoneNumber: '',
  provinceId: null,
  town: '',
  streetName: '',
  suburb: '',
  postalCode: '',
  agreeToTerms: false,
})

async function submitClient() {
  clientFormError.value = ''
  const { valid } = await clientForm.value.validate()
  if (!valid) return

  clientLoading.value = true
  try {
    const { confirmPassword, agreeToTerms, ...payload } = clientModel.value
    await auth.registerClient(payload)
    ui.success('Account created! Welcome to JobBoard.')
    router.push(auth.dashboardPath)
  } catch (err) {
    clientFormError.value = err.errors?.length
      ? `${err.message}: ${err.errors.map((e) => e.message).join(', ')}`
      : err.message
  } finally {
    clientLoading.value = false
  }
}

/* --------------------------- Employer form ---------------------------- */

const employerForm = ref(null)
const employerLoading = ref(false)
const employerFormError = ref('')
const showEmployerPassword = ref(false)

const employerModel = ref({
  companyName: '',
  contactPerson: '',
  hrEmail: '',
  email: '',
  password: '',
  confirmPassword: '',
  phoneNumber: '',
  industryType: '',
  provinceId: null,
  town: '',
  streetName: '',
  suburb: '',
  postalCode: '',
  agreeToTerms: false,
})

async function submitEmployer() {
  employerFormError.value = ''
  const { valid } = await employerForm.value.validate()
  if (!valid) return

  employerLoading.value = true
  try {
    const { confirmPassword, agreeToTerms, ...payload } = employerModel.value
    await auth.registerEmployer(payload)
    ui.success('Account created! Welcome to JobBoard.')
    router.push(auth.dashboardPath)
  } catch (err) {
    employerFormError.value = err.errors?.length
      ? `${err.message}: ${err.errors.map((e) => e.message).join(', ')}`
      : err.message
  } finally {
    employerLoading.value = false
  }
}
</script>

<template>
  <section class="tw:relative tw:overflow-hidden tw:flex tw:items-center tw:justify-center" style="min-height: calc(100vh - 64px - 90px); padding: 56px 16px;">
    <div class="jb-blob-field">
      <div class="jb-blob" style="width: 380px; height: 380px; top: -100px; right: -80px; background: #0EA5A4;" />
      <div class="jb-blob" style="width: 340px; height: 340px; bottom: -120px; left: -70px; background: #4F46E5; animation-delay: -5s;" />
    </div>

    <v-card class="jb-glass tw:w-full" max-width="640" style="position: relative; z-index: 1;" rounded="lg">
      <v-card-text class="tw:p-8">
        <div class="tw:text-center tw:mb-6">
          <h1 class="tw:text-2xl tw:font-bold" style="color:#1E1B4B">Create your account</h1>
          <p class="tw:text-sm tw:mt-1" style="color: rgba(30,27,75,0.65)">It only takes a couple of minutes</p>
        </div>

        <v-tabs v-model="tab" grow color="primary" class="tw:mb-6">
          <v-tab value="client">Job Seeker</v-tab>
          <v-tab value="employer">Employer</v-tab>
        </v-tabs>

        <v-window v-model="tab">
          <!-- ============================= CLIENT ============================= -->
          <v-window-item value="client">
            <v-alert v-if="clientFormError" type="error" variant="tonal" density="compact" class="tw:mb-4">
              {{ clientFormError }}
            </v-alert>

            <v-form ref="clientForm" @submit.prevent="submitClient">
              <v-row dense>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="clientModel.name" label="Name" :rules="[required('Name')]" />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="clientModel.surname" label="Surname" :rules="[required('Surname')]" />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="clientModel.idNumber"
                    label="ID Number"
                    maxlength="13"
                    hint="13 digits"
                    :rules="[required('ID number'), isIdNumber]"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="clientModel.dateOfBirth"
                    label="Date of Birth"
                    type="date"
                    :rules="[required('Date of birth'), notInFuture, isAtLeast16]"
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-select v-model="clientModel.gender" label="Gender" :items="genderOptions" :rules="[required('Gender')]" />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="clientModel.phoneNumber"
                    label="Phone Number"
                    :rules="[required('Phone number'), isPhoneNumber]"
                  />
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="clientModel.email"
                    label="Email"
                    type="email"
                    prepend-inner-icon="mdi-email-outline"
                    :rules="[required('Email'), isEmail]"
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="clientModel.password"
                    label="Password"
                    :type="showClientPassword ? 'text' : 'password'"
                    prepend-inner-icon="mdi-lock-outline"
                    :append-inner-icon="showClientPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                    hint="At least 8 characters, with a number"
                    :rules="[required('Password'), isStrongPassword]"
                    @click:append-inner="showClientPassword = !showClientPassword"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="clientModel.confirmPassword"
                    label="Confirm Password"
                    :type="showClientPassword ? 'text' : 'password'"
                    prepend-inner-icon="mdi-lock-check-outline"
                    :rules="[required('Confirm password'), matchesPassword(() => clientModel.password)]"
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-select
                    v-model="clientModel.provinceId"
                    label="Province"
                    :items="provinces"
                    item-title="provinceName"
                    item-value="provinceId"
                    :loading="provincesLoading"
                    :rules="[required('Province')]"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="clientModel.town" label="Town" :rules="[required('Town')]" />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field v-model="clientModel.streetName" label="Street Name" :rules="[required('Street name')]" />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="clientModel.suburb" label="Suburb" :rules="[required('Suburb')]" />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="clientModel.postalCode"
                    label="Postal Code"
                    maxlength="4"
                    :rules="[required('Postal code'), isPostalCode]"
                  />
                </v-col>

                <v-col cols="12">
                  <v-checkbox
                    v-model="clientModel.agreeToTerms"
                    :rules="[isChecked('Agreeing to the terms')]"
                    color="primary"
                    density="compact"
                  >
                    <template #label>
                      <span class="tw:text-sm">I agree to the Terms of Service and Privacy Policy</span>
                    </template>
                  </v-checkbox>
                </v-col>
              </v-row>

              <v-btn type="submit" color="primary" size="large" block :loading="clientLoading" class="tw:mt-2">
                Create Job Seeker Account
              </v-btn>
            </v-form>
          </v-window-item>

          <!-- ============================ EMPLOYER ============================ -->
          <v-window-item value="employer">
            <v-alert v-if="employerFormError" type="error" variant="tonal" density="compact" class="tw:mb-4">
              {{ employerFormError }}
            </v-alert>

            <v-form ref="employerForm" @submit.prevent="submitEmployer">
              <v-row dense>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="employerModel.companyName" label="Company Name" :rules="[required('Company name')]" />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="employerModel.contactPerson" label="Contact Person" :rules="[required('Contact person')]" />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-combobox
                    v-model="employerModel.industryType"
                    label="Industry"
                    :items="industryOptions"
                    :rules="[required('Industry')]"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="employerModel.phoneNumber"
                    label="Phone Number"
                    :rules="[required('Phone number'), isPhoneNumber]"
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="employerModel.hrEmail"
                    label="HR Email"
                    type="email"
                    prepend-inner-icon="mdi-email-outline"
                    :rules="[required('HR email'), isEmail]"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="employerModel.email"
                    label="Login Email"
                    type="email"
                    prepend-inner-icon="mdi-account-outline"
                    :rules="[required('Login email'), isEmail]"
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="employerModel.password"
                    label="Password"
                    :type="showEmployerPassword ? 'text' : 'password'"
                    prepend-inner-icon="mdi-lock-outline"
                    :append-inner-icon="showEmployerPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                    hint="At least 8 characters, with a number"
                    :rules="[required('Password'), isStrongPassword]"
                    @click:append-inner="showEmployerPassword = !showEmployerPassword"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="employerModel.confirmPassword"
                    label="Confirm Password"
                    :type="showEmployerPassword ? 'text' : 'password'"
                    prepend-inner-icon="mdi-lock-check-outline"
                    :rules="[required('Confirm password'), matchesPassword(() => employerModel.password)]"
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-select
                    v-model="employerModel.provinceId"
                    label="Province"
                    :items="provinces"
                    item-title="provinceName"
                    item-value="provinceId"
                    :loading="provincesLoading"
                    :rules="[required('Province')]"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="employerModel.town" label="Town" :rules="[required('Town')]" />
                </v-col>

                <v-col cols="12" sm="4">
                  <v-text-field v-model="employerModel.streetName" label="Street Name" hint="Optional" />
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field v-model="employerModel.suburb" label="Suburb" hint="Optional" />
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field
                    v-model="employerModel.postalCode"
                    label="Postal Code"
                    hint="Optional"
                    maxlength="4"
                    :rules="[isPostalCode]"
                  />
                </v-col>

                <v-col cols="12">
                  <v-checkbox
                    v-model="employerModel.agreeToTerms"
                    :rules="[isChecked('Agreeing to the terms')]"
                    color="primary"
                    density="compact"
                  >
                    <template #label>
                      <span class="tw:text-sm">I agree to the Terms of Service and Privacy Policy</span>
                    </template>
                  </v-checkbox>
                </v-col>
              </v-row>

              <v-btn type="submit" color="primary" size="large" block :loading="employerLoading" class="tw:mt-2">
                Create Employer Account
              </v-btn>
            </v-form>
          </v-window-item>
        </v-window>

        <p class="tw:text-center tw:text-sm tw:mt-6" style="color: rgba(30,27,75,0.65)">
          Already have an account?
          <router-link :to="`/login?role=${tab}`" style="color:#4F46E5; font-weight:600; text-decoration:none">
            Log in
          </router-link>
        </p>
      </v-card-text>
    </v-card>
  </section>
</template>
