// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content',
    '@vueuse/nuxt',
    'nuxt-og-image',
    'motion-v/nuxt'
  ],

  devtools: {
    enabled: true,
  },


  // for nuxt v4.5.0 and above only
  // builder: 'rspack',

  css: ['~/assets/css/main.css'],

  content: {
    experimental: {
      sqliteConnector: 'native'
    }
  },

  compatibilityDate: '2026-06-30',


  devServer: {
    host: '0.0.0.0', // bind to all interfaces inside the container, not just loopback
    port: 3000, // internal port — stays 3000, host maps 3300 -> this
  },

  vite: {
    server: {
      // host: '0.0.0.0',
      strictPort: true,
      hmr: {
        protocol: 'wss', // tunnel terminates TLS, so client connects over wss
        host: 'nuxt-dev.softwarelabs.dev', // public hostname the browser actually loads from
        clientPort: 443, // public port (Cloudflare always fronts on 443)
      },
      allowedHosts: ['nuxt-dev.softwarelabs.dev'], // Vite 5.4+/6 reject unrecognized Host headers by default
    },
  },


  nitro: {
    prerender: {
      routes: [
        '/'
      ],
      crawlLinks: true
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  ogImage: {
    zeroRuntime: true
  }
})
