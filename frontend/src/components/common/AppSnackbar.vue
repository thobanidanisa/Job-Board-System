<script setup>
import { useUiStore } from '@/stores/ui'

const ui = useUiStore()
</script>

<template>
  <v-snackbar
    v-model="ui.snackbar.show"
    :color="ui.snackbar.color"
    location="top right"
    timeout="4000"
    rounded="lg"
    elevation="8"
  >
    {{ ui.snackbar.text }}

    <template #actions>
      <v-btn variant="text" icon="mdi-close" size="small" @click="ui.closeSnackbar" />
    </template>
  </v-snackbar>
</template>
