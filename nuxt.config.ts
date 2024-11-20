// https://nuxt.com/docs/api/configuration/nuxt-config

import packageJson from './package.json'

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { 
    enabled: true,
  },
  runtimeConfig: {
    public: {
      version: packageJson.version,
    },
  },  
  css: [
    '@/assets/css/tailwind.css',
    '@/assets/css/global.css',
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  typescript: {
    typeCheck: true
  },
})
