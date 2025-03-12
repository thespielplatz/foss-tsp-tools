// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@thespielplatz/nuxt-dev-base',
  ],
  devtools: {
    enabled: true,
  },
  css: [
    '~/assets/css/main.css',
  ],
  ui: {
    theme: {
      colors: ['primary', 'secondary', 'info', 'success', 'warning', 'error', 'footer'],
    },
  },
  experimental: {
    appManifest: false,
  },
  compatibilityDate: '2024-04-03',
  typescript: {
    typeCheck: true,
  },
})
