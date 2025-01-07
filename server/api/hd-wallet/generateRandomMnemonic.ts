import HDWallet from '~/server/lib/HDWallet/HDWallet'

export default defineEventHandler(() => {
  return HDWallet.generateRandomMnemonic()
})
