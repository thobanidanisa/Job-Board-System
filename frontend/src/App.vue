<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AmbientBackground from '@/components/common/AmbientBackground.vue'
import PublicLayout from '@/layouts/PublicLayout.vue'
import ClientLayout from '@/layouts/ClientLayout.vue'
import EmployerLayout from '@/layouts/EmployerLayout.vue'

const route = useRoute()

const layouts = {
  public: PublicLayout,
  client: ClientLayout,
  employer: EmployerLayout,
}

const activeLayout = computed(() => layouts[route.meta.layout] || PublicLayout)
</script>

<template>
  <AmbientBackground />
  <component :is="activeLayout" />
</template>
