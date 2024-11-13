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

export default getParamSafe