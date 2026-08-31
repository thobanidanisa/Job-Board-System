import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import jobService from '@/services/jobService'

export const useJobsStore = defineStore('jobs', () => {
  const myJobs = ref([])
  const loaded = ref(false)
  const loading = ref(false)

  const activeCount = computed(() => myJobs.value.filter((j) => j.status === 'Open').length)

  async function fetchMyJobs() {
    loading.value = true
    try {
      const { data } = await jobService.getMyJobs()
      myJobs.value = data.data.jobs
      loaded.value = true
    } finally {
      loading.value = false
    }
  }

  async function postJob(payload) {
    const { data } = await jobService.createJob(payload)
    const job = data.data.job
    myJobs.value = [job, ...myJobs.value]
    return job
  }

  async function updateJob(jobId, payload) {
    const { data } = await jobService.updateJob(jobId, payload)
    const job = data.data.job
    const index = myJobs.value.findIndex((j) => j.jobId === jobId)
    if (index !== -1) {
      myJobs.value.splice(index, 1, job)
    } else {
      myJobs.value = [job, ...myJobs.value]
    }
    return job
  }

  // Edit pages land here on a direct URL/refresh where myJobs may not be
  // loaded yet, so this checks the local cache first and only hits the
  // API if the job isn't already in it.
  async function getCachedOrFetchJob(jobId) {
    const cached = myJobs.value.find((j) => j.jobId === jobId)
    if (cached) return cached

    const { data } = await jobService.getJob(jobId)
    return data.data.job
  }

  return { myJobs, loaded, loading, activeCount, fetchMyJobs, postJob, updateJob, getCachedOrFetchJob }
})
