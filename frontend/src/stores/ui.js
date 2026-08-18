import { defineStore } from 'pinia'
import { ref } from 'vue'

// Drives the single global <AppSnackbar> mounted in App.vue.
export const useUiStore = defineStore('ui', () => {
  const snackbar = ref({ show: false, text: '', color: 'success' })

  function notify(text, color = 'success') {
    snackbar.value = { show: true, text, color }
  }

  const success = (text) => notify(text, 'success')
  const error = (text) => notify(text, 'error')
  const info = (text) => notify(text, 'info')

  function closeSnackbar() {
    snackbar.value.show = false
  }

  return { snackbar, success, error, info, closeSnackbar }
})
