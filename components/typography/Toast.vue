<template>
  <div
    v-if="visible"
    :class="[
      'fixed top-5 right-5 max-w-sm px-2 py-1 text-sm rounded shadow-lg transition-opacity duration-1000',
      fadeOut ? 'opacity-0' : 'opacity-100',
      styleClass,
    ]"
    role="alert"
    @click="hideToast"
  >
    <div class="flex gap-2 items-center justify-normal">
      <div class="hover:text-gray-600 hover:cursor-pointer">
        <slot />
      </div>
      <button
        class="text-gray-400 hover:text-gray-600"
      >
        &times;
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  state?: 'normal' | 'success'
  autoHide?: number
}>()

const visible = ref(true)
const fadeOut = ref(false)

let autoHideTimeout: ReturnType<typeof setTimeout> | null = null

const styleClass = computed(() => {
  switch (props.state) {
    case 'success':
      return 'border border-2 border-green-500 text-black'
    case 'normal':
    default:
      return 'border border-2 border-gray-500 text-black'
  }
})

const hideToast = () => {
  fadeOut.value = true
  setTimeout(() => {
    visible.value = false
  }, 1000)
}

onMounted(() => {
  if (props.autoHide) {
    autoHideTimeout = setTimeout(() => {
      hideToast()
    }, props.autoHide)
  }
})

onUnmounted(() => {
  if (autoHideTimeout) {
    clearTimeout(autoHideTimeout)
  }
})
</script>
