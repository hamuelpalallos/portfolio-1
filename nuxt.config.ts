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
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  devServer: {
    host: '0.0.0.0',
    port: 3000
  },

  compatibilityDate: '2026-06-30',

  nitro: {
    prerender: {
      routes: [
        '/'
      ],
      crawlLinks: true
    }
  },

  vite: {
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit'
      ]
    },
    server: {
      // Tunneled dev setup: the browser reaches this dev server through a
      // Cloudflare Tunnel at https://nuxt-dev.softwarelabs.dev (TLS terminated
      // at the edge on 443, dev server itself is plain HTTP on 0.0.0.0:3000).
      // See content/blog/fixing-nuxt-hmr-coolify-code-server.md for the journey.
      host: '0.0.0.0',
      // `strictPort: true` so the listening port is deterministic. Per Vite docs
      // this also silences the HMR WebSocket "direct connection fallback" error.
      strictPort: true,
      hmr: {
        protocol: 'wss',
        host: 'nuxt-dev.softwarelabs.dev',
        clientPort: 443
      },
      allowedHosts: ['nuxt-dev.softwarelabs.dev'],
      // IMPORTANT: Cloudflare's edge cache MUST be bypassed for the dev hostname,
      // otherwise it serves stale _nuxt/*.js / entry.js chunks (or wrong
      // Content-Type) after the dev server restarts and the ?v= hash changes.
      // That is the documented #1 cause of:
      //   "Failed to fetch dynamically imported module: .../entry.js"
      //   "Expected a JavaScript-or-Wasm module script but the server responded
      //    with a MIME type of text/css"
      // (nuxt/nuxt#26565). In Cloudflare Zero Trust, set a Cache Rule / Page Rule
      // to bypass cache for the dev hostname, or set it to "DNS only" (grey cloud).
      // The header below is the in-app mitigation; it is not a substitute for
      // disabling edge caching on the dev hostname.
      headers: {
        // 'Cache-Control': 'no-store, must-revalidate, cacheable=no, private, max-age=0'
        'Cache-Control': 'no-store, must-revalidate'
        // 'Cache-Control': 'no-store'
        // 'Cache-Control': 'must-revalidate'
      }
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
