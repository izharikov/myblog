# Blog Migration: Next.js → Astro + SolidJS

## What This Is

A full rewrite of an existing personal tech blog from Next.js + React to Astro + SolidJS. The blog serves MDX-based articles with syntax highlighting, SEO metadata, dark mode, and is deployed on Cloudflare. The migration aims to reduce bundle size and improve site performance by leveraging Astro's static-first architecture with SolidJS only for interactive components.

## Core Value

Ship a faster, leaner blog that preserves all existing content and features while moving to a modern Astro + SolidJS stack.

## Requirements

### Validated

- ✓ MDX blog posts with frontmatter metadata — existing
- ✓ Blog listing page with grid layout — existing
- ✓ Individual blog post pages with syntax highlighting — existing
- ✓ Dark/light theme toggle — existing
- ✓ SEO metadata and JSON-LD structured data — existing
- ✓ Sitemap generation — existing
- ✓ Responsive design — existing
- ✓ Cloudflare deployment — existing
- ✓ Image optimization — existing
- ✓ Navigation with mobile menu — existing
- ✓ About page — existing
- ✓ LLMs.txt route — existing
- ✓ Copy heading link functionality — existing

### Active

- [ ] Migrate all pages and routes to Astro
- [ ] Migrate interactive components (theme toggle, mobile menu, dialogs) to SolidJS
- [ ] Migrate MDX content pipeline to Astro's MDX integration
- [ ] Migrate Tailwind CSS v4 setup to Astro
- [ ] Migrate Cloudflare deployment (Astro Cloudflare adapter)
- [ ] Migrate image optimization to Astro's image handling
- [ ] Migrate SEO (sitemap, JSON-LD, metadata) to Astro equivalents
- [ ] Preserve all existing blog content without modification
- [ ] Achieve smaller bundle size than current Next.js build
- [ ] Maintain or improve Lighthouse performance scores

### Out of Scope

- Redesign / new visual identity — deferred to Milestone 2 (Impeccable + Tailwind redesign)
- New features beyond current functionality — migration only
- CMS or admin panel — static MDX workflow stays
- Authentication or user accounts — static site, no users
- RSS feed — not currently implemented, not adding now

## Context

- **Current stack:** Next.js 16, React 19, Tailwind CSS 4, MDX, deployed on Cloudflare Workers via OpenNext adapter
- **Target stack:** Astro, SolidJS (interactive only), Tailwind CSS 4, MDX, deployed on Cloudflare Pages via Astro Cloudflare adapter
- **Content:** ~10+ MDX blog posts in `blogs/` directory with frontmatter (title, date, tags, logo)
- **Build pipeline:** Blog manifest auto-generated from MDX files at build time
- **UI components:** Radix UI (dialog, dropdown, navigation menu), shadcn/ui, lucide icons, motion animations
- **Deployment:** Cloudflare Workers with R2 bucket for incremental cache
- **Motivation:** Try new tech, reduce bundle size, improve performance
- **Future milestone:** Redesign using Impeccable AI design skill + Tailwind CSS

## Constraints

- **Content preservation**: All existing MDX blog posts must work without content file modifications
- **URL parity**: All existing routes must be preserved (no broken links)
- **Deployment target**: Must remain on Cloudflare (Pages or Workers)
- **Styling**: Keep Tailwind CSS v4 — no style framework change
- **SolidJS scope**: Only for interactive components; static content rendered by Astro

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Full rewrite over incremental migration | Clean break, no hybrid complexity | — Pending |
| SolidJS for interactive parts only | Astro handles static content natively, SolidJS adds unnecessary weight for static components | — Pending |
| Keep Tailwind CSS v4 | Already in use, no reason to change styling approach during migration | — Pending |
| Redesign deferred to Milestone 2 | Keep migration scope focused on stack change, not visual changes | — Pending |
| Astro Cloudflare adapter over OpenNext | Native Astro integration, simpler than OpenNext shim | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-27 after initialization*
