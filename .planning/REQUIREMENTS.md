# Requirements: Blog Migration (Next.js → Astro + SolidJS)

**Defined:** 2026-03-27
**Core Value:** Ship a faster, leaner blog that preserves all existing content and features while moving to Astro + SolidJS.

## v1 Requirements

### Foundation

- [x] **FOUND-01**: Astro 6 project scaffold with TypeScript 6, Vite 7, Node 22+
- [x] **FOUND-02**: Tailwind CSS 4.2.2 configured via @tailwindcss/vite plugin
- [x] **FOUND-03**: SolidJS integration (@astrojs/solid-js 6.0.0) enabled for islands
- [x] **FOUND-04**: Site config (name, nav, socials, author) ported to Astro
- [x] **FOUND-05**: Path aliases (@/* → ./src/*) configured in tsconfig

### Content

- [x] **CONT-01**: All existing MDX blog posts render correctly in Astro content collections
- [x] **CONT-02**: Blog listing page displays all posts in grid with cards
- [x] **CONT-03**: Blog detail page renders MDX content at /blogs/[slug]
- [x] **CONT-04**: Blog slugs match current URL structure (no broken links)
- [x] **CONT-05**: Frontmatter metadata (title, date, tags, logo) parsed via Zod schema
- [x] **CONT-06**: Date formatting and display matches current behavior
- [x] **CONT-07**: Blog tags displayed on cards and detail pages

### MDX Components

- [x] **MDX-01**: Custom heading components with proper styling
- [x] **MDX-02**: Code blocks with Shiki syntax highlighting (build-time, zero JS)
- [x] **MDX-03**: Dual-theme syntax highlighting (light/dark via CSS variables)
- [x] **MDX-04**: Copy-to-clipboard button on code blocks
- [x] **MDX-05**: Custom image component replacing next/image imports in MDX
- [x] **MDX-06**: Custom link, table, and blockquote components
- [x] **MDX-07**: Anchor links on headings (hover-reveal, copy URL)

### Layout & Navigation

- [x] **NAV-01**: Sticky header with logo and navigation links
- [ ] **NAV-02**: Mobile menu/drawer as SolidJS island (replaces Radix Sheet)
- [x] **NAV-03**: Footer with consistent styling
- [x] **NAV-04**: Responsive layout across all breakpoints

### Pages

- [x] **PAGE-01**: Home page with hero section and 3 latest blog posts
- [x] **PAGE-02**: About page with hero section
- [x] **PAGE-03**: Blogs listing page (/blogs)
- [x] **PAGE-04**: Blog detail page (/blogs/[slug])

### Theme

- [x] **THEME-01**: Dark/light theme toggle as SolidJS island
- [x] **THEME-02**: Theme preference persisted to localStorage
- [x] **THEME-03**: No FOUC — inline blocking script sets theme before first paint

### SEO

- [x] **SEO-01**: Per-page metadata (title, description, canonical URL)
- [x] **SEO-02**: Open Graph tags (og:title, og:description, og:image, article type)
- [x] **SEO-03**: Sitemap XML generated via @astrojs/sitemap

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
| FOUND-01 | Phase 1 | Complete |
| FOUND-02 | Phase 1 | Complete |
| FOUND-03 | Phase 1 | Complete |
| FOUND-04 | Phase 1 | Complete |
| FOUND-05 | Phase 1 | Complete |
| CONT-01 | Phase 1 | Complete |
| CONT-04 | Phase 1 | Complete |
| CONT-05 | Phase 1 | Complete |
| CONT-02 | Phase 2 | Complete |
| CONT-03 | Phase 2 | Complete |
| CONT-06 | Phase 2 | Complete |
| CONT-07 | Phase 2 | Complete |
| PAGE-01 | Phase 2 | Complete |
| PAGE-02 | Phase 2 | Complete |
| PAGE-03 | Phase 2 | Complete |
| PAGE-04 | Phase 2 | Complete |
| NAV-01 | Phase 2 | Complete |
| NAV-03 | Phase 2 | Complete |
| NAV-04 | Phase 2 | Complete |
| SEO-01 | Phase 2 | Complete |
| SEO-02 | Phase 2 | Complete |
| SEO-03 | Phase 2 | Complete |
| MDX-01 | Phase 3 | Complete |
| MDX-02 | Phase 3 | Complete |
| MDX-03 | Phase 3 | Complete |
| MDX-04 | Phase 3 | Complete |
| MDX-05 | Phase 3 | Complete |
| MDX-06 | Phase 3 | Complete |
| MDX-07 | Phase 3 | Complete |
| THEME-01 | Phase 4 | Complete |
| THEME-02 | Phase 4 | Complete |
| THEME-03 | Phase 4 | Complete |
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
