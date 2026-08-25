<script setup>
// Fixed, full-viewport gradient-blob backdrop mounted once in App.vue so
// every route shares the same ambient wash (dashboards included) instead
// of only the pages that used to hand-roll their own blob markup.
</script>

<template>
  <div class="jb-ambient-bg" aria-hidden="true">
    <div
      class="jb-ambient-blob"
      style="width: 620px; height: 620px; top: -220px; left: -160px; background: var(--jb-grad-primary);"
    />
    <div
      class="jb-ambient-blob"
      style="width: 560px; height: 560px; bottom: -200px; right: -160px; background: var(--jb-grad-secondary); animation-delay: -7s;"
    />
    <div
      class="jb-ambient-blob"
      style="width: 420px; height: 420px; top: 42%; left: 58%; background: var(--jb-grad-violet); opacity: 0.22; animation-delay: -13s;"
    />
  </div>
</template>
