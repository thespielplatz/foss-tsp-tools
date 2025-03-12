<template>
  <Toast
    :state="authLoadSeedState"
    :auto-hide="2500"
  >
    {{ autoLoadSeedText }}
  </Toast>
  <div class="pt-10">
    <div class="text-2xl font-black">
      LNURL Web Wallet
    </div>
  </div>
  <div class="pt-5">
    <div class="flex gap-1 items-center">
      <div class="text-xl font-bold">
        Wallet
      </div>
    </div>

    <textarea
      v-if="seedVisible"
      v-model="wallet"
      class="w-full h-20 border-2 border-gray-300 rounded-lg p-2"
      placeholder="seed"
    />
    <div
      v-else
      class="pb-1"
    >
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
        <b-icon-floppy v-if="!autoSave" /><b-icon-floppy-fill v-if="autoSave" /><span>Autosave: </span><span>{{ autoSave ? 'ON ' : 'OFF' }}</span>
      </ButtonDefault>
    </div>
  </div>
  <div class="pt-5">
    <div class="text-xl font-bold">
      LNURL
    </div>
    <textarea
      v-model="lnurl"
      class="w-full h-20 border-2 border-gray-300 rounded-lg p-2"
      placeholder="Paste your lnurl here"
    />
    <div>
      <span class="font-bold">Type: </span>{{ lnurlType }}
    </div>
  </div>
  <div
    v-if="false && lnurlType == 'none'"
    class="pt-5"
  >
    <div>Not Implemented</div>
  </div>
  <div v-if="lnurlType == 'auth'">
    <div>
      <span class="font-bold">Derivation Path: </span><span class="font-mono">{{ derivationPath }}</span>
    </div>
    <div class="flex gap-1">
      <ButtonDefault @click="authLoginViaNewTab">
        <b-icon-box-arrow-up-right /><span>Login</span><span class="italic text-xs">(Request via new tab)</span>
      </ButtonDefault>
      <ButtonDefault @click="authLoginViaBackend">
        <b-icon-box-arrow-in-right /><span>Login</span><span class="italic text-xs">(Request via Backend)</span>
      </ButtonDefault>
    </div>
  </div>
  <div v-if="loginResult != null">
    <div>
      <span class="font-bold">Result: </span><span :class="loginResult ? 'text-green-600' : 'text-red-700'">{{ loginResult }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ButtonDefault from '~/components/wallet/ButtonDefault.vue'
import Toast from '~/components/typography/Toast.vue'

const LOCALSTORAG_KEY_MNEMONIC = 'mnemonic'

const wallet = ref('')
const lnurl = ref('')
const lnurlType = ref('')
const derivationPath = ref('m/0\'')
const loginResult = ref<null | boolean>(null)
const autoSave = ref(false)
const seedVisible = ref(false)
const autoLoadSeedText = ref('')
const authLoadSeedState = ref<'normal' | 'success'>('normal')

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
      autoLoadSeedText.value = 'Loaded from local storage'
      authLoadSeedState.value = 'normal'
    } else {
      await generateNewWallet()
      authLoadSeedState.value = 'success'
      autoLoadSeedText.value = 'Seed generated'
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

watch(wallet, async (newValue) => {
  if (autoSave.value) {
    $localStorage.setItem(LOCALSTORAG_KEY_MNEMONIC, newValue)
  }
})

const prepareLnurl = async (lnurl: string) => {
  let lnurlObject
  try {
    const data = await $fetch('/api/lnurl/decode', {
      query: { lnurl },
    })
    lnurlObject = data
  } catch {
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
    const login = await $fetch('/api/lnurl-auth/login', {
      method: 'POST',
      body: {
        lnurl: lnurl.value,
        derivationPath: derivationPath.value,
        mnemonic: wallet.value,
      },
    })
    loginResult.value = login
  } catch (error) {
    console.error(error)
    loginResult.value = false
  }
}

const authLoginViaNewTab = async () => {
  loginResult.value = null

  try {
    const callbackUrl = await $fetch<string>('/api/lnurl-auth/prepareForFrontend', {
      method: 'POST',
      body: {
        lnurl: lnurl.value,
        derivationPath: derivationPath.value,
        mnemonic: wallet.value,
      },
    })
    window.open(callbackUrl, '_blank')
  } catch (error) {
    console.error(error)
    loginResult.value = false
  }
}
</script>
