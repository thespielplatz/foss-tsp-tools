const getLnurlType = (url: string): 'auth' | null => {
  const urlObj = new URL(url)
  const tag = urlObj.searchParams.get('tag')
  return tag === 'login' ? 'auth' : null
}

export default getLnurlType
