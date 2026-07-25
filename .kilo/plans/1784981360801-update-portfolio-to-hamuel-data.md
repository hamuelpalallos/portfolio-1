# Update Portfolio Content to Hamuel Palallos's Data

## Goal
Replace all placeholder (Nuxt UI template / "Emma Thompson") values across the portfolio with **Hamuel Palallos's** real data scraped from https://portfolio.softwarelabs.dev/, and add a **/cv** page styled in the repo's existing pattern.

## Source of truth
- Live site: https://portfolio.softwarelabs.dev/ (pages: `/`, `/projects`, `/about`, `/speaking`, `/blog`, `/cv`)
- Target schema: `content.config.ts` (Zod-enforced — invalid fields break content queries + typecheck)
- Style conventions: ESLint flat config (`commaDangle: 'never'`, `braceStyle: '1tbs'`, indent 2, no trailing commas), `@source` scans `content/**`.

## Conventions to follow
- Use **bun** only (`bun.lock` is authoritative).
- Keep `.editor({ input: 'media' | 'icon' })` markers on schema fields — they're for Nuxt Studio, not runtime.
- Dates: YAML uses ISO `YYYY-MM-DD` (schema is `z.date()`). The source shows years like "2025" / ranges like "2022 - 2026"; map to start dates (e.g. `2022-01-01`) and represent ranges in the display text where the schema allows.
- Icons: `i-simple-icons-*` / `i-lucide-*`.
- No emojis, no comments in code unless asked.

---

## Tasks

### 1. Global profile + footer — `app/app.config.ts`
- `global.picture`: keep dark/light as the existing Unsplash photo (source site uses `/profile.jpg` which is local-only; the current Unsplash URL is acceptable as a placeholder — note this as an open question below).
- `global.email`: → `hamuelpalallos@gmail.com` (the source obfuscates via Cloudflare email protection; use the domain email. Confirm exact address — see Open Questions).
- `global.meetingLink`: keep `https://cal.com/` or update to Hamuel's actual cal.com slug (unknown — leave as-is unless provided).
- `global.available`: `true`.
- `footer.links`: replace Nuxt social links with:
  - GitHub: `https://github.com/hamuelpalallos` (`i-simple-icons-github`)
  - LinkedIn: `https://linkedin.com/in/hamuelpalallos` (`i-simple-icons-linkedin`)
  - Email `mailto:` (`i-lucide-mail`)
  - All `target: '_blank'` except mailto.
- `footer.credits`: → `Built with Nuxt UI • © ${year} Hamuel Palallos`.

### 2. Navigation — `app/utils/links.ts`
- Append a **CV** entry to `navLinks` array (after About):
  ```ts
  {
    label: 'CV',
    icon: 'i-lucide-file-text', // or 'i-lucide-clipboard-list'
    to: '/cv'
  }
  ```
  Keep existing icon style (kebab-case `i-lucide-*`).

### 3. Homepage content — `content/index.yml`
Replace entirely with Hamuel's data (preserve top-level schema keys: `seo`, `title`, `description`, `hero`, `about`, `experience`, `testimonials`, `blog`, `faq`):
- `seo.title`: `Hamuel Palallos - Senior Software Engineer`
- `seo.description`: hero description from `/`.
- `title`: `Hey, I'm Hamuel Palallos Senior Software Engineer`
- `description`: `I build scalable full-stack solutions with modern web and mobile technologies. Based in the Philippines, driving innovation through code and architecture.`
- `hero.links`: `View my work` → `/projects`; secondary `Available for projects` → `mailto:` (color `neutral`).
- `hero.images`: keep existing 9 `/hero/random-*.avif` (local assets already present; source uses same names).
- `about.title`: `About Me`; `about.description`: the "About Me" paragraph from `/` homepage section.
- `experience.title`: `Work Experience`; `experience.items`:
  1. `Senior Software Engineer at` / Tripket PH / `https://tripket.ph` / logo `i-simple-icons-...` (no exact brand icon; use `i-lucide-building-2`) / color pick / date `2022-01-01`.
  2. `Software Developer at` / Asbir Tech / date `2025-01-01`.
  - Note: schema `date` is single `z.date()`; render range in `position` text if needed ("2022 - Present"). Keep date field as start date.
- `testimonials`: 3 entries from homepage (Allan Benette Uy Matiao / Co-Founder CEO Tripket PH; Michael Rodriguez / Project Lead Victoria Commercial; Nanet Bacla-an / HR Tripket PH). Use avatar URLs from source. Author `avatar` uses `createImageSchema()` (`src` + `alt`) — drop `srcset` (not in schema).
- `blog.title`: `Latest Articles`; `blog.description`: `Thoughts on building software, lessons from production, and the tech I use`.
- `faq.title`/`faq.description`: from homepage FAQ header. `faq.categories`: **4 categories** matching source tabs:
  1. `Skills & Tech Stack` (1 Q: "What technologies do you work with?")
  2. `Experience & Projects` — source had no listed Q under this tab on scrape; **ask user or reuse 1 sensible Q** (Open Question).
  3. `AI, Self-Hosting & Tinkering` — 1 Q from source: "What tools do you use day-to-day?" (mapped here) — confirm placement.
  4. `Working With Me` — source had no listed Q; **reuse or ask** (Open Question).
  - Only the "What technologies..." and "What tools..." answers were fully scraped. Other answers must be written or pulled from the live `/about` page (which has fuller content). Recommend deriving FAQ answers from `/about` sections.

### 4. Projects listing — `content/projects.yml`
- `title`: `Engineering Solutions, Building Systems.`
- `description`: the projects-page intro paragraph.
- `links`: `Let's talk` (color `neutral`, `mailto:`); `Email me` (`mailto:`).

### 5. Projects items — delete old 4, create 7 from `/projects`
Delete: `ecotrack.yml`, `wavelength-music.yml`, `internal-developer-hub.yml`, `bloom-finance.yml`.
Create (schema: `title`, `description`, `image`, `url`, `tags[]`, `date`):
1. `miss-silliman-tabulation-2019.yml` — Laravel/PHP/MySQL — 2019-01-01 — image from source.
2. `personal-portfolio.yml` — Nuxt 4/Nuxt UI/TypeScript — 2025-01-01 — url `https://portfolio.softwarelabs.dev`.
3. `tripket-ph-dashboards.yml` — Vue.js/Nuxt.js/TypeScript — 2024-01-01 — url `https://tripket.ph`.
4. `tripket-ph-mobile.yml` — Flutter/Dart/Firebase — 2023-01-01.
5. `game-dev-unity.yml` — Unity/C#/Azure — 2020-01-01.
6. `victoria-commercial-inventory.yml` — Angular/Flutter/Full-Stack — 2021-01-01.
- Use exact image URLs + descriptions from source scrape. Use year start as `date`.

### 6. Blog listing — `content/blog.yml`
- `title`: `Latest Articles`
- `description`: `Thoughts on building software, lessons from production, and the tools and frameworks I work with.`

### 7. Blog posts — delete old 4, create 4 from `/blog`
Delete: existing 4 `.md` files. Create (frontmatter schema: `title`, `description`, `date`, `image`, `minRead`, `author{name,description?,avatar}`):
1. `deploying-nuxt-to-production-lessons.md` — 2025-04-23 — minRead 6.
2. `why-i-chose-vue-and-nuxt-for-production.md` — 2025-03-15 — minRead 5.
3. `from-web-to-mobile-flutter-journey.md` — 2025-02-20 — minRead 7.
4. `building-realtime-tabulation-with-laravel.md` — 2025-01-28 — minRead 8.
- `author.name`: `Hamuel Palallos`; `author.description`: `Senior Software Engineer`; `author.avatar`: reuse the `app.config.ts` picture URL + alt.
- Body: source scrape only gives the one-line descriptions (no full body). **Write a short placeholder body** (2–3 paragraphs expanding on the description) OR ask user to supply full bodies (Open Question). Recommend: write concise placeholder bodies clearly marked as draft, so the site renders.

### 8. Speaking — `content/speaking.yml`
Replace with source data. `links`: `Invite me to speak` (`mailto:`, size `md`). `events[]`:
- Conference: `Shipping Full-Stack Products as a Solo Developer` / DevFest Dumaguete 2023, Dumaguete City / 2023-06-01.
- Live talks (5):
  1. `Building Scalable Web Applications with Vue.js and Nuxt.js` / Silliman University Guest Lecture / 2024-08-01.
  2. `Introduction to Cross-Platform Mobile Development with Flutter` / Silliman University Guest Lecture / 2024-03-01.
  3. `Frontend Architecture Patterns for Startup Products` / Internal Workshop @ Tripket PH / 2024-06-01.
  4. `Firebase and Cloud Firestore: Real-Time Data for Web and Mobile` / Dumaguete Tech Meetup / 2023-11-01.
  5. `Database Design and Backend Architecture with Laravel` / Silliman University Guest Lecture / 2023-09-01.
- Podcasts: source lists the section header but **no podcast entries** on scrape → omit `Podcast` events (or add none). Confirm none exist (Open Question).

### 9. About — `content/about.yml`
- `title`: `About Me`
- `description`: `A Senior Software Engineer from the Philippines who's been building production software since 2018.`
- `content` (markdown string): port the full `/about` body verbatim, preserving headings (`### Where I've Worked`, `### How I Work`, `### My Tech Stack`, `### AI & Intelligent Tooling`, `### Self-Hosted Infrastructure`, `### Always Exploring`) and bullet lists. Keep the trailing `get in touch` mailto link.
- `images[]`:
  1. Development workspace (Unsplash URL from source) — alt `Development workspace`.
  2. Tokyo cityscape (Unsplash URL from source) — alt `Tokyo cityscape`.

### 10. NEW: CV page (local repo styling pattern)
Two parts:

**a. Content** — add to `pages` collection source list in `content.config.ts`:
```ts
source: [
  { include: 'projects.yml' },
  { include: 'blog.yml' },
  { include: 'cv.yml' }   // NEW
]
```
Create `content/cv.yml`:
```yml
title: Curriculum Vitae
description: My professional experience, education, and skills at a glance.
links:
  - label: Download PDF
    icon: i-lucide-download
    to: /cv.pdf
    target: _blank
    color: neutral
```
(Mirrors `projects.yml`/`blog.yml` shape since `pages` schema = `{ links: ButtonSchema[] }`. PDF asset is user-supplied later — link points to `/cv.pdf`; treat as optional.)

**b. Page** — `app/pages/cv.vue`. Follow the existing page pattern (see `app/pages/projects.vue` / `blog/index.vue` for the repo's hero+container style). Skeleton:
```vue
<script setup lang="ts">
const { data: page } = await useAsyncData('cv-page', () => queryCollection('pages').path('/cv').first())

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

useSeoMeta({
  title: page.value.title,
  description: page.value.description
})
</script>

<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="page.title" :description="page.description" :links="page.links" />
    <!-- CV sections here: experience timeline, education, skills. Use existing
         UPageCard / UTimeline / UContainer components consistent with about/projects pages. -->
  </UContainer>
</template>
```
Match the visual treatment used on `/about` and `/projects` (page hero + container). Exact inner sections can be a minimal placeholder (experience items reusing the `index` experience shape, plus an education block + skills list) — user can expand later. Keep the file lint-clean (2-space indent, no trailing commas, `1tbs` braces).

### 11. SEO meta defaults — `app/app.vue`
- `useSeoMeta.titleTemplate`: → `%s - Hamuel Palallos`.

### 12. OG / site URL — `.env` / build
- `NUXT_PUBLIC_SITE_URL` should be `https://portfolio.softwarelabs.dev` for OG image absolute URLs during `nuxt generate`. (Check `.env.example`; do not commit a real `.env`.)

---

## Validation
Run in order (bun only):
1. `bun install` (regenerates `.nuxt/` types after `content.config.ts` change)
2. `bun run lint`
3. `bun run typecheck`
4. `bun run build` (prerender crawls links — `/cv` must resolve; broken links fail here)

Manual: `bun run dev` → verify `/`, `/projects`, `/about`, `/speaking`, `/blog`, `/cv` render with Hamuel's data.

---

## Risks / Gotchas
- **Schema strictness**: `content.config.ts` Zod schemas will fail the build if any required field is missing or wrong type (esp. `projects/*.yml` `date`, `blog` `author.avatar`, `speaking` `category` enum ∈ `['Live talk','Podcast','Conference']`). Note source uses "Live talks" (plural) — must be singular `Live talk`.
- **Date fields are `z.date()`**, not ranges — encode ranges in display text, single ISO date in field.
- **Prerender crawls links**: any nav link (including new `/cv`) must resolve to a page or build fails.
- **Cloudflare email protection** on source obscures the real email — must get actual address from user.
- **`nuxt.config.ts` dev-server/HMR config** is environment-specific — do NOT touch it.
- **OG images** (`zeroRuntime`): CV page should define a route for OG if desired, but not required for MVP.

## Open Questions (must resolve before/early in implementation)
1. **Email address** — source obfuscates it. Need Hamuel's actual email (e.g. `hamuelpalallos@gmail.com`?). Used in `app.config.ts`, footer, hero, contact links.
2. **Profile picture** — source uses local `/profile.jpg`. Keep current Unsplash placeholder, or supply a real URL/asset? (`/public/profile.jpg`?)
3. **Blog post bodies** — source only exposes summaries. Write concise draft bodies, or will user supply full content?
4. **FAQ categories 2 & 4 ("Experience & Projects", "Working With Me")** — no answers scraped. Derive from `/about`, or user supplies?
5. **Podcasts** — source lists the section but no entries appeared. Confirm none exist; if some do, supply list.
6. **CV page depth** — minimal placeholder sections vs. full resume content. Who supplies the detailed CV content/PDF?

## Out of scope
- Touching `nuxt.config.ts` dev/HMR config.
- Changing `content.config.ts` field types (only adding `cv.yml` to `pages` source list).
- Adding tests (project has no test framework).
- Switching package managers (bun only).
