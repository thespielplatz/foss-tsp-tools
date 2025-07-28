<template>
  <div class="pt-20">
    <div class="text-2xl font-black">
      LNURL Decoder
    </div>
    <div class="pt-10">
      <UTextarea
        v-model="text"
        class="w-full"
        placeholder="Please enter the lnurl for decoding"
        :rows="8"
      />
    </div>

    <div class="flex justify-center pt-10">
      <!-- eslint-disable vue/no-v-html -->
      <div v-html="result" />
      <!-- eslint-enable vue/no-v-html -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { bech32 } from '@scure/base'

const result = ref('')
const text = ref('')

watch(text, (newValue) => {
  updateResult(newValue)
})

onMounted(async () => {
  updateResult('')
})

const updateResult = (text: string) => {
  text = text.trim()
  if (text === '') {
    result.value = '<i>Please lnurl</i>'
    return
  }

  const lower = text.toLowerCase()

  try {
    const { words } = bech32.decode(lower as `${string}1${string}`, 2000)
    const data = bech32.fromWords(words)
    const decodedLnUrl = new TextDecoder().decode(Uint8Array.from(data))

    result.value = decodedLnUrl
  } catch (error) {
    result.value = `Error decoding lnurl: ${error}`
  }
}
</script>
