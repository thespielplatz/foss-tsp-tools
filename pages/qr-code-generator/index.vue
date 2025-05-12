<template>
  <div class="pt-20">
    <div class="text-2xl font-black">
      QR Coder Generator
    </div>
    <div class="pt-10">
      <UTextarea
        v-model="text"
        class="w-full"
        placeholder="Please enter text here to generate a qr code"
        :rows="8"
      />
    </div>
    <div class="flex justify-center pt-10">
      <!-- eslint-disable vue/no-v-html -->
      <div v-html="qrCode" />
      <!-- eslint-enable vue/no-v-html -->
    </div>
  </div>
</template>

<script setup lang="ts">
import QRCode from 'qrcode-svg'

const qrCode = ref('')
const text = ref('')

watch(text, (newValue) => {
  updateQrCode(newValue)
})

onMounted(async () => {
  updateQrCode('')
})

const updateQrCode = (text: string) => {
  if (text === '') {
    qrCode.value = '<i>Please enter text</i>'
    return
  }
  qrCode.value = new QRCode({
    content: text,
    padding: 2,
    width: 200,
    height: 200,
    color: '#1e4563',
    background: '#FFFFFF',
  }).svg()
}
</script>
