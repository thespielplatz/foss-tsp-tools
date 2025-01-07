// https://nuxt.com/docs/api/configuration/nuxt-config
import packageJson from './package.json' assert { type: 'json' }

const packageJsonTyped = packageJson as {
  version: string
  meta?: { 'special-version'?: string }
}

export default defineNuxtConfig({
  devtools: {
    enabled: true,
  },

  css: [
    '@/assets/css/tailwind.css',
    '@/assets/css/global.css',
  ],
  runtimeConfig: {
    public: {
      releasedVersion: packageJsonTyped.version,
      version: packageJsonTyped.meta?.['special-version'] || packageJsonTyped.version,
    },
  }, compatibilityDate: '2024-04-03',
  typescript: {
    typeCheck: true,
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})
