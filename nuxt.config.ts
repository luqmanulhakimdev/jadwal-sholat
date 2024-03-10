// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    baseURL: '/jadwal-sholat/',
    buildAssetsDir: 'assets/',
  },
  builder: 'webpack',
  modules: [
    '@nuxtjs/tailwindcss'
  ]
})
