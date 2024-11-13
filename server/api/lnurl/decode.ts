import LNURL from '~/server/lib/LNURL/LNURL'

export default defineEventHandler((event): string => {
  const query = getQuery(event)
  if (!(query.lnurl)) {
    throw new Error('Missing lnurl parameter')
  }
  const lnurl = query.lnurl
  if (typeof lnurl !== 'string') {
    throw new Error('lnurl parameter must be a string')
  }
  const decoded = LNURL.decode(lnurl)
  return decoded
})
