<template>
  <div class="pt-20">
    <div class="text-2xl font-black">
      NanoId Generator
    </div>
    <USeparator />
    <div class="pt-5">
      A tiny, secure, URL-friendly, unique string ID generator for JavaScript. Length: 21 chars
    </div>
    <div class="pt-5">
      <div class="font-bold">Comparison with UUID</div>
      <ul class="list-disc pl-5">
        <li>Generation: NanoId has 126 random bits, uuid 122</li>
        <li>Chance of duplication: NanoId one in a billion, uuid on in a 103 trillion</li>
        <li>Length: NanoId 21 symbols instead of 36 with uuid</li>
        <li>Package Size: NanoId 130 bytes instead of 423 bytes with uuid</li>
      </ul>
    </div>
    <div class="pt-8">
      <UFormField label="Length">
        <UInputNumber v-model="nanoidLength" />
      </UFormField>
    </div>
    <div class="h-6" />
    <UButton
      icon="i-material-symbols-settings-outline-rounded"
      @click="generatePassword"
    >
      Generate
    </UButton>
    <div class="h-6" />
    <UFormField :label="`Nano Id`">
      <UTextarea
        v-model="nanoIds"
        class="w-full"
        color="neutral"
        disabled
      />
    </UFormField>
  </div>
</template>

<script setup lang="ts">
import { nanoid } from 'nanoid'

const LOCALSTORAGE_PREFIX = 'nanoid-config'
const { $localStorage } = useNuxtApp()
const localStorage = $localStorage.create(LOCALSTORAGE_PREFIX)
const nanoidLength = ref(21)

const nanoIds = ref('')

onMounted(async () => {
  nanoidLength.value = Number(localStorage.getItem('nanoidLength') || 21)
})

watch(nanoidLength, newValue => localStorage.setItem('nanoidLength', newValue.toString()))

const generatePassword = () => {
  nanoIds.value = nanoid(nanoidLength.value)
}
</script>
