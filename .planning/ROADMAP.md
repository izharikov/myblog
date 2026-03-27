# Roadmap: Blog Migration (Next.js → Astro + SolidJS)

## Overview

Five phases transform an existing Next.js + React blog into an Astro + SolidJS site deployed on Cloudflare Pages. The migration is strictly feature-preserving: no redesign, no new features. The critical dependency chain is content pipeline → static pages → MDX components → interactive islands → deployment. The MDX frontmatter format mismatch (JS exports vs YAML) and all React/Next.js dependencies must be resolved before any page can render; this work is folded into Phase 1 as mandatory prerequisites.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation & Content Pipeline** - Delete Next.js/React files, Astro scaffold, Tailwind v4, SolidJS integration, content collections, MDX frontmatter conversion, URL-safe slugs (completed 2026-03-27)
- [x] **Phase 2: Static Pages & Layouts** - All routes rendering (home, about, /blogs, /blogs/[slug]); BaseLayout, BlogLayout; SEO metadata; sitemap; image handling (completed 2026-03-27)
- [x] **Phase 3: MDX Components** - Custom heading, code block (Shiki dual-theme), copy-to-clipboard, custom image/link/table/blockquote, anchor links (completed 2026-03-27)
- [ ] **Phase 4: SolidJS Islands** - ThemeToggle island (FOUC-free), mobile menu/drawer island; dark mode wiring across all Tailwind dark: variants
- [ ] **Phase 5: Deployment & Validation** - Cloudflare Pages adapter wired; wrangler restructured; production build verified; Lighthouse >= 95; bundle smaller than Next.js

## Phase Details

### Phase 1: Foundation & Content Pipeline
**Goal**: Clean out Next.js/React, scaffold Astro, and get content collections working — all MDX posts discoverable with correct slugs, Tailwind styles applied, TypeScript compiling, SolidJS integration enabled
**Strategy**: Replace in-place — delete all Next.js/React files (src/app/, next.config.ts, package.json deps, etc.), scaffold Astro at project root. Preserve blogs/ directory and static assets. Working on `feature/migration` branch; `main` stays untouched.
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04, FOUND-05, CONT-01, CONT-04, CONT-05
**Success Criteria** (what must be TRUE):
  1. No Next.js or React files/dependencies remain in the project
  2. `npx astro dev` starts without errors and serves a page at localhost:4321
  3. All existing MDX blog posts are returned by `getCollection('blog')` with correct title, date, tags, and logo from YAML frontmatter
  4. Each post's slug matches its current URL path (no numeric prefix, no broken links)
  5. Tailwind utility classes apply to a test element in the browser (e.g., a colored heading is visually correct)
  6. A SolidJS component renders in an Astro page without build error (island smoke test)
**Plans**: 3 plans
Plans:
- [x] 01-01-PLAN.md — Convert all 9 MDX blog posts from export const meta to YAML frontmatter
- [x] 01-02-PLAN.md — Delete Next.js files; install Astro 6 scaffold (package.json, astro.config.mjs, tsconfig.json, globals.css, placeholder page)
- [x] 01-03-PLAN.md — Wire content collections (src/content.config.ts), verify site.ts, smoke-test all 9 posts via /test-collections

### Phase 2: Static Pages & Layouts
**Goal**: Every page and route exists, renders correct HTML, and has proper SEO metadata — with no React or Next.js dependencies remaining
**Depends on**: Phase 1
**Requirements**: CONT-02, CONT-03, CONT-06, CONT-07, PAGE-01, PAGE-02, PAGE-03, PAGE-04, NAV-01, NAV-03, NAV-04, SEO-01, SEO-02, SEO-03
**Success Criteria** (what must be TRUE):
  1. All four pages (home, /about, /blogs, /blogs/[slug]) load in the browser with correct content and layout
  2. The home page shows the 3 most recent posts; /blogs shows all posts in grid with cards including tags and dates
  3. `<head>` on each page contains correct title, description, canonical URL, and Open Graph tags
  4. `sitemap.xml` is accessible at /sitemap-index.xml and lists all blog post URLs
  5. Blog images render without broken image errors in both dev and preview modes
**Plans**: 3 plans
Plans:
- [x] 02-01-PLAN.md — Port Tailwind v4 CSS tokens, create date utilities, build BaseLayout + BlogLayout
- [x] 02-02-PLAN.md — Create static components (Header, Footer, HeroSection, BlogCard, BlogGrid) and wire into BaseLayout
- [x] 02-03-PLAN.md — Create all four pages (home, about, blogs, blog detail), delete test page, verify in browser
**UI hint**: yes

### Phase 3: MDX Components
**Goal**: Blog post content renders with full visual fidelity — syntax highlighting, heading anchors, copy buttons, and custom components all working without any client-side JS from React
**Depends on**: Phase 2
**Requirements**: MDX-01, MDX-02, MDX-03, MDX-04, MDX-05, MDX-06, MDX-07
**Success Criteria** (what must be TRUE):
  1. Code blocks in blog posts display with Shiki syntax highlighting at build time (no runtime JS required)
  2. Code blocks show the correct theme in light mode and switch to the correct theme in dark mode using CSS variables only (no JS re-render)
  3. A code block's copy button copies the code to the clipboard when clicked
  4. Hovering a heading reveals an anchor icon; clicking it copies the URL with the correct fragment ID (matching current site's slug format)
  5. All custom MDX components (image, link, table, blockquote) render without import errors in all 9+ MDX posts
**Plans**: 2 plans
Plans:
- [x] 03-01-PLAN.md — Configure Shiki dual-theme, create heading components (H2-H6) with anchor links, CodeBlock with copy button, InlineCode
- [x] 03-02-PLAN.md — Create simple MDX components (Img, Link, Table, Blockquote), wire all components into [slug].astro, add prose CSS, verify in browser
**UI hint**: yes

### Phase 4: SolidJS Islands
**Goal**: Interactive UI works — theme toggles persist, mobile menu opens and closes, and dark mode applies instantly on every page load without a flash of light mode
**Depends on**: Phase 3
**Requirements**: THEME-01, THEME-02, THEME-03, NAV-02
**Success Criteria** (what must be TRUE):
  1. Clicking the theme toggle switches the site between light and dark mode; the choice persists after a full page reload
  2. Reloading the page in dark mode shows dark styles immediately with no visible white flash before JavaScript executes
  3. The mobile menu opens and closes on narrow viewports; pressing Escape or clicking the overlay closes it
  4. All Tailwind `dark:` variant styles apply correctly in dark mode across all pages
**Plans**: 2 plans
Plans:
- [ ] 04-01-PLAN.md — Fix Tailwind dark variant, add FOUC-prevention blocking script to BaseLayout, create ThemeToggle SolidJS island
- [ ] 04-02-PLAN.md — Create MobileMenu SolidJS island, wire both islands into Header.astro, verify in browser
**UI hint**: yes

### Phase 5: Deployment & Validation
**Goal**: The site builds for production, deploys to Cloudflare Pages, and delivers measurably better performance than the current Next.js deployment
**Depends on**: Phase 4
**Requirements**: DEPLOY-01, DEPLOY-02, DEPLOY-03, PERF-01, PERF-02
**Success Criteria** (what must be TRUE):
  1. `wrangler pages deploy` succeeds and the site is accessible at the production Cloudflare Pages URL
  2. All page routes return HTTP 200 in production; no 404s on any URL that currently exists on the live site
  3. Image optimization (Astro `<Image>`) works in production (no broken images, correct dimensions served)
  4. Lighthouse performance score is >= 95 on the blog post detail page
  5. Total JS bundle shipped to the browser is smaller than the current Next.js build output
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Content Pipeline | 3/3 | Complete   | 2026-03-27 |
| 2. Static Pages & Layouts | 3/3 | Complete    | 2026-03-27 |
| 3. MDX Components | 1/2 | Complete    | 2026-03-27 |
| 4. SolidJS Islands | 0/2 | Not started | - |
| 5. Deployment & Validation | 0/? | Not started | - |
