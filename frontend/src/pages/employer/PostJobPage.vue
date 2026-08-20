<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useJobsStore } from '@/stores/jobs'
import { useUiStore } from '@/stores/ui'
import lookupService from '@/services/lookupService'
import { required, isOnOrAfter, isNonNegativeNumber } from '@/utils/validators'

const REQUIRED_DOCUMENT_TYPES = [
  'CV',
  'ID Copy',
  'Qualification Certificate',
  'Cover Letter',
  'Proof of Address',
]

const router = useRouter()
const jobsStore = useJobsStore()
const ui = useUiStore()

const form = ref(null)
const loading = ref(false)
const formError = ref('')

const categories = ref([])
const provinces = ref([])
const lookupsLoading = ref(true)

const model = ref({
  jobTitle: '',
  department: '',
  categoryId: null,
  description: '',
  salaryMin: null,
  salaryMax: null,
  provinceId: null,
  town: '',
  applicationStartDate: '',
  applicationEndDate: '',
  skillTags: [],
  requiredDocuments: [],
  status: 'Open',
})

const salaryMaxRule = (value) => {
  if (!value || !model.value.salaryMin) return true
  return Number(value) >= Number(model.value.salaryMin) || 'Maximum salary must be at least the minimum salary'
}

onMounted(async () => {
  try {
    const [categoriesRes, provincesRes] = await Promise.all([
      lookupService.getCategories(),
      lookupService.getProvinces(),
    ])
    categories.value = categoriesRes.data.data.categories
    provinces.value = provincesRes.data.data.provinces
  } catch {
    ui.error('Could not load form options. Please refresh the page.')
  } finally {
    lookupsLoading.value = false
  }
})

async function submit() {
  formError.value = ''
  const { valid } = await form.value.validate()
  if (!valid) return

  loading.value = true
  try {
    await jobsStore.postJob(model.value)
    ui.success('Job posted successfully!')
    router.push('/employer/jobs')
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
  <v-container class="tw:py-10" style="max-width: 860px">
    <div class="tw:mb-8">
      <h1 class="tw:text-2xl tw:font-bold" style="color:#1E1B4B">Post a New Job</h1>
      <p class="tw:text-sm tw:mt-1" style="color: rgba(30,27,75,0.6)">
        Fill in the details below to publish a job opening.
      </p>
    </div>

    <v-alert v-if="formError" type="error" variant="tonal" density="compact" class="tw:mb-6">
      {{ formError }}
    </v-alert>

    <v-form ref="form" @submit.prevent="submit">
      <div class="jb-card tw:pa-6 tw:md:pa-8 tw:mb-6">
        <div class="tw:font-semibold tw:text-lg tw:mb-5" style="color:#1E1B4B">Job Details</div>
        <v-row>
          <v-col cols="12" sm="7">
            <v-text-field v-model="model.jobTitle" label="Job Title" :rules="[required('Job title')]" />
          </v-col>
          <v-col cols="12" sm="5">
            <v-text-field v-model="model.department" label="Department" :rules="[required('Department')]" />
          </v-col>

          <v-col cols="12" sm="6">
            <v-select
              v-model="model.categoryId"
              label="Category"
              :items="categories"
              item-title="categoryName"
              item-value="categoryId"
              :loading="lookupsLoading"
              :rules="[required('Category')]"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-select
              v-model="model.status"
              label="Publish Status"
              :items="[
                { title: 'Publish now', value: 'Open' },
                { title: 'Save as draft', value: 'Draft' },
              ]"
            />
          </v-col>

          <v-col cols="12">
            <v-textarea
              v-model="model.description"
              label="Job Description"
              rows="5"
              :rules="[required('Description')]"
            />
          </v-col>

          <v-col cols="12">
            <v-combobox
              v-model="model.skillTags"
              label="Skill Tags"
              hint="Type a skill and press Enter"
              persistent-hint
              multiple
              chips
              closable-chips
            />
          </v-col>
        </v-row>
      </div>

      <div class="jb-card tw:pa-6 tw:md:pa-8 tw:mb-6">
        <div class="tw:font-semibold tw:text-lg tw:mb-5" style="color:#1E1B4B">Location &amp; Salary</div>
        <v-row>
          <v-col cols="12" sm="6">
            <v-select
              v-model="model.provinceId"
              label="Province"
              :items="provinces"
              item-title="provinceName"
              item-value="provinceId"
              :loading="lookupsLoading"
              :rules="[required('Province')]"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field v-model="model.town" label="Town" :rules="[required('Town')]" />
          </v-col>

          <v-col cols="12" sm="6">
            <v-text-field
              v-model="model.salaryMin"
              label="Minimum Salary (optional)"
              type="number"
              min="0"
              prefix="R"
              :rules="[isNonNegativeNumber]"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="model.salaryMax"
              label="Maximum Salary (optional)"
              type="number"
              min="0"
              prefix="R"
              :rules="[isNonNegativeNumber, salaryMaxRule]"
            />
          </v-col>
        </v-row>
      </div>

      <div class="jb-card tw:pa-6 tw:md:pa-8 tw:mb-6">
        <div class="tw:font-semibold tw:text-lg tw:mb-5" style="color:#1E1B4B">Application Window</div>
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="model.applicationStartDate"
              label="Application Start Date"
              type="date"
              :rules="[required('Application start date')]"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="model.applicationEndDate"
              label="Application End Date"
              type="date"
              :rules="[required('Application end date'), isOnOrAfter(() => model.applicationStartDate, 'Application end date')]"
            />
          </v-col>
        </v-row>
      </div>

      <div class="jb-card tw:pa-6 tw:md:pa-8 tw:mb-8">
        <div class="tw:font-semibold tw:text-lg tw:mb-1" style="color:#1E1B4B">Required Documents</div>
        <p class="tw:text-sm tw:mb-4" style="color: rgba(30,27,75,0.6)">
          Choose what applicants must submit with their application.
        </p>
        <v-select
          v-model="model.requiredDocuments"
          :items="REQUIRED_DOCUMENT_TYPES"
          multiple
          chips
          closable-chips
          label="Required Documents (optional)"
        />
      </div>

      <div class="tw:flex tw:flex-wrap tw:gap-3">
        <v-btn type="submit" color="primary" size="large" class="jb-btn-gradient" :loading="loading">
          Post Job
        </v-btn>
        <v-btn to="/employer/dashboard" size="large" variant="outlined">Cancel</v-btn>
      </div>
    </v-form>
  </v-container>
</template>
