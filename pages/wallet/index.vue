<template>
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
    <UTextarea
      v-if="seedVisible"
      v-model="wallet"
      placeholder="seed"
      class="w-full"
    />
    <UTextarea
      v-else
      class="w-full blur-sm"
      :value="replaceCharacters(wallet, '#')"
    />
    <div class="flex gap-1 pt-2">
      <UButton
        icon="i-iconoir-plus-square-solid"
        @click="generateNewWallet"
      >
        New
      </UButton>
      <UButton
        :icon="seedVisible ? 'i-iconoir-eye-solid' : 'i-iconoir-eye-closed'"
        @click="toggleSeedVisibility"
      >
        Seed
      </UButton>
      <UButton
        :icon="autoSave ? 'i-iconoir-save-action-floppy' : 'i-iconoir-save-floppy-disk'"
        @click="toggleAutoSave"
      >
        Autosave: <span>{{ autoSave ? 'ON ' : 'OFF' }}</span>
      </UButton>
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
      <UButton
        icon="i-iconoir-arrow-up-circle-solid"
        @click="authLoginViaNewTab"
      >
        Login<span class="italic text-xs">(Request via new tab)</span>
      </UButton>
      <UButton
        icon="i-iconoir-arrow-right-circle-solid"
        @click="authLoginViaBackend"
      >
        Login<span class="italic text-xs">(Request via Backend)</span>
      </UButton>
    </div>
  </div>
  <div v-if="loginResult != null">
    <div>
      <span class="font-bold">Result: </span><span :class="loginResult ? 'text-green-600' : 'text-red-700'">{{ loginResult }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
const toast = useToast()

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
      toast.add({ title: 'Seed loaded from local storage', color: 'info' })
    } else {
      await generateNewWallet()
      toast.add({ title: 'New seed generated', color: 'info' })
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
