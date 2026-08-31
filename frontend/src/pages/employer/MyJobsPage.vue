<script setup>
import { computed, onMounted, ref } from 'vue'
import { useJobsStore } from '@/stores/jobs'
import { useUiStore } from '@/stores/ui'
import lookupService from '@/services/lookupService'

const jobsStore = useJobsStore()
const ui = useUiStore()

const provinces = ref([])
const updatingJobId = ref(null)
const jobPendingCancel = ref(null)

const provinceName = (provinceId) =>
  provinces.value.find((p) => p.provinceId === provinceId)?.provinceName || ''

const statusColor = (status) => ({
  Open: 'success',
  Draft: 'default',
  Closed: 'warning',
  Cancelled: 'error',
}[status] || 'default')

const formatDate = (value) => {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' })
}

// Which one-click status transitions make sense from the job's current
// status. "Cancel" is handled separately below since it goes through a
// confirm dialog rather than being one-click like these.
function statusActions(job) {
  const actions = []
  if (job.status === 'Draft') actions.push({ label: 'Publish', icon: 'mdi-publish', status: 'Open' })
  if (job.status === 'Open') actions.push({ label: 'Close', icon: 'mdi-lock-outline', status: 'Closed' })
  if (job.status === 'Closed' || job.status === 'Cancelled') {
    actions.push({ label: 'Reopen', icon: 'mdi-lock-open-variant-outline', status: 'Open' })
  }
  return actions
}

const sortedJobs = computed(() => jobsStore.myJobs)

const cancelDialogOpen = computed({
  get: () => Boolean(jobPendingCancel.value),
  set: (value) => {
    if (!value) jobPendingCancel.value = null
  },
})

onMounted(async () => {
  try {
    const [, provincesRes] = await Promise.all([
      jobsStore.fetchMyJobs(),
      lookupService.getProvinces(),
    ])
    provinces.value = provincesRes.data.data.provinces
  } catch {
    ui.error('Could not load your jobs. Please refresh the page.')
  }
})

async function changeStatus(job, status) {
  updatingJobId.value = job.jobId
  try {
    await jobsStore.updateJob(job.jobId, { status })
    ui.success(`"${job.jobTitle}" marked as ${status}.`)
  } catch (err) {
    ui.error(err.message || 'Could not update the job. Please try again.')
  } finally {
    updatingJobId.value = null
  }
}

async function confirmCancel() {
  const job = jobPendingCancel.value
  jobPendingCancel.value = null
  if (job) await changeStatus(job, 'Cancelled')
}
</script>

<template>
  <v-container class="tw:py-10" style="max-width: 1000px">
    <div class="tw:flex tw:flex-col tw:sm:flex-row tw:sm:items-center tw:sm:justify-between tw:gap-4 tw:mb-8">
      <div>
        <h1 class="tw:text-2xl tw:font-bold" style="color:#1E1B4B">My Jobs</h1>
        <p class="tw:text-sm tw:mt-1" style="color: rgba(30,27,75,0.6)">
          Every job you've posted, and its current status.
        </p>
      </div>
      <v-btn to="/employer/jobs/new" color="primary" class="jb-btn-gradient" prepend-icon="mdi-briefcase-plus-outline">
        Post a Job
      </v-btn>
    </div>

    <div v-if="jobsStore.loading" class="tw:flex tw:justify-center tw:py-16">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <div v-else-if="sortedJobs.length === 0" class="jb-card jb-card--glass tw:pa-10 tw:text-center">
      <v-icon icon="mdi-briefcase-search-outline" size="48" color="primary" class="tw:mb-4" />
      <div class="tw:font-semibold tw:text-lg" style="color:#1E1B4B">No jobs posted yet</div>
      <p class="tw:text-sm tw:mt-2 tw:mb-6" style="color: rgba(30,27,75,0.6)">
        Post your first job to start receiving applications.
      </p>
      <v-btn to="/employer/jobs/new" color="primary" class="jb-btn-gradient">Post a Job</v-btn>
    </div>

    <v-row v-else>
      <v-col v-for="job in sortedJobs" :key="job.jobId" cols="12">
        <div class="jb-card jb-card--glass jb-card--hoverable tw:pa-6">
          <div class="tw:flex tw:flex-col tw:sm:flex-row tw:sm:items-start tw:sm:justify-between tw:gap-3">
            <div>
              <div class="tw:flex tw:items-center tw:gap-3 tw:flex-wrap">
                <span class="tw:font-semibold tw:text-lg" style="color:#1E1B4B">{{ job.jobTitle }}</span>
                <v-chip :color="statusColor(job.status)" size="small" variant="tonal">{{ job.status }}</v-chip>
              </div>
              <div class="tw:text-sm tw:mt-1" style="color: rgba(30,27,75,0.6)">
                {{ job.department }} &middot; {{ job.categoryName }} &middot; {{ job.town }}, {{ provinceName(job.provinceId) }}
              </div>
              <div v-if="job.skillTags?.length" class="tw:flex tw:flex-wrap tw:gap-1 tw:mt-3">
                <v-chip v-for="tag in job.skillTags" :key="tag" size="x-small" variant="tonal">{{ tag }}</v-chip>
              </div>
            </div>

            <div class="tw:flex tw:items-start tw:gap-2">
              <div class="tw:text-sm tw:text-right" style="color: rgba(30,27,75,0.6); white-space: nowrap;">
                <div>Posted {{ formatDate(job.createdAt) }}</div>
                <div>Closes {{ formatDate(job.applicationEndDate) }}</div>
              </div>

              <v-menu>
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon="mdi-dots-vertical"
                    variant="text"
                    size="small"
                    :loading="updatingJobId === job.jobId"
                  />
                </template>
                <v-list density="compact">
                  <v-list-item :to="`/employer/jobs/${job.jobId}/edit`" prepend-icon="mdi-pencil-outline" title="Edit" />
                  <v-list-item
                    v-for="action in statusActions(job)"
                    :key="action.status"
                    :prepend-icon="action.icon"
                    :title="action.label"
                    @click="changeStatus(job, action.status)"
                  />
                  <v-list-item
                    v-if="job.status !== 'Cancelled'"
                    prepend-icon="mdi-close-circle-outline"
                    title="Cancel"
                    base-color="error"
                    @click="jobPendingCancel = job"
                  />
                </v-list>
              </v-menu>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-dialog v-model="cancelDialogOpen" max-width="420">
      <v-card class="tw:pa-2" rounded="lg">
        <v-card-title class="tw:font-semibold">Cancel this job?</v-card-title>
        <v-card-text style="color: rgba(30,27,75,0.7)">
          "{{ jobPendingCancel?.jobTitle }}" will be marked as Cancelled and won't accept new applications. You can
          reopen it later from this menu.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="cancelDialogOpen = false">Keep Job</v-btn>
          <v-btn color="error" variant="flat" @click="confirmCancel">Cancel Job</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
