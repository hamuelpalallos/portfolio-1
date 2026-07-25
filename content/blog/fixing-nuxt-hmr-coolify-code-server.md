---
title: 'Fixing Nuxt HMR in a Coolify Code-Server: A Debugging Journey'
description: A detailed walkthrough of troubleshooting and fixing Hot Module Replacement issues when running Nuxt in a self-hosted code-server environment.
date: 2025-07-25
image: https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80
minRead: 10
author:
  name: Hamuel Palallos
  description: Senior Software Engineer
  avatar:
    src: https://images.unsplash.com/photo-1701615004837-40d8573b6652?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
    alt: Hamuel Palallos
---

## The Setup

I run a self-hosted development environment using [code-server](https://github.com/coder/code-server) deployed as a Coolify resource, so I can code from anywhere without needing a local machine set up. My stack for this particular project was Nuxt, running with `bun dev` for the dev server.

Simple enough in theory — until Hot Module Replacement (HMR) refused to cooperate.

**The symptom:** the app loaded fine on first visit. But the moment I edited a file, nothing happened. No live reload, no update — just a dead page until I manually refreshed. That's not really "dev mode" at that point, it's just... slow deployment.

This post walks through everything I tried, what failed and why, and the setup that finally got HMR working reliably.

## Attempt 1: code-server's Built-In Path Proxy (`/absproxy/3000`)

code-server has a built-in port-forwarding feature that proxies a port running inside the container through code-server's own web UI, using a path like:

```
https://code.yourdomain.com/absproxy/3000/
```

This seemed like the obvious first move — no extra infrastructure, just point the browser at that path and go.

### What went wrong

The initial page load worked. But:

- The HMR WebSocket connection either failed outright or connected to the wrong location, because Vite's HMR client infers its reconnect target from `window.location` — which, under a path-prefixed proxy, doesn't match where the actual dev server lives internally.
- Several static asset requests came back broken or 404'd, because Vite generates absolute asset URLs (`/assets/...`) that don't account for the `/absproxy/3000/` prefix unless you explicitly configure a `baseURL`.
- I tried setting `app.baseURL` in `nuxt.config.ts` to match the proxy path, which fixed *some* of the asset loading, but the HMR socket still refused to stay connected. Console showed repeated WebSocket connection errors — connect, fail, retry, fail again.

This is a known category of problem with **path-based proxies** in general: anything that rewrites the URL structure between the browser and the dev server tends to break HMR unless every layer (dev server, proxy, and client) agrees on the exact same base path and protocol — and getting all three to agree through code-server's proxy layer turned out to be more fragile than it was worth.

**Verdict:** abandoned. Too brittle, and even when partially working, updates were unreliable.

## Attempt 2: ngrok

Next I tried sidestepping code-server's proxy entirely and just tunneling the Nuxt dev server directly with ngrok:

```bash
ngrok http 3000
```

This gets you a public HTTPS URL pointed straight at the dev server, no path prefixing involved — which should, in theory, avoid the whole `/absproxy` problem.

### What went wrong

- The initial page load worked over the ngrok URL.
- HMR still didn't update reliably. The WebSocket would sometimes connect, but updates from file changes weren't consistently reaching the browser — occasional reloads worked, most didn't.
- Free-tier ngrok's rotating URLs made this annoying to work with day-to-day anyway — every restart meant reconfiguring `allowedHosts` in Vite to match the new domain, or requests got rejected outright by Vite's Host header check.
- Added latency from ngrok's tunnel routing made the dev experience noticeably slower even when it did work.

**Verdict:** abandoned. Marginally better than the path proxy in terms of asset loading, but no more reliable for HMR, and the rotating-URL friction made it impractical for daily use.

## Diagnosing the Real Problem

At this point it was clear the issue wasn't really about *which* proxy I used — it was about **HMR's WebSocket needing to know the exact public host, protocol, and port it should reconnect on**, and none of my attempts were telling it that explicitly. Vite's HMR client just guesses based on the page's own URL unless you override it.

The other half of the puzzle: I also had a Firefox browser container running as a Coolify resource in the same project, which I couldn't reach at all via `localhost` — a good reminder that containers don't share `localhost` with each other, or with the host, by default.

That reframed the whole problem as a networking and configuration issue, not a "wrong tool" issue.

## The Working Solution: Direct Access via Existing Cloudflare Tunnel

I already run `cloudflared` as a TrueNAS app, tunneling several other self-hosted services. Rather than adding a new proxy layer, the fix was to route the Nuxt dev server (and code-server itself) through that **existing tunnel**, giving each service its own dedicated subdomain that points straight at the container's published port — no path prefixing, no guessing.

### Step 1: Publish ports on the host

In the code-server resource's `docker-compose.yml`:

```yaml
services:
  code-server:
    image: your-code-server-image
    restart: unless-stopped
    ports:
      - "8080:8080"   # code-server web UI
      - "3300:3000"   # nuxt dev server (host:container)
    volumes:
      - code-server-data:/home/coder
    environment:
      - PASSWORD=your_password

volumes:
  code-server-data:
```

### Step 2: Confirm the port isn't already taken

```bash
ss -tulpn | grep 3300
```

No output meant it was free to use.

### Step 3: Add routes in the existing Cloudflare Tunnel

Under Zero Trust → Networks → Tunnels → my existing tunnel → Public Hostname:

| Public hostname | Service |
|---|---|
| `code-dev.yourdomain.com` | `http://<host-ip>:8080` |
| `nuxt-dev.yourdomain.com` | `http://<host-ip>:3300` |

Since these are flat, single-level subdomains, they're covered automatically by the existing `*.yourdomain.com` Universal SSL wildcard — no certificate setup needed.

### Step 4: The `nuxt.config.ts` that actually worked

```ts
export default defineNuxtConfig({
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
        'Cache-Control': 'no-store, must-revalidate'
      }
    }
  }
})
```

The two lines that actually solved the original HMR bug were `hmr.host` and `hmr.clientPort: 443` — telling the HMR client explicitly where to reconnect, instead of letting it guess.

But getting HMR *connected* only exposed a second, sneakier problem I'd been blaming on Vite: **Cloudflare's edge cache.** After every dev server restart, the browser would sometimes load a stale `entry.js` (or get a chunk back with the wrong `Content-Type`) and throw:

> `Failed to fetch dynamically imported module: .../entry.js`
> `Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of text/css`

That's [nuxt/nuxt#26565](https://github.com/nuxt/nuxt/issues/26565) — and it's not a Nuxt bug, it's the CDN serving yesterday's hashed chunk as if it were current. The `Cache-Control: no-store, must-revalidate` header above is the in-app mitigation, but the real fix is at the edge: in Cloudflare Zero Trust, set a Cache Rule (or Page Rule) to **bypass cache for the dev hostname**, or flip the DNS record to **grey cloud (DNS only)**. Once the cache stopped serving stale chunks, restarts were instantly clean.

### Step 5: Removing the old workarounds

Once this was in place, I went back and stripped out everything I'd added for the failed attempts:

- The `app.baseURL` override I'd set for the `/absproxy/3000` path
- The ngrok-specific entries in `allowedHosts`
- Any lingering `server.origin` overrides from earlier troubleshooting

## Result

With direct routing through the tunnel and explicit HMR config, file edits now hot-reload instantly — no manual refresh, no dead WebSocket connections. Confirmed in the browser's Network → WS tab: one persistent connection, no repeated reconnect attempts.

## Lessons Learned

1. **Path-based proxies and HMR don't mix well.** If you have the option, route dev servers to their own subdomain instead of a path prefix — it avoids an entire category of asset and WebSocket bugs.
2. **HMR needs to be told, not left to guess.** `hmr.host`, `hmr.protocol`, and `hmr.clientPort` in Vite's config exist specifically for tunneled/proxied setups like this.
3. **Containers don't share `localhost`.** Cross-container or container-to-host access needs the actual host/service address, not `localhost`.
4. **Reuse existing infrastructure where you can.** Once I stopped trying to add new proxy layers (code-server's built-in proxy, then ngrok) and instead used the Cloudflare Tunnel I already had running, the whole problem became much simpler.
5. **Behind a CDN, "stale module" errors are usually a cache bug, not a bundler bug.** `Failed to fetch dynamically imported module` / wrong-MIME errors after a restart almost always mean the edge (Cloudflare) is serving the old hashed `entry.js`. Bypass cache on the dev hostname (or go DNS-only) — the `Cache-Control: no-store` header is a mitigation, not a substitute.

Thanks for reading — if you've run into similar HMR issues with a self-hosted dev environment, I'd love to hear how you solved it.