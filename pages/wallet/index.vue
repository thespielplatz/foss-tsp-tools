<template>
  <div class="pt-10">
    <div class="text-xl font-black">LNURL Web Wallet</div>
  </div>
  <div class="pt-5">
    <div class="text-xl font-bold">Wallet</div>
    <textarea
      class="w-full h-20 border-2 border-gray-300 rounded-lg p-2"
      v-model="wallet"
      placeholder="seed"></textarea>
    <ButtonDefault @click="generateNewWallet">
      <b-icon-plus-square /><span>New</span>
    </ButtonDefault>
  </div>
  <div class="pt-5">
    <div class="text-xl font-bold">LNURL</div>
    <textarea
      class="w-full h-20 border-2 border-gray-300 rounded-lg p-2"
      v-model="lnurl"
      placeholder="Paste your lnurl here"></textarea>
  </div>
  <div v-if="lnurlType == 'none'" class="pt-5">
    <div>Not Implemented</div>
  </div>
  <div v-if="lnurlType == 'auth'" >
    <div>
      Path: 
    </div>
    <ButtonDefault @click="login">
      <b-icon-plus-square /><span>Login</span>
    </ButtonDefault>
  </div>
</template>
 
<script lang="ts" setup>

import ButtonDefault from '~/components/wallet/ButtonDefault.vue'

const wallet = ref('')
const lnurl = ref('')
const lnurlType = ref('')

const generateNewWallet = async () => {
  const data = await $fetch('/api/hd-wallet/generateRandomMnemonic')
  if (data) {
    wallet.value = data
  }
}

onMounted(() => {
  nextTick(async () => {
    await generateNewWallet()
  })
})

watch(lnurl, async (newValue) => {
  lnurlType.value = ''

  let lnurlObject
  try {
    const data = await $fetch('/api/lnurl/decode', {
      query: { lnurl: newValue }
    })
    lnurlObject = data
  } catch (e) {
    return
  }
  if (!lnurlObject) return

  lnurlType.value = getLnurlType(lnurlObject) || ''
})

const login = () => {

}

</script>