<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useJobsStore } from '@/stores/jobs'
import { useUiStore } from '@/stores/ui'
import JobForm from '@/components/employer/JobForm.vue'

const route = useRoute()
const router = useRouter()
const jobsStore = useJobsStore()
const ui = useUiStore()

const job = ref(null)
const notFound = ref(false)
const pageLoading = ref(true)

const loading = ref(false)
const formError = ref('')

onMounted(async () => {
  try {
    job.value = await jobsStore.getCachedOrFetchJob(route.params.id)
  } catch (err) {
    if (err.status === 404) {
      notFound.value = true
    } else {
      ui.error(err.message || 'Could not load this job. Please try again.')
    }
  } finally {
    pageLoading.value = false
  }
})

async function handleSubmit(payload) {
  formError.value = ''
  loading.value = true
  try {
    await jobsStore.updateJob(route.params.id, payload)
    ui.success('Job updated successfully!')
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
    <div v-if="pageLoading" class="tw:flex tw:justify-center tw:py-16">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <div v-else-if="notFound" class="jb-card jb-card--glass tw:pa-10 tw:text-center">
      <v-icon icon="mdi-briefcase-remove-outline" size="48" color="primary" class="tw:mb-4" />
      <div class="tw:font-semibold tw:text-lg" style="color:#1E1B4B">Job not found</div>
      <p class="tw:text-sm tw:mt-2 tw:mb-6" style="color: rgba(30,27,75,0.6)">
        This job doesn't exist or isn't one of yours.
      </p>
      <v-btn to="/employer/jobs" color="primary" class="jb-btn-gradient">Back to My Jobs</v-btn>
    </div>

    <template v-else>
      <div class="tw:mb-2">
        <h1 class="tw:text-2xl tw:font-bold" style="color:#1E1B4B">Edit Job</h1>
        <p class="tw:text-sm tw:mt-1" style="color: rgba(30,27,75,0.6)">
          Update the details below. Fields marked <span class="tw:font-semibold">*</span> are required.
        </p>
      </div>

      <v-alert v-if="formError" type="error" variant="tonal" density="compact" class="tw:my-6">
        {{ formError }}
      </v-alert>

      <JobForm
        class="tw:mt-6"
        :initial="job"
        :loading="loading"
        submit-label="Save Changes"
        cancel-to="/employer/jobs"
        @submit="handleSubmit"
      />
    </template>
  </v-container>
</template>
