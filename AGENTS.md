# AGENTS.md

Guidance for AI agents working in this repository.

## What this is

A personal portfolio site built on the **Nuxt UI Portfolio template** (fork of `nuxt-ui-templates/portfolio`).
- **Stack**: Nuxt 4, Nuxt UI 4, @nuxt/content 3 (data source), Tailwind CSS 4, TypeScript.
- **No test framework.** Verification = `lint` then `typecheck` (this is also what CI runs).
- Content-driven: page data lives in `content/*.yml` (and `content/blog/*.md`, `content/projects/*.yml`), validated against Zod schemas in `content.config.ts`.

## Commands

Always use **pnpm** (declared `packageManager: pnpm@11.13.1`; CI and README use pnpm).

```bash
pnpm install        # postinstall runs `nuxt prepare` (regenerates .nuxt/ types)
pnpm dev            # dev server on http://localhost:3000
pnpm build          # production build (prerenders '/' + crawlLinks, see nitro config)
pnpm preview        # preview production build
pnpm lint           # eslint .        (use `lint:fix` to autofix)
pnpm typecheck      # nuxt typecheck   (vue-tsc; needs .nuxt/ generated first)
pnpm clean          # nuxt cleanup     (removes .nuxt, .output, .data)
```

Verification order before considering work done: **`pnpm lint` → `pnpm typecheck`**.

> A `bun.lock` exists and is committed, but the project is pnpm-driven. Treat pnpm as authoritative; don't switch package managers. The lockfile is eslint-ignored.

## Architecture / layout (Nuxt 4 `app/` srcDir)

Source lives under `app/`, not the repo root:
- `app/app.vue` — root; sets up SEO meta, color mode, content search, renders `NuxtLayout`/`NuxtPage`.
- `app/pages/` — routes: `index`, `about`, `projects`, `speaking`, `blog/` (index + `[...slug]`).
- `app/components/landing/` — homepage sections (`Hero`, `About`, `Blog`, `FAQ`, `Testimonials`, `WorkExperience`).
- `app/app.config.ts` — runtime UI config (colors, footer, global profile data, picture URL).
- `app/layouts/default.vue`, `app/error.vue`, `app/utils/` (composables-free helpers).
- `content/` — the actual portfolio data (YAML/Markdown). **Schemas are enforced** by `content.config.ts`; invalid frontmatter/fields will fail content queries and typecheck.

`public/` holds static assets (`hero/*.avif`, favicon, robots).

## Content model (high-signal)

Collections in `content.config.ts`: `index` (homepage, `index.yml`), `projects` (data, `projects/*.yml`), `blog` (page, `blog/*.md`), `pages` (`projects.yml` + `blog.yml`), `speaking`, `about`.
- Reusable sub-schemas: `createButtonSchema`, `createImageSchema`, `createAuthorSchema`, `createTestimonialSchema`.
- `.editor({ input: 'media' })` / `input: 'icon'` markers are for the Nuxt Studio editor, not runtime — keep them.
- Content is queried via `queryCollection('name')` (see `app/app.vue`, pages).

## Style / conventions

- ESLint via `@nuxt/eslint`; **stylistic overrides in `nuxt.config.ts`**: `commaDangle: 'never'`, `braceStyle: '1tbs'`. Don't add trailing commas.
- `@typescript-eslint/no-explicit-any` is **off** — `any` is allowed.
- Indent 2 spaces, LF, UTF-8 (`.editorconfig`). Markdown: do not trim trailing whitespace.
- Tailwind source includes `content/**/*` via `@source` in `app/assets/css/main.css` — content files are scanned for classes.
- Icons: `@iconify-json/lucide` and `@iconify-json/simple-icons` (use `i-lucide-*` / `i-simple-icons-*`).

## Gotchas

- **`postinstall` regenerates `.nuxt/`.** If types seem stale after a content/schema change, run `pnpm install` or `npx nuxt prepare`, then `pnpm typecheck`.
- **`nuxt.config.ts` contains environment-specific dev-server/HMR config** (host `0.0.0.0`, `strictPort`, HMR pinned to `nuxt-dev.softwarelabs.dev` over wss/443, `allowedHosts`). This is for a tunneled dev environment; change it only if you understand the tunnel setup, otherwise local dev may fail to connect/HMR.
- **`app/app.vue` has local modifications** that are not part of the upstream template: a hardcoded `<link rel="javascript" href="/_nuxt/@fs/.../entry.js?...">` pointing at an absolute local path, and a leftover unused `testFunction`. These are fragile / non-portable — prefer removing them unless intentionally kept.
- OG images: `nuxt-og-image` with `zeroRuntime: true`; templates in `app/components/OgImage/` (`.takumi.vue`, uses `@takumi-rs/core`).
- Prerendering crawls links from `/`; broken internal links surface at build time.
- `NUXT_PUBLIC_SITE_URL` (`.env.example`) is used for OG image absolute URLs during `nuxt generate`.

## Workflow

- Branch: `main`. CI (`.github/workflows/ci.yml`, Node 22) runs `pnpm install` → `lint` → `typecheck` on every push.
- Dependencies are kept current via Renovate (`renovate.json`, extends `nuxt/renovate-config-nuxt`); `resolutions` updates are disabled.
- Two remotes: `origin` = this fork, `upstream` = the template. Keep template-aligned where possible.
