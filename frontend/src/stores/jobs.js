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

  return { myJobs, loaded, loading, activeCount, fetchMyJobs, postJob }
})
