const localStoragePlugin = {
  exists(key: string): boolean {
    return localStorage.getItem(key) != null
  },
  getItem(key: string): string | null {
    return localStorage.getItem(key)
  },
  setItem(key: string, value: string): void {
    localStorage.setItem(key, value)
  },
  removeItem(key: string): void {
    localStorage.removeItem(key)
  },
}

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      localStorage: localStoragePlugin
    }
  }
})
