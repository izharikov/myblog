---
phase: 02-static-pages-layouts
plan: "01"
subsystem: css-tokens-layouts
tags: [tailwind, css-tokens, layouts, seo, json-ld, date-utils]
dependency_graph:
  requires: []
  provides: [css-design-tokens, base-layout, blog-layout, date-utils]
  affects: [all pages in phase 02, all blog posts in phase 03]
tech_stack:
  added: [schema-dts@2.0.0]
  patterns: [astro-layouts, tailwind-v4-@theme-inline, oklch-colors, json-ld-structured-data]
key_files:
  created:
    - src/lib/date.ts
    - src/layouts/BaseLayout.astro
    - src/layouts/BlogLayout.astro
  modified:
    - src/styles/globals.css
    - package.json
    - package-lock.json
decisions:
  - "Installed schema-dts with --legacy-peer-deps due to pre-existing typescript@6 vs @astrojs/check peer conflict (unrelated to this plan)"
  - "Added is:inline to JSON-LD script tag in BlogLayout per Astro 6 guidance to suppress astro(4000) hint"
  - "BaseLayout uses single default slot only; Header/Footer will be added directly in Plan 02 once those components exist"
  - "ogImage in BaseLayout resolved relative to siteConfig.site only if provided; canonical defaults to current URL"
metrics:
  duration: "3m 17s"
  completed_date: "2026-03-27"
  tasks_completed: 2
  files_modified: 6
---

# Phase 02 Plan 01: CSS Tokens, Date Utilities, and Layouts Summary

**One-liner:** Tailwind v4 @theme inline design tokens with OKLCH colors, parseDate/formatDate utilities, and BaseLayout/BlogLayout Astro components with full SEO head and JSON-LD structured data.

## Tasks Completed

| Task | Description | Commit | Files |
|------|-------------|--------|-------|
| 1 | Port Tailwind v4 CSS design tokens and create date utilities | e16da7d | src/styles/globals.css, src/lib/date.ts |
| 2 | Install schema-dts and create BaseLayout + BlogLayout | d1a83bc | src/layouts/BaseLayout.astro, src/layouts/BlogLayout.astro, package.json, package-lock.json |

## What Was Built

### src/styles/globals.css
- Added `@custom-variant dark (&:is(.dark *))` for dark mode targeting
- Added `@theme inline` block mapping 30+ Tailwind color utilities to CSS custom properties
- Replaced minimal `:root` block with full OKLCH light mode color palette (background, foreground, card, primary, secondary, muted, accent, destructive, border, input, ring, chart 1-5, sidebar variants)
- Added `.dark` block with full OKLCH dark mode overrides
- Added `@layer base` applying `border-border outline-ring/50` globally and `bg-background text-foreground` to body

### src/lib/date.ts
- `parseDate(dateString: string): Date` — parses DD.MM.YYYY format (e.g., "20.01.2025") to Date object, matching original blogs.ts behavior
- `formatDate(date: Date): string` — formats Date to "Jan 20, 2025" using en-US locale

### src/layouts/BaseLayout.astro
- Full HTML shell with charset, viewport, favicon link
- SEO head: title, meta description, canonical URL (defaults to current path), og:title, og:description, og:url, og:type, og:image (optional), Astro generator meta
- Props: title, description, canonicalUrl (optional), ogImage (optional), ogType (default: 'website')
- Imports globals.css for Tailwind token cascade
- Body applies min-h-screen bg-background text-foreground font-sans antialiased

### src/layouts/BlogLayout.astro
- Extends BaseLayout with ogType="article" and ogImage from post logo
- Calls `generateBlogJsonLd` with parsed date and full BlogPost shape
- Injects JSON-LD BlogPosting as `<script is:inline type="application/ld+json">`
- Article markup: h1 title, `<time>` element with ISO datetime, tag badges with secondary color tokens
- Prose container for MDX slot content

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing critical functionality] Added `is:inline` to JSON-LD script tag**
- **Found during:** Task 2 verification (astro check)
- **Issue:** Astro 6 emits astro(4000) hint when `<script>` has attributes without `is:inline` directive; script is treated as inline anyway but hint was surfaced
- **Fix:** Added `is:inline` attribute to `<script type="application/ld+json">` tag in BlogLayout.astro
- **Files modified:** src/layouts/BlogLayout.astro
- **Commit:** d1a83bc

**2. [Rule 3 - Blocking issue] Used --legacy-peer-deps for schema-dts install**
- **Found during:** Task 2 npm install
- **Issue:** Pre-existing peer conflict — typescript@6.0.2 installed but @astrojs/check@0.9.8 requires typescript@^5.0.0. This conflict was present before this plan and blocked schema-dts installation.
- **Fix:** Used `npm install schema-dts --legacy-peer-deps` to bypass the pre-existing conflict (schema-dts itself has no peer conflict)
- **Files modified:** package.json, package-lock.json
- **Commit:** d1a83bc

## Known Stubs

None — all layouts wire real data from props and siteConfig. No placeholder content or empty data sources.

## Verification Results

- `npx astro check`: 0 errors, 0 warnings, 9 hints (all pre-existing)
- `grep "@theme inline" src/styles/globals.css`: match found
- `grep "og:title" src/layouts/BaseLayout.astro`: match found
- `grep "application/ld+json" src/layouts/BlogLayout.astro`: match found
- `src/lib/date.ts` exports parseDate and formatDate

## Self-Check: PASSED

- src/styles/globals.css — FOUND
- src/lib/date.ts — FOUND
- src/layouts/BaseLayout.astro — FOUND
- src/layouts/BlogLayout.astro — FOUND
- Commit e16da7d — FOUND
- Commit d1a83bc — FOUND
