// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getParamSafe = (body: any, key: string): string => {
  if (!(body[key])) {
    throw new TypeError(`Missing ${key} parameter`)
  }
  const value = body[key]
  if (typeof value !== 'string') {
    throw new TypeError(`${key} parameter must be a string`)
  }

  return value
}

export default getParamSafe
