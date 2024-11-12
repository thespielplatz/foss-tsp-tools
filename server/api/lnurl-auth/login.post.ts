import HDWallet from '~/server/lib/HDWallet/HDWallet'
import LNURLAuth from '~/server/lib/LNURL/LNURLAuth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const lnurl = getParamSafe(body, 'lnurl')
  const mnemonic = getParamSafe(body, 'mnemonic')
  const derivationPath = getParamSafe(body, 'derivationPath')

  const hdWallet = new HDWallet(mnemonic)
  const signingKey = hdWallet.getNodeAtCustomPath(derivationPath)

  const lnurlAuthModule = new LNURLAuth({
    publicKeyAsHex: signingKey.getPublicKeyAsHex(),
    privateKeyAsHex: signingKey.getPrivateKeyAsHex(),
  })
  const callbackUrl = lnurlAuthModule.getLNURLAuthCallbackUrl(lnurl)
  const data = await fetch(callbackUrl.toString())
  return data.status == 200
})

const getParamSafe = (body: any, key: string): string => {
  if (!(body[key])) {
    throw new Error(`Missing ${key} parameter`)
  }
  const value = body[key]
  if (typeof value !== 'string') {
    throw new Error(`${key} parameter must be a string`)
  }

  return value
}