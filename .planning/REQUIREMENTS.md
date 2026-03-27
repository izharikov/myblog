# Requirements: Blog Migration (Next.js → Astro + SolidJS)

**Defined:** 2026-03-27
**Core Value:** Ship a faster, leaner blog that preserves all existing content and features while moving to Astro + SolidJS.

## v1 Requirements

### Foundation

- [ ] **FOUND-01**: Astro 6 project scaffold with TypeScript 6, Vite 7, Node 22+
- [ ] **FOUND-02**: Tailwind CSS 4.2.2 configured via @tailwindcss/vite plugin
- [ ] **FOUND-03**: SolidJS integration (@astrojs/solid-js 6.0.0) enabled for islands
- [ ] **FOUND-04**: Site config (name, nav, socials, author) ported to Astro
- [ ] **FOUND-05**: Path aliases (@/* → ./src/*) configured in tsconfig

### Content

- [ ] **CONT-01**: All existing MDX blog posts render correctly in Astro content collections
- [ ] **CONT-02**: Blog listing page displays all posts in grid with cards
- [ ] **CONT-03**: Blog detail page renders MDX content at /blogs/[slug]
- [ ] **CONT-04**: Blog slugs match current URL structure (no broken links)
- [ ] **CONT-05**: Frontmatter metadata (title, date, tags, logo) parsed via Zod schema
- [ ] **CONT-06**: Date formatting and display matches current behavior
- [ ] **CONT-07**: Blog tags displayed on cards and detail pages

### MDX Components

- [ ] **MDX-01**: Custom heading components with proper styling
- [ ] **MDX-02**: Code blocks with Shiki syntax highlighting (build-time, zero JS)
- [ ] **MDX-03**: Dual-theme syntax highlighting (light/dark via CSS variables)
- [ ] **MDX-04**: Copy-to-clipboard button on code blocks
- [ ] **MDX-05**: Custom image component replacing next/image imports in MDX
- [ ] **MDX-06**: Custom link, table, and blockquote components
- [ ] **MDX-07**: Anchor links on headings (hover-reveal, copy URL)

### Layout & Navigation

- [ ] **NAV-01**: Sticky header with logo and navigation links
- [ ] **NAV-02**: Mobile menu/drawer as SolidJS island (replaces Radix Sheet)
- [ ] **NAV-03**: Footer with consistent styling
- [ ] **NAV-04**: Responsive layout across all breakpoints

### Pages

- [ ] **PAGE-01**: Home page with hero section and 3 latest blog posts
- [ ] **PAGE-02**: About page with hero section
- [ ] **PAGE-03**: Blogs listing page (/blogs)
- [ ] **PAGE-04**: Blog detail page (/blogs/[slug])

### Theme

- [ ] **THEME-01**: Dark/light theme toggle as SolidJS island
- [ ] **THEME-02**: Theme preference persisted to localStorage
- [ ] **THEME-03**: No FOUC — inline blocking script sets theme before first paint

### SEO

- [ ] **SEO-01**: Per-page metadata (title, description, canonical URL)
- [ ] **SEO-02**: Open Graph tags (og:title, og:description, og:image, article type)
- [ ] **SEO-03**: Sitemap XML generated via @astrojs/sitemap

### Deployment

- [ ] **DEPLOY-01**: Builds and deploys to Cloudflare Pages via @astrojs/cloudflare 13.x
- [ ] **DEPLOY-02**: All pages render correctly in production
- [ ] **DEPLOY-03**: Image optimization works in both dev and production

### Performance

- [ ] **PERF-01**: Smaller total bundle size than current Next.js build
- [ ] **PERF-02**: Lighthouse performance score >= 95

## v2 Requirements

### SEO Enhancements

- **SEO-04**: JSON-LD structured data (Person on home, BlogPosting on posts)
- **SEO-05**: LLMs.txt route for AI-friendly content discovery

### Content Enhancements

- **CONT-08**: "View article as markdown" route at /blogs/[slug].md

### Redesign (Milestone 2)

- **DESIGN-01**: Full visual redesign using Impeccable AI design skill
- **DESIGN-02**: New component library with Tailwind CSS

## Out of Scope

| Feature | Reason |
|---------|--------|
| CMS / admin panel | Static MDX workflow stays |
| Authentication / user accounts | Static site, no users |
| RSS feed | Not currently implemented |
| Comments system | Not currently implemented |
| Search functionality | Not currently implemented |
| SolidJS for all components | Only interactive parts use SolidJS |
| Animation library (motion) | Evaluate during migration; may not need a library |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 | Pending |
| FOUND-02 | Phase 1 | Pending |
| FOUND-03 | Phase 1 | Pending |
| FOUND-04 | Phase 1 | Pending |
| FOUND-05 | Phase 1 | Pending |
| CONT-01 | Phase 1 | Pending |
| CONT-04 | Phase 1 | Pending |
| CONT-05 | Phase 1 | Pending |
| CONT-02 | Phase 2 | Pending |
| CONT-03 | Phase 2 | Pending |
| CONT-06 | Phase 2 | Pending |
| CONT-07 | Phase 2 | Pending |
| PAGE-01 | Phase 2 | Pending |
| PAGE-02 | Phase 2 | Pending |
| PAGE-03 | Phase 2 | Pending |
| PAGE-04 | Phase 2 | Pending |
| NAV-01 | Phase 2 | Pending |
| NAV-03 | Phase 2 | Pending |
| NAV-04 | Phase 2 | Pending |
| SEO-01 | Phase 2 | Pending |
| SEO-02 | Phase 2 | Pending |
| SEO-03 | Phase 2 | Pending |
| MDX-01 | Phase 3 | Pending |
| MDX-02 | Phase 3 | Pending |
| MDX-03 | Phase 3 | Pending |
| MDX-04 | Phase 3 | Pending |
| MDX-05 | Phase 3 | Pending |
| MDX-06 | Phase 3 | Pending |
| MDX-07 | Phase 3 | Pending |
| THEME-01 | Phase 4 | Pending |
| THEME-02 | Phase 4 | Pending |
| THEME-03 | Phase 4 | Pending |
| NAV-02 | Phase 4 | Pending |
| DEPLOY-01 | Phase 5 | Pending |
| DEPLOY-02 | Phase 5 | Pending |
| DEPLOY-03 | Phase 5 | Pending |
| PERF-01 | Phase 5 | Pending |
| PERF-02 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 30 total
- Mapped to phases: 30
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-27*
*Last updated: 2026-03-27 after roadmap creation*
