<template>
  <div class="pt-20">
    <div class="text-2xl font-black">
      Password Generator
    </div>
    <USeparator />
    <div class="pt-5 flex gap-2">
      <div class="flex flex-col gap-2">
        <UFormField label="Length">
          <UInputNumber v-model="passwordLength" />
        </UFormField>
        <UFormField label="Include Symbols">
          <UInput v-model="symbols" />
        </UFormField>
      </div>
      <div class="flex flex-col gap-2">
        <UCheckbox
          v-model="allowLowercase"
          label="Allow Lowercase (abc)" />
        <UCheckbox
          v-model="allowUppercase"
          label="Allow Uppercase (ABC)" />
        <UCheckbox
          v-model="allowNumbers"
          label="Allow Numbers (0-9)" />
        <UCheckbox
          v-model="excludeSimilar"
          label="Exclude Similar (iI1loO0)" />
        <UCheckbox
          v-model="excludeDuplicate"
          label="Exclude Duplicate Characters" />
      </div>
    </div>
    <div class="h-6" />
    <UButton icon="i-material-symbols-settings-outline-rounded" @click="generatePassword">Generate</UButton>
    <div class="h-6" />
    <UFormField :label="`Password (length: ${generatedPassword.length || ''})`">
      <UTextarea v-model="generatedPassword" class="w-full" color="neutral" disabled />
    </UFormField>
  </div>
</template>

<script setup lang="ts">
const LOCALSTORAGE_PREFIX = 'password-generator-config'
const KEY_LENGTH = 'length'
const { $localStorage } = useNuxtApp()
const localStorage = $localStorage.create(LOCALSTORAGE_PREFIX)

const passwordLength = ref(12)
const allowLowercase = ref(true)
const allowUppercase = ref(true)
const allowNumbers = ref(true)
const excludeSimilar = ref(true)
const excludeDuplicate = ref(true)
const symbols = ref('!@#$%^&*()_+')
const generatedPassword = ref('')

onMounted(async () => {
  passwordLength.value = Number.parseInt(localStorage.getItem(KEY_LENGTH) || '12')
  allowLowercase.value = localStorage.exists('allowLowerCase') ? localStorage.getItem('allowLowercase') === 'true' : true
  allowUppercase.value = localStorage.exists('allowUppercase') ? localStorage.getItem('allowUppercase') === 'true' : true
  allowNumbers.value = localStorage.exists('allowNumbers') ? localStorage.getItem('allowNumbers') === 'true' : true
  excludeSimilar.value = localStorage.exists('excludeSimilar') ? localStorage.getItem('excludeSimilar') === 'true' : true
  excludeDuplicate.value = localStorage.exists('excludeDuplicate') ? localStorage.getItem('excludeDuplicate') === 'true' : true
  symbols.value = localStorage.getItem('symbols') || '!@#$%^&*()_+'
})

watch(passwordLength, newValue => localStorage.setItem(KEY_LENGTH, newValue.toString()))
watch(allowLowercase, newValue => localStorage.setItem('allowLowercase', newValue.toString()))
watch(allowUppercase, newValue => localStorage.setItem('allowUppercase', newValue.toString()))
watch(allowNumbers, newValue => localStorage.setItem('allowNumbers', newValue.toString()))
watch(excludeSimilar, newValue => localStorage.setItem('excludeSimilar', newValue.toString()))
watch(excludeDuplicate, newValue => localStorage.setItem('excludeDuplicate', newValue.toString()))
watch(symbols, newValue => localStorage.setItem('symbols', newValue))

const generatePassword = () => {
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numberChars = '0123456789'
  const similarChars = 'iI1loO0'
  let characterPool = ''

  if (allowLowercase.value) characterPool += lowercaseChars
  if (allowUppercase.value) characterPool += uppercaseChars
  if (allowNumbers.value) characterPool += numberChars
  characterPool += symbols.value

  if (excludeSimilar.value) {
    characterPool = characterPool.split('').filter(char => !similarChars.includes(char)).join('')
  }

  if (!characterPool) {
    generatedPassword.value = 'Error: No characters available for password generation.'
    return
  }

  let password = ''
  for (let i = 0; i < passwordLength.value * 2; i++) {
    const randomIndex = Math.floor(Math.random() * characterPool.length)
    password += characterPool[randomIndex]
  }

  if (excludeDuplicate.value) {
    password = [...new Set(password)].join('')
  }

  password = password.slice(0, passwordLength.value)

  generatedPassword.value = password
}
</script>
