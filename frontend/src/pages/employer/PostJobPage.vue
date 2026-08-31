<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useJobsStore } from '@/stores/jobs'
import { useUiStore } from '@/stores/ui'
import JobForm from '@/components/employer/JobForm.vue'

const router = useRouter()
const jobsStore = useJobsStore()
const ui = useUiStore()

const loading = ref(false)
const formError = ref('')

async function handleSubmit(payload) {
  formError.value = ''
  loading.value = true
  try {
    await jobsStore.postJob(payload)
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

    <JobForm
      class="tw:mt-6"
      :loading="loading"
      submit-label="Post Job"
      cancel-to="/employer/dashboard"
      @submit="handleSubmit"
    />
  </v-container>
</template>
