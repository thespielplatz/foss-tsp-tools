<template>
  <div ref="parent" class="relative inline-block" @mouseenter="showTooltip" @mouseleave="hideTooltip">
    <slot></slot>
    <div v-if="visible" class="absolute left-1/2 -translate-x-1/2 w-28
    bg-white text-black text-sm 
    border rounded px-2 py-1 mt-1 z-50" :style="{ top: tooltipPosition + 'px' }">
      {{ text }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface TooltipProps {
  text: string
}

const props = defineProps<TooltipProps>()

const visible = ref(false)
const tooltipPosition = ref(0)
const parent = ref()

const showTooltip = () => {
  tooltipPosition.value = -(parent.value.offsetHeight + 55) // Position tooltip above the element
  visible.value = true
}

const hideTooltip = () => {
  visible.value = false
}
</script>

