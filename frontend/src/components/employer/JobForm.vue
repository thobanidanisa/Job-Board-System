<script setup>
// Shared by PostJobPage.vue (create) and EditJobPage.vue (edit) so the
// ~250 lines of fields + live preview only exist once. In edit mode pass
// the existing job via `initial`; this component owns client-side
// validation and assembling the payload, the parent owns the actual API
// call, loading state, and error display.
import { computed, onMounted, ref } from 'vue'
import { useUiStore } from '@/stores/ui'
import lookupService from '@/services/lookupService'
import { required, isOnOrAfter, isNonNegativeNumber } from '@/utils/validators'
import { REQUIRED_DOCUMENT_TYPES } from '@/utils/constants'

const props = defineProps({
  initial: { type: Object, default: null },
  loading: { type: Boolean, default: false },
  submitLabel: { type: String, default: 'Post Job' },
  cancelTo: { type: String, default: '/employer/dashboard' },
})

const emit = defineEmits(['submit'])

const ui = useUiStore()
const form = ref(null)

const categories = ref([])
const provinces = ref([])
const lookupsLoading = ref(true)

// Postgres DATE columns come back as full ISO timestamps (see jobModel.js
// notes on the app-wide timezone convention); a plain .slice(0,10) can be
// a day off, so this goes through Date's *local* getters the same way
// the rest of the app's date displays already do (toLocaleDateString).
function toDateInputValue(value) {
  if (!value) return ''
  const d = new Date(value)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function buildModelFrom(source) {
  return {
    jobTitle: source?.jobTitle ?? '',
    department: source?.department ?? '',
    categoryId: source?.categoryId ?? null,
    description: source?.description ?? '',
    salaryMin: source?.salaryMin ?? null,
    salaryMax: source?.salaryMax ?? null,
    provinceId: source?.provinceId ?? null,
    town: source?.town ?? '',
    applicationStartDate: toDateInputValue(source?.applicationStartDate),
    applicationEndDate: toDateInputValue(source?.applicationEndDate),
    skillTags: source?.skillTags ? [...source.skillTags] : [],
    requiredDocuments: source?.requiredDocuments ? [...source.requiredDocuments] : [],
    status: source?.status ?? 'Open',
  }
}

const model = ref(buildModelFrom(props.initial))

// A brand-new job can only start Open or Draft; editing an existing one
// also allows setting Closed/Cancelled directly (the quick actions on My
// Jobs cover the common case faster, this just keeps the form honest
// about the full range of values status can actually hold).
const statusOptions = computed(() => {
  const base = [
    { title: 'Open (published)', value: 'Open' },
    { title: 'Draft (not published)', value: 'Draft' },
  ]
  if (props.initial) {
    base.push({ title: 'Closed', value: 'Closed' }, { title: 'Cancelled', value: 'Cancelled' })
  }
  return base
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

async function handleSubmit() {
  const { valid } = await form.value.validate()
  if (!valid) return
  emit('submit', { ...model.value })
}

defineExpose({ validate: () => form.value?.validate() })
</script>

<template>
  <v-form ref="form" @submit.prevent="handleSubmit">
    <v-row>
      <v-col cols="12" lg="7">
        <div class="jb-card jb-card--glass tw:pa-6 tw:md:pa-7 tw:mb-5">
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
              <v-select v-model="model.status" label="Publish Status" :items="statusOptions" />
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

        <div class="jb-card jb-card--glass tw:pa-6 tw:md:pa-7 tw:mb-5">
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

        <div class="jb-card jb-card--glass tw:pa-6 tw:md:pa-7 tw:mb-5">
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

        <div class="jb-card jb-card--glass tw:pa-6 tw:md:pa-7 tw:mb-6">
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
          <v-btn type="button" color="primary" size="large" class="jb-btn-gradient" :loading="loading" @click="handleSubmit">
            {{ submitLabel }}
          </v-btn>
          <v-btn :to="cancelTo" size="large" variant="outlined">Cancel</v-btn>
        </div>
      </v-col>

      <v-col cols="12" lg="5">
        <div class="jb-card jb-card--glass tw:pa-6 tw:lg:sticky tw:lg:top-24">
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
            {{ model.status }}
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
</template>
