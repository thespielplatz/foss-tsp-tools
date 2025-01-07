// Specification LNURLAuth https://github.com/lnurl/luds/blob/luds/01.md

import { Buffer } from 'node:buffer'
import { bech32 } from 'bech32'

export const LNURL_RULES = {
  prefix: 'lnurl',
  limit: 1023,
}

export const LNURL = {
  encode: (unencoded: string) => {
    const words = bech32.toWords(Buffer.from(unencoded, 'utf8'))
    return bech32.encode(LNURL_RULES.prefix, words, LNURL_RULES.limit)
  },
  decode: (encoded: string) => {
    const encodedLowerCase = encoded.toLowerCase()
    const { words: dataPart } = bech32.decode(encodedLowerCase, LNURL_RULES.limit)
    const requestByteArray = bech32.fromWords(dataPart)

    return Buffer.from(requestByteArray).toString('utf8')
  },
}

export default LNURL
