<template>
  <div class="pt-10">
    <div class="text-2xl font-black">LNURL Web Wallet</div>
  </div>
  <div class="pt-5">
    <div class="text-xl font-bold">Wallet</div>
    <textarea v-if="seedVisible"
      class="w-full h-20 border-2 border-gray-300 rounded-lg p-2"
      v-model="wallet"
      placeholder="seed" />
    <div v-else class="pb-1">
      <div class="w-full h-20 border-2 border-gray-300 rounded-lg p-2 blur-sm">
        {{ replaceCharacters(wallet, '#') }}
      </div>
    </div>
    <div class="flex gap-1">
      <ButtonDefault @click="generateNewWallet">
        <b-icon-plus-square /><span>New</span>
      </ButtonDefault>
      <ButtonDefault @click="toggleSeedVisibility">
        <b-icon-eye-slash-fill v-if="!seedVisible" /><b-icon-eye-fill v-if="seedVisible" /><span>Seed</span>
      </ButtonDefault>
      <ButtonDefault @click="toggleAutoSave">
        <b-icon-floppy v-if="!autoSave" /><b-icon-floppy-fill v-if="autoSave" /><span>Autosave: </span><span>{{ autoSave ? 'ON ' : 'OFF'}}</span>
      </ButtonDefault>
    </div>
  </div>
  <div class="pt-5">
    <div class="text-xl font-bold">LNURL</div>
    <textarea
      class="w-full h-20 border-2 border-gray-300 rounded-lg p-2"
      v-model="lnurl"
      placeholder="Paste your lnurl here"></textarea>
      <div>
        <span class="font-bold">Type: </span>{{ lnurlType }}
      </div>
  </div>
  <div v-if="false && lnurlType == 'none'" class="pt-5">
    <div>Not Implemented</div>
  </div>
  <div v-if="lnurlType == 'auth'" >
    <div>
      <span class="font-bold">Derivation Path: </span><span class="font-mono">{{ derivationPath }}</span>
    </div>
    <div class="flex gap-1">
      <ButtonDefault @click="authLoginViaFrontend">
        <b-icon-box-arrow-in-right /><span>Login</span><span class="italic text-xs">(Request via Browser)</span>
      </ButtonDefault>
      <ButtonDefault @click="authLoginViaBackend">
        <b-icon-box-arrow-in-right /><span>Login</span><span class="italic text-xs">(Request via Backend)</span>
      </ButtonDefault>
    </div>
  </div>
  <div v-if="loginResult != null" >
    <div>
      <span class="font-bold">Result: </span><span :class="loginResult ? 'text-green-600' : 'text-red-700'">{{ loginResult }}</span>
    </div>
  </div>
</template>
 
<script lang="ts" setup>

import ButtonDefault from '~/components/wallet/ButtonDefault.vue'

const LOCALSTORAG_KEY_MNEMONIC = 'mnemonic'

const wallet = ref('')
const lnurl = ref('')
const lnurlType = ref('')
const derivationPath = ref('m/0\'')
const loginResult = ref<null | boolean>(null)
const autoSave = ref(false)
const seedVisible = ref(false)
const { $localStorage } = useNuxtApp()

const generateNewWallet = async () => {
  const data = await $fetch('/api/hd-wallet/generateRandomMnemonic')
  if (data) {
    wallet.value = data
    if (autoSave.value) {
      $localStorage.setItem(LOCALSTORAG_KEY_MNEMONIC, wallet.value)
    }
  }
}

onMounted(() => {
  nextTick(async () => {
    const mnemonic = $localStorage.getItem(LOCALSTORAG_KEY_MNEMONIC)
    if (mnemonic) {
      wallet.value = mnemonic
      autoSave.value = true
    } else {
      await generateNewWallet()
    }
  })
})

const toggleAutoSave = () => {
  autoSave.value = !autoSave.value

  if (autoSave.value) {
    $localStorage.setItem(LOCALSTORAG_KEY_MNEMONIC, wallet.value)
  } else {
    $localStorage.removeItem(LOCALSTORAG_KEY_MNEMONIC)
  }
}

const toggleSeedVisibility = () => {
  seedVisible.value = !seedVisible.value
}

let nextPrepareRequest: string | null = null

watch(lnurl, async (newValue) => {
  loginResult.value = null
  lnurlType.value = ''

  if (nextPrepareRequest == null) {
    await prepareLnurl(newValue)
  } else {
    nextPrepareRequest = newValue
  }
})

const prepareLnurl = async (lnurl: string) => {
  let lnurlObject
  try {
    const data = await $fetch('/api/lnurl/decode', {
      query: { lnurl }
    })
    lnurlObject = data
  } catch (error) {
    lnurlType.value = 'Could not decode lnurl or type not implemented yet'
  }

  if (nextPrepareRequest != null) {
    const nextLnurl = nextPrepareRequest
    nextPrepareRequest = null
    await prepareLnurl(nextLnurl)
    return
  }

  if (!lnurlObject) return

  lnurlType.value = getLnurlType(lnurlObject) || ''
}

const authLoginViaBackend = async () => {
  loginResult.value = null

  try {
    loginResult.value = await $fetch('/api/lnurl-auth/login', {
      method: 'POST',
      body: { 
        lnurl: lnurl.value,
        derivationPath: derivationPath.value,
        mnemonic: wallet.value
      },
    })
  } catch (error) {
    console.error(error)
    loginResult.value = false
  }
}

const authLoginViaFrontend = async () => {
  loginResult.value = null

  try {
    const callbackUrl = await $fetch('/api/lnurl-auth/prepareForFrontend', {
      method: 'POST',
      body: { 
        lnurl: lnurl.value,
        derivationPath: derivationPath.value,
        mnemonic: wallet.value
      },
    })

    const data = await fetch(callbackUrl)
    loginResult.value = data.status == 200
   } catch (error) {
    console.error(error)
    loginResult.value = false
   }
}

</script>