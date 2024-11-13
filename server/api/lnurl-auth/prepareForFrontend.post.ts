import HDWallet from '~/server/lib/HDWallet/HDWallet'
import LNURLAuth from '~/server/lib/LNURL/LNURLAuth'
import getParamSafe from '~/server/utils/getParamSafe'

export default defineEventHandler(async (event): Promise<string> => {
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
  return callbackUrl.toString()
})
