<script setup>
// A reusable 3D-tilt card: the mouse position over the card drives a subtle
// perspective rotation, with the inner content lifted on the Z axis. Used
// by feature/stat cards across the public and dashboard pages so the
// "3D" effect has exactly one implementation.
import { ref } from 'vue'

defineProps({
  maxTilt: { type: Number, default: 8 },
})

const el = ref(null)
const rotateX = ref(0)
const rotateY = ref(0)

function handleMouseMove(event, maxTilt) {
  const rect = el.value.getBoundingClientRect()
  const px = (event.clientX - rect.left) / rect.width
  const py = (event.clientY - rect.top) / rect.height
  rotateY.value = (px - 0.5) * maxTilt * 2
  rotateX.value = (0.5 - py) * maxTilt * 2
}

function reset() {
  rotateX.value = 0
  rotateY.value = 0
}
</script>

<template>
  <div
    ref="el"
    class="jb-tilt"
    :style="{
      transform: `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      borderRadius: 'var(--jb-radius-lg)',
    }"
    @mousemove="(e) => handleMouseMove(e, maxTilt)"
    @mouseleave="reset"
  >
    <div class="jb-tilt__inner">
      <slot />
    </div>
  </div>
</template>
