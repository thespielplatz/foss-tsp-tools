<template>
  <div class="pt-20">
    <div class="text-2xl font-black">
      Seed Word Checker
    </div>
    <div class="pt-10">
      <UTextarea
        v-model="text"
        class="w-full"
        placeholder="Please enter seed words here to check"
        :rows="8"
      />
    </div>

    <div class="flex justify-center pt-10">
      <!-- eslint-disable vue/no-v-html -->
      <div v-html="result" />
      <!-- eslint-enable vue/no-v-html -->
    </div>
    <div class="flex justify-center">
      <div class="font-bold pt-10 ">
        ⚠️ IF YOU DON'T KNOW WHY YOU SHOULD USE THIS TOOL, PLEASE DO NOT USE IT! ⚠️
      </div>
    </div>
    <div class="pt-10">
      For <a
        href="https://github.com/lightningnetwork/lnd/tree/master/aezeed"
        class="underline"
      >aezeed</a>
    </div>
  </div>
</template>

<script setup lang="ts">
const result = ref('')
const text = ref('')

watch(text, (newValue) => {
  updateResult(newValue)
})

onMounted(async () => {
  updateResult('')
})

const updateResult = (text: string) => {
  if (text.trim() === '') {
    result.value = '<i>Please enter word list</i>'
    return
  }

  const inputWords = text
    .split(/[\n,]/)
    .map(w => w.trim())
    .filter(w => w !== '')

  const unknownWords = inputWords.filter(word => !englishWordList.includes(word))

  if (unknownWords.length === 0) {
    result.value = '<i>All words are valid</i>'
  } else {
    result.value = `Unknown words (${unknownWords.length}):<br>${unknownWords.join('<br>')}`
  }
}
</script>
