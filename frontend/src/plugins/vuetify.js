import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

const jobBoardLight = {
  dark: false,
  colors: {
    background: '#F5F7FB',
    surface: '#FFFFFF',
    primary: '#4F46E5',
    'primary-darken-1': '#4338CA',
    secondary: '#0EA5A4',
    'secondary-darken-1': '#0B8685',
    accent: '#F59E0B',
    error: '#DC2626',
    info: '#0284C7',
    success: '#16A34A',
    warning: '#D97706',
  },
  variables: {
    'border-color': '#E2E8F0',
  },
}

export default createVuetify({
  theme: {
    defaultTheme: 'jobBoardLight',
    themes: { jobBoardLight },
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  defaults: {
    VBtn: { rounded: 'lg' },
    VCard: { rounded: 'lg' },
    VTextField: { variant: 'outlined', density: 'comfortable', color: 'primary' },
    VSelect: { variant: 'outlined', density: 'comfortable', color: 'primary' },
    VCombobox: { variant: 'outlined', density: 'comfortable', color: 'primary' },
    VAutocomplete: { variant: 'outlined', density: 'comfortable', color: 'primary' },
  },
})
