<script setup>
// A reusable 3D-tilt card: the mouse position over the card drives a subtle
// perspective rotation, with the inner content lifted on the Z axis. Used
// by feature/stat cards across the public and dashboard pages so the
// "3D" effect has exactly one implementation.
//
// `baseTiltX`/`baseTiltY` give the card a persistent resting tilt (rather
// than only reacting on hover) so it still reads as "3D" in a static
// screenshot, not just during interaction.
import { computed, ref } from 'vue'

const props = defineProps({
  maxTilt: { type: Number, default: 8 },
  baseTiltX: { type: Number, default: 0 },
  baseTiltY: { type: Number, default: 0 },
  glow: { type: String, default: 'none' }, // 'none' | 'primary' | 'secondary'
})

const el = ref(null)
const hoverX = ref(0)
const hoverY = ref(0)
const hovering = ref(false)

const rotateX = computed(() => props.baseTiltX + hoverX.value)
const rotateY = computed(() => props.baseTiltY + hoverY.value)

const glowClass = computed(() => (props.glow !== 'none' && hovering.value ? `jb-tilt--glow-${props.glow}` : ''))

function handleMouseMove(event) {
  const rect = el.value.getBoundingClientRect()
  const px = (event.clientX - rect.left) / rect.width
  const py = (event.clientY - rect.top) / rect.height
  hoverY.value = (px - 0.5) * props.maxTilt * 2
  hoverX.value = (0.5 - py) * props.maxTilt * 2
}

function handleEnter() {
  hovering.value = true
}

function reset() {
  hoverX.value = 0
  hoverY.value = 0
  hovering.value = false
}
</script>

<template>
  <div
    ref="el"
    class="jb-tilt"
    :class="glowClass"
    :style="{
      transform: `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      borderRadius: 'var(--jb-radius-lg)',
    }"
    @mouseenter="handleEnter"
    @mousemove="handleMouseMove"
    @mouseleave="reset"
  >
    <div class="jb-tilt__inner">
      <slot />
    </div>
  </div>
</template>
