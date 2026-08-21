<script setup>
import { computed, onMounted, ref } from 'vue'
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

const selectedCategoryName = computed(
  () => categories.value.find((c) => c.categoryId === model.value.categoryId)?.categoryName,
)
const selectedProvinceName = computed(
  () => provinces.value.find((p) => p.provinceId === model.value.provinceId)?.provinceName,
)

const salaryRangeText = computed(() => {
  const { salaryMin, salaryMax } = model.value
  const fmt = (n) => Number(n).toLocaleString('en-ZA')
  if (salaryMin && salaryMax) return `R${fmt(salaryMin)} - R${fmt(salaryMax)} / month`
  if (salaryMin) return `From R${fmt(salaryMin)} / month`
  if (salaryMax) return `Up to R${fmt(salaryMax)} / month`
  return 'Salary not specified'
})

const applicationWindowText = computed(() => {
  const { applicationStartDate, applicationEndDate } = model.value
  const fmt = (d) => new Date(d).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })
  if (applicationStartDate && applicationEndDate) return `${fmt(applicationStartDate)} - ${fmt(applicationEndDate)}`
  if (applicationStartDate) return `Opens ${fmt(applicationStartDate)}`
  if (applicationEndDate) return `Closes ${fmt(applicationEndDate)}`
  return 'Application window not set'
})

const hasPreviewContent = computed(() => Boolean(model.value.jobTitle || model.value.description))

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
  <v-container class="tw:py-10" style="max-width: 1180px">
    <div class="tw:mb-2">
      <h1 class="tw:text-2xl tw:font-bold" style="color:#1E1B4B">Post a New Job</h1>
      <p class="tw:text-sm tw:mt-1" style="color: rgba(30,27,75,0.6)">
        Fill in the details below to publish a job opening. Fields marked
        <span class="tw:font-semibold">*</span> are required.
      </p>
    </div>

    <v-alert v-if="formError" type="error" variant="tonal" density="compact" class="tw:my-6">
      {{ formError }}
    </v-alert>

    <v-form ref="form" class="tw:mt-6" @submit.prevent="submit">
      <v-row>
        <v-col cols="12" lg="7">
          <div class="jb-card tw:pa-6 tw:md:pa-7 tw:mb-5">
            <div class="tw:flex tw:items-center tw:gap-3 tw:mb-5">
              <div class="jb-badge jb-badge--primary" style="width: 36px; height: 36px;">
                <v-icon icon="mdi-briefcase-edit-outline" size="18" />
              </div>
              <span class="tw:font-semibold tw:text-lg" style="color:#1E1B4B">Job Details</span>
            </div>
            <v-row>
              <v-col cols="12" sm="7">
                <v-text-field v-model="model.jobTitle" label="Job Title *" :rules="[required('Job title')]" />
              </v-col>
              <v-col cols="12" sm="5">
                <v-text-field v-model="model.department" label="Department *" :rules="[required('Department')]" />
              </v-col>

              <v-col cols="12" sm="6">
                <v-select
                  v-model="model.categoryId"
                  label="Category *"
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
                  label="Job Description *"
                  rows="4"
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

          <div class="jb-card tw:pa-6 tw:md:pa-7 tw:mb-5">
            <div class="tw:flex tw:items-center tw:gap-3 tw:mb-5">
              <div class="jb-badge jb-badge--secondary" style="width: 36px; height: 36px;">
                <v-icon icon="mdi-map-marker-outline" size="18" />
              </div>
              <span class="tw:font-semibold tw:text-lg" style="color:#1E1B4B">Location &amp; Salary</span>
            </div>
            <v-row>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="model.provinceId"
                  label="Province *"
                  :items="provinces"
                  item-title="provinceName"
                  item-value="provinceId"
                  :loading="lookupsLoading"
                  :rules="[required('Province')]"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="model.town" label="Town *" :rules="[required('Town')]" />
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

          <div class="jb-card tw:pa-6 tw:md:pa-7 tw:mb-5">
            <div class="tw:flex tw:items-center tw:gap-3 tw:mb-5">
              <div class="jb-badge jb-badge--accent" style="width: 36px; height: 36px;">
                <v-icon icon="mdi-calendar-range-outline" size="18" />
              </div>
              <span class="tw:font-semibold tw:text-lg" style="color:#1E1B4B">Application Window</span>
            </div>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="model.applicationStartDate"
                  label="Application Start Date *"
                  type="date"
                  :rules="[required('Application start date')]"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="model.applicationEndDate"
                  label="Application End Date *"
                  type="date"
                  :rules="[required('Application end date'), isOnOrAfter(() => model.applicationStartDate, 'Application end date')]"
                />
              </v-col>
            </v-row>
          </div>

          <div class="jb-card tw:pa-6 tw:md:pa-7 tw:mb-6">
            <div class="tw:flex tw:items-center tw:gap-3 tw:mb-1">
              <div class="jb-badge jb-badge--secondary" style="width: 36px; height: 36px;">
                <v-icon icon="mdi-file-check-outline" size="18" />
              </div>
              <span class="tw:font-semibold tw:text-lg" style="color:#1E1B4B">Required Documents</span>
            </div>
            <p class="tw:text-sm tw:mb-4 tw:ml-1" style="color: rgba(30,27,75,0.6)">
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
            <v-btn type="button" color="primary" size="large" class="jb-btn-gradient" :loading="loading" @click="submit">
              Post Job
            </v-btn>
            <v-btn to="/employer/dashboard" size="large" variant="outlined">Cancel</v-btn>
          </div>
        </v-col>

        <v-col cols="12" lg="5">
          <div class="jb-card tw:pa-6 tw:lg:sticky tw:lg:top-24">
            <div class="tw:flex tw:items-center tw:gap-2 tw:mb-5">
              <v-icon icon="mdi-eye-outline" color="primary" />
              <span class="tw:font-semibold tw:text-lg" style="color:#1E1B4B">Live Preview</span>
            </div>

            <div class="tw:mb-4">
              <div
                class="tw:text-xl tw:font-bold"
                :style="{ color: model.jobTitle ? '#1E1B4B' : 'rgba(30,27,75,0.35)' }"
              >
                {{ model.jobTitle || 'Your job title' }}
              </div>
              <div class="tw:text-sm tw:mt-1" style="color: rgba(30,27,75,0.6)">
                {{ model.department || 'Department' }}
                <template v-if="selectedCategoryName"> &middot; {{ selectedCategoryName }}</template>
              </div>
            </div>

            <v-chip :color="model.status === 'Open' ? 'success' : undefined" size="small" variant="tonal" class="tw:mb-5">
              {{ model.status === 'Open' ? 'Open' : 'Draft' }}
            </v-chip>

            <v-divider class="tw:mb-5" />

            <div class="tw:flex tw:items-start tw:gap-3 tw:mb-3">
              <v-icon icon="mdi-map-marker-outline" size="18" color="primary" class="tw:mt-0.5" />
              <span class="tw:text-sm" style="color: rgba(30,27,75,0.75)">
                {{ model.town || 'Town' }}<template v-if="selectedProvinceName">, {{ selectedProvinceName }}</template>
              </span>
            </div>

            <div class="tw:flex tw:items-start tw:gap-3 tw:mb-3">
              <v-icon icon="mdi-cash-multiple" size="18" color="primary" class="tw:mt-0.5" />
              <span class="tw:text-sm" style="color: rgba(30,27,75,0.75)">{{ salaryRangeText }}</span>
            </div>

            <div class="tw:flex tw:items-start tw:gap-3 tw:mb-1">
              <v-icon icon="mdi-calendar-range-outline" size="18" color="primary" class="tw:mt-0.5" />
              <span class="tw:text-sm" style="color: rgba(30,27,75,0.75)">{{ applicationWindowText }}</span>
            </div>

            <template v-if="model.skillTags.length">
              <div
                class="tw:text-xs tw:font-semibold tw:mb-2 tw:mt-5"
                style="color: rgba(30,27,75,0.5); text-transform: uppercase; letter-spacing: 0.04em;"
              >
                Skills
              </div>
              <div class="tw:flex tw:flex-wrap tw:gap-1">
                <v-chip v-for="tag in model.skillTags" :key="tag" size="x-small" variant="tonal">{{ tag }}</v-chip>
              </div>
            </template>

            <template v-if="model.requiredDocuments.length">
              <div
                class="tw:text-xs tw:font-semibold tw:mb-2 tw:mt-5"
                style="color: rgba(30,27,75,0.5); text-transform: uppercase; letter-spacing: 0.04em;"
              >
                Required Documents
              </div>
              <div class="tw:flex tw:flex-wrap tw:gap-1">
                <v-chip v-for="doc in model.requiredDocuments" :key="doc" size="x-small" variant="tonal">{{ doc }}</v-chip>
              </div>
            </template>

            <p v-if="!hasPreviewContent" class="tw:text-sm tw:mt-5" style="color: rgba(30,27,75,0.45)">
              Start filling in the form to see a live preview of your job posting.
            </p>
          </div>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>
