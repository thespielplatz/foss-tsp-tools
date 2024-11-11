import HDWallet from '~/server/lib/HDWallet/HDWallet'

export default defineEventHandler((event) => {
  return HDWallet.generateRandomMnemonic()
})