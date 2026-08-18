<script setup>
</script>

<template>
  <section class="tw:flex tw:flex-col tw:items-center tw:justify-center tw:text-center" style="min-height: calc(100vh - 64px - 90px); padding: 56px 16px;">
    <v-avatar color="primary" variant="tonal" size="88" class="tw:mb-6">
      <v-icon icon="mdi-compass-off-outline" size="44" />
    </v-avatar>
    <h1 class="tw:text-3xl tw:font-bold" style="color:#1E1B4B">Page not found</h1>
    <p class="tw:mt-2 tw:max-w-md" style="color: rgba(30,27,75,0.65)">
      The page you're looking for doesn't exist or may have moved.
    </p>
    <v-btn to="/" color="primary" size="large" class="tw:mt-6" prepend-icon="mdi-home-outline">
      Back to Home
    </v-btn>
  </section>
</template>
