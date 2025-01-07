<template>
  <dialog
    ref="modal"
    :class="[
      'modal-overlay fixed bg-white rounded-lg shadow-lg z-50 p-0',
      size === 'small' ? 'w-1/4'
      : size === 'large' ? 'w-2/3 h-2/3' : 'w-[50vw] h-[50vh]',
      'md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2',
      'w-full h-full top-0 left-0 transform-none rounded-none md:w-auto md:h-auto',
    ]"
  >
    <div class="relative w-full h-full p-5 font-poppins">
      <b-icon-x-circle-fill
        class="
        absolute top-3 right-3 text-xl
        text-black hover:text-accent
        cursor-pointer
      "
        @click="closeModal"
      />
      <div class="font-medium text-4xl pb-4">
        <slot name="header" />
      </div>
      <slot />
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps({
  size: {
    type: String as PropType<'medium' | 'small' | 'large'>,
    default: 'medium',
  },
})

const modal = ref<HTMLDialogElement | null>(null)

const openModal = () => {
  if (modal.value) {
    modal.value.showModal()
  }
}

const closeModal = () => {
  if (modal.value) {
    modal.value.close()
  }
}

// Expose the methods to parent component
defineExpose({
  openModal,
  closeModal,
})
</script>
