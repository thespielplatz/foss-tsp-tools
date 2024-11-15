import LNURL from '~/server/lib/LNURL/LNURL'

export default defineEventHandler((event): string => {
  const query = getQuery(event)
  if (!(query.lnurl)) {
    throw createError({ message: 'Missing lnurl parameter' })
  }
  const lnurl = query.lnurl
  if (typeof lnurl !== 'string') {
    throw createError({ message: 'lnurl parameter must be a string' })
  }
  try {
    const decoded = LNURL.decode(lnurl)
    return decoded
  } catch (error) {
    throw createError({ message: "Failed to decode lnurl" })
  }
})
