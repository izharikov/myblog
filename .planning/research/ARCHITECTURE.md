# Architecture Patterns: Astro + SolidJS Blog

**Domain:** Personal tech blog — static content-first, islands-based interactivity
**Researched:** 2026-03-27
**Overall Confidence:** MEDIUM
**Note:** Context7, WebSearch, and WebFetch were unavailable during this session. All findings are derived from the existing codebase analysis (HIGH confidence) and training-data knowledge of Astro and SolidJS (MEDIUM confidence, flagged per claim). Validate flagged sections against official docs before finalizing implementation.

---

## How This Maps: Current Architecture vs Astro

### Migration Translation Table

| Next.js Concept | Astro Equivalent | Confidence | Notes |
|-----------------|-----------------|------------|-------|
| `src/app/` (App Router pages) | `src/pages/` (file-based routing) | HIGH | Astro uses `.astro` page files; same flat directory-to-URL mapping |
| `src/app/layout.tsx` | `src/layouts/BaseLayout.astro` | HIGH | Astro layouts wrap pages via `<slot />` |
| `src/app/blogs/[slug]/page.tsx` | `src/pages/blogs/[slug].astro` | HIGH | Dynamic segments use same `[param]` syntax |
| `src/app/(seo)/sitemap.ts` | `@astrojs/sitemap` integration + endpoint | MEDIUM | Astro has a first-party sitemap integration; custom endpoint for `llms.txt` stays |
| `src/data/blog-manifest.ts` (generated) | Astro Content Collections (`src/content/blog/`) | HIGH | Collections replace the hand-rolled manifest entirely — no generation script needed |
| `scripts/generate-blog-manifest.mjs` | Deleted — replaced by content collections | HIGH | Collections query frontmatter natively at build time |
| `src/lib/blogs.ts` (getAllBlogs, getLatestBlogs) | `getCollection('blog')` + thin helpers | HIGH | Collections return typed entries; thin wrapper functions remain useful for sorting/slicing |
| `src/components/` (React) | `src/components/` (Astro + SolidJS mixed) | HIGH | Static components become `.astro`; interactive become `.tsx` (SolidJS) |
| `"use client"` directive | `client:*` directive on component | HIGH | `<ThemeToggle client:load />` instead of `"use client"` at top of file |
| `next/image` | `astro:assets` (`<Image />`) | HIGH | Drop-in replacement with similar API; custom Cloudflare loader requires adapter config |
| `next-themes` (ThemeProvider) | SolidJS signal + localStorage in island | MEDIUM | No Astro-native theme library; pattern is a SolidJS island that writes class to `<html>` |
| `mdx-components.tsx` global registry | `src/components/mdx/` + `remarkPlugins` | MEDIUM | Astro MDX uses `components` prop per-page or a global `src/content.config.ts` mapping |
| `image-loader.ts` (Cloudflare) | Astro Cloudflare adapter image service | MEDIUM | Adapter provides Cloudflare Images service natively; may not need custom loader |

---

## Recommended Architecture

### System Layers (Astro)

```
┌─────────────────────────────────────────────────────────┐
│  Pages Layer  (src/pages/*.astro)                       │
│  - Static HTML assembly                                 │
│  - No JavaScript by default                             │
│  - Pulls data from Content Collections                  │
│  - Composes Layout + Astro components + SolidJS islands │
└───────────────┬─────────────────────────────────────────┘
                │ slot / props
┌───────────────▼─────────────────────────────────────────┐
│  Layout Layer  (src/layouts/BaseLayout.astro)           │
│  - HTML shell (head, fonts, meta)                       │
│  - <Header /> island placed here                        │
│  - <slot /> for page body                               │
│  - <Footer /> static Astro component                    │
└───────────────┬─────────────────────────────────────────┘
                │ props / slots
┌───────────────▼─────────────────────────────────────────┐
│  Component Layer  (src/components/)                     │
│  ├── .astro components — pure static, zero JS           │
│  │   BlogCard, BlogGrid, HeroSection, Footer, etc.      │
│  └── .tsx SolidJS islands — interactive, hydrated       │
│      Header (mobile menu), ThemeToggle                  │
└───────────────┬─────────────────────────────────────────┘
                │ getCollection()
┌───────────────▼─────────────────────────────────────────┐
│  Content Layer  (src/content/blog/*.mdx)                │
│  - MDX files with Zod-validated frontmatter schema      │
│  - Queried via Astro content collections API            │
│  - No generation script; Astro handles at build time    │
└─────────────────────────────────────────────────────────┘
                │ constants
┌───────────────▼─────────────────────────────────────────┐
│  Config Layer  (src/config/site.ts)                     │
│  - Unchanged from Next.js version                       │
│  - Imported by pages, layouts, JSON-LD helpers          │
└─────────────────────────────────────────────────────────┘
```

### Component Boundaries

| Component | Type | Responsibility | Communicates With |
|-----------|------|---------------|-------------------|
| `BaseLayout.astro` | Astro layout | HTML shell, `<head>` tags, fonts, global CSS | All pages via slot; Header island; Footer component |
| `BlogLayout.astro` | Astro layout | Extends BaseLayout with blog-specific head meta, JSON-LD | Blog detail pages |
| `Header.tsx` (SolidJS) | Island | Mobile menu open/close state, nav links | SolidJS signal for open state; reads site config |
| `ThemeToggle.tsx` (SolidJS) | Island | Toggle dark/light, persist to localStorage, set class on `<html>` | localStorage; no parent communication needed |
| `BlogGrid.astro` | Astro | Render grid of blog cards from array | Receives BlogPost[] as props; renders BlogCard |
| `BlogCard.astro` | Astro | Single blog post card (title, date, tags, image) | Receives BlogPost as props |
| `HeroSection.astro` | Astro | Profile/hero — pure static | Reads site config directly |
| `CodeBlock.astro` | Astro | Syntax-highlighted code (via Shiki, built into Astro) | MDX pipeline auto-applies via remark/rehype |
| `HeadingWithAnchor.astro` | Astro (or inline MDX component) | Heading with copy-link anchor | No parent; copies window.href via inline script |
| `Footer.astro` | Astro | Static footer links, copyright | Reads site config |

**Key boundary rule:** SolidJS islands are leaves in the component tree. Astro layouts and pages own slots around them; islands cannot contain Astro components. Data only flows in as props — islands do not query content collections directly.

---

## Data Flow

### Blog Post Rendering (Build Time)

```
blogs/*.mdx (source MDX files)
         │
         ▼ Astro content collections (build-time scan)
src/content/config.ts (Zod schema defines frontmatter shape)
         │ getCollection('blog') / getEntry('blog', slug)
         ▼
src/pages/blogs/[slug].astro
  - calls getStaticPaths() → returns all slugs
  - calls getEntry() per entry → typed frontmatter + render()
  - entry.render() → returns <Content /> MDX component
  - passes metadata to BlogLayout for <head> / JSON-LD
         │
         ▼
Static HTML + zero runtime JS (except islands)
Served from Cloudflare Pages edge
```

### Blog Listing Flow

```
src/pages/blogs/index.astro
  └── getCollection('blog')        // returns CollectionEntry<'blog'>[]
  └── sort by data.date descending  // thin helper or inline
  └── pass to <BlogGrid posts={posts} />
        └── BlogCard.astro per post  // pure template, no JS
```

### Content Collections vs Current Manifest

The current architecture runs `generate-blog-manifest.mjs` pre-build to produce `src/data/blog-manifest.ts`. In Astro, this entire pipeline disappears:

| Step | Current (Next.js) | Astro |
|------|-------------------|-------|
| Discover MDX files | `scripts/generate-blog-manifest.mjs` scans `blogs/` | `getCollection('blog')` — built in |
| Type frontmatter | Manual types in `src/types/blog.ts` | Zod schema in `src/content/config.ts` — auto-inferred |
| Access metadata | Import `blog-manifest.ts` | `entry.data.title`, `entry.data.date`, etc. |
| Render MDX | Dynamic `import('@/blogs/{slug}.mdx')` | `const { Content } = await entry.render()` |
| Static params | `generateStaticParams()` reads manifest | `getStaticPaths()` calls `getCollection()` directly |

Confidence: HIGH — this is the canonical Astro content collections pattern.

### MDX Components Registry

In Next.js, `mdx-components.tsx` at the root globally overrides MDX output. In Astro, the equivalent is:

1. Define custom components in `src/components/mdx/`
2. Pass them to the rendered `<Content />` via the `components` prop:
   ```astro
   const { Content } = await entry.render();
   <Content components={{ h2: HeadingWithAnchor, pre: CodeBlock }} />
   ```
3. Alternatively, configure global MDX components in `astro.config.mjs` under `markdown.remarkPlugins` or `integrations: [mdx({ components: ... })]`

Confidence: MEDIUM — pattern is consistent with Astro docs training data; verify the exact `components` API in current Astro MDX integration docs.

### SEO Metadata Flow

```
Page frontmatter (entry.data.*)
         │
         ▼
BlogLayout.astro — assembles <title>, <meta>, Open Graph tags
         │ imports helpers
         ├── src/lib/json-ld.ts — unchanged; returns JSON-LD object string
         └── src/config/site.ts — site name, author, base URL
```

Astro exposes `<head>` directly in layout files — no `generateMetadata()` function needed. Replace the Next.js Metadata API with direct `<meta>` tags in layout Astro frontmatter.

Confidence: HIGH — Astro's head management via layout `<head>` slot is idiomatic.

### Sitemap

Use `@astrojs/sitemap` integration. Configured in `astro.config.mjs`:
```js
import sitemap from '@astrojs/sitemap';
export default defineConfig({ integrations: [sitemap()] });
```
This auto-generates `/sitemap-index.xml` from all static pages. The hand-rolled `sitemap.ts` in Next.js is replaced entirely.

Confidence: HIGH — this is the standard Astro sitemap approach.

### LLMs.txt Route

Astro supports API endpoints via `src/pages/llms.txt.ts` (or `.js`). The file exports a `GET` handler returning a `Response`. Pattern is identical to Next.js route handlers.

Confidence: HIGH.

### Theme Management

`next-themes` has no Astro equivalent. The idiomatic Astro approach for dark mode:

1. Inline `<script>` in `BaseLayout.astro` `<head>` reads localStorage and sets `class="dark"` on `<html>` before paint (prevents flash).
2. A SolidJS `ThemeToggle` island handles click events, updates the class, and persists to localStorage.
3. No global React context needed — the HTML class is the shared state.

```astro
<!-- BaseLayout.astro head — inline script, no bundle cost -->
<script is:inline>
  const theme = localStorage.getItem('theme') ?? 'light';
  document.documentElement.classList.toggle('dark', theme === 'dark');
</script>
```

Confidence: MEDIUM — this is the widely-documented pattern; the `is:inline` attribute prevents Astro from processing the script through Vite, which is important here.

### Image Optimization

`@astrojs/cloudflare` adapter includes a Cloudflare Images service. The `next/image` custom loader is replaced with:

```astro
import { Image } from 'astro:assets';
<Image src={post.data.logo} alt="..." width={800} height={400} />
```

In production (Cloudflare Pages), the adapter routes image requests through Cloudflare's resize pipeline automatically. The `image-loader.ts` and `src/lib/img.ts` files are deleted.

Confidence: MEDIUM — adapter image service behavior should be verified in current `@astrojs/cloudflare` docs; the v11+ adapter deprecated some image service options.

---

## Islands Architecture Strategy

### Which Components Become SolidJS Islands

The guiding rule: **a component needs SolidJS if it requires client-side event handling, reactive state, or browser APIs at runtime.** Everything else stays as an Astro `.astro` component.

| Component | Island? | Directive | Reason |
|-----------|---------|-----------|--------|
| `Header.tsx` | YES — SolidJS | `client:load` | Mobile menu `open` state; needs event listeners immediately on load |
| `ThemeToggle.tsx` | YES — SolidJS | `client:load` | Must read localStorage and respond to click immediately; visual correctness depends on it |
| `HeadingWithAnchor` | MAYBE — Astro | `is:inline` script | Copy-to-clipboard can be done with a tiny inline `<script>` in an Astro component; no SolidJS needed |
| `BlogCard.astro` | NO | — | Pure presentational; no interaction |
| `BlogGrid.astro` | NO | — | Layout only |
| `HeroSection.astro` | NO | — | Static content |
| `Footer.astro` | NO | — | Static links |
| `CodeBlock` | NO | — | Shiki handles syntax highlighting at build time in Astro; no runtime JS |
| `CertificationBadge` | NO | — | Static display |

**Island directive selection:**

- `client:load` — use for `Header` and `ThemeToggle`. Both are above-the-fold and must be interactive on first paint.
- `client:idle` — use for secondary interactive components that can wait until the browser is idle (none currently needed).
- `client:visible` — use for components below the fold (none currently needed for this site).

**Component count:** Only 2 SolidJS islands needed. This is the intended efficiency gain over the current all-React architecture.

### Passing Props to Islands

SolidJS islands receive props from Astro pages. Props must be JSON-serializable (primitives, plain objects, arrays). No passing of Astro component instances or functions.

```astro
<!-- In an Astro page or layout -->
<Header navLinks={siteConfig.nav} client:load />
<ThemeToggle client:load />
```

Confidence: HIGH — this is fundamental to how Astro islands work across all frameworks.

### Shared State Between Islands

The two islands (`Header`, `ThemeToggle`) do not need to share state. If this ever changes (e.g., theme affects header appearance), use a lightweight SolidJS store via a shared module-level signal (`createSignal` exported from a `.ts` file). Do not use SolidJS context across island boundaries — each island is an independent tree.

Confidence: MEDIUM — this is a known Astro constraint; nano-stores are a common third-party solution if cross-island state grows.

---

## Recommended Directory Structure

```
project-root/
├── src/
│   ├── pages/                         # Astro file-based routing (replaces src/app/)
│   │   ├── index.astro                # Home page (/)
│   │   ├── about.astro                # About page (/about)
│   │   ├── blogs/
│   │   │   ├── index.astro            # Blog listing (/blogs)
│   │   │   └── [slug].astro           # Blog detail (/blogs/[slug])
│   │   ├── llms.txt.ts                # API endpoint (/llms.txt)
│   │   └── sitemap.xml.ts             # Optional: manual sitemap (or use @astrojs/sitemap)
│   │
│   ├── layouts/                       # Shared layout wrappers
│   │   ├── BaseLayout.astro           # HTML shell, fonts, theme init script, header, footer
│   │   └── BlogLayout.astro           # Extends BaseLayout; adds blog-specific meta + JSON-LD
│   │
│   ├── components/                    # UI components (mixed Astro + SolidJS)
│   │   ├── blog/
│   │   │   ├── BlogCard.astro         # Static — no change from concept
│   │   │   └── BlogGrid.astro         # Static — no change from concept
│   │   ├── home/
│   │   │   ├── HeroSection.astro      # Static
│   │   │   └── CertificationBadge.astro # Static
│   │   ├── layout/
│   │   │   ├── Header.tsx             # SolidJS island — mobile menu state
│   │   │   ├── Footer.astro           # Static
│   │   │   └── ThemeToggle.tsx        # SolidJS island — dark/light toggle
│   │   ├── mdx/                       # MDX component overrides
│   │   │   ├── HeadingWithAnchor.astro # Heading + copy link (inline script)
│   │   │   └── CodeBlock.astro        # Code wrapper (Shiki does the work)
│   │   └── ui/                        # Generic primitives (rewritten without Radix)
│   │       ├── Button.astro
│   │       ├── Badge.astro
│   │       └── Card.astro
│   │
│   ├── content/                       # Astro content collections (NEW — replaces blogs/ + manifest)
│   │   ├── config.ts                  # Collection schema definition (Zod)
│   │   └── blog/                      # MDX files moved here from blogs/
│   │       ├── 1-xp-precompilation.mdx
│   │       └── ...
│   │
│   ├── lib/                           # Utility functions (mostly preserved)
│   │   ├── blogs.ts                   # Thin wrappers around getCollection (sort, slice)
│   │   ├── json-ld.ts                 # Unchanged — pure functions, no framework dependency
│   │   └── utils.ts                   # cn() helper — unchanged
│   │
│   ├── config/
│   │   └── site.ts                    # Unchanged — pure config constants
│   │
│   └── types/
│       ├── blog.ts                    # Simplified — Zod schema auto-infers types now
│       └── certification.ts          # Unchanged
│
├── public/                            # Unchanged — static assets served as-is
│   ├── images/
│   └── favicon.svg
│
├── astro.config.mjs                   # Replaces next.config.ts + open-next.config.ts
├── tailwind.config.ts                 # Unchanged
├── tsconfig.json                      # Updated for Astro path aliases
└── package.json                       # New dependencies
```

**Key structural changes vs current:**

1. `blogs/` directory moves into `src/content/blog/` — this is required by Astro content collections (Astro 5 loader API may allow custom paths; verify).
2. `scripts/generate-blog-manifest.mjs` is deleted — no replacement needed.
3. `src/data/blog-manifest.ts` is deleted — collections replace it.
4. `src/app/` is replaced by `src/pages/` — different file extension (`.astro` vs `.tsx`).
5. `src/layouts/` is a new top-level directory — does not exist in the Next.js version.
6. `mdx-components.tsx` at root becomes `src/components/mdx/` directory.
7. `image-loader.ts` is deleted — Cloudflare adapter handles this.
8. `open-next.config.ts` is deleted — replaced by `@astrojs/cloudflare` adapter config in `astro.config.mjs`.

---

## Build Order and Phase Dependencies

Components have build-order dependencies. The recommended implementation sequence:

```
Phase 1: Foundation (no dependencies)
  ├── astro.config.mjs (adapter, integrations, MDX)
  ├── src/content/config.ts (Zod schema for blog collection)
  ├── src/config/site.ts (copy unchanged)
  └── src/types/ (simplify; Zod handles blog types)

Phase 2: Content pipeline (depends on: config.ts schema)
  ├── Move blogs/*.mdx → src/content/blog/*.mdx
  ├── src/lib/blogs.ts (rewrite using getCollection)
  └── src/lib/json-ld.ts (copy unchanged — no framework deps)

Phase 3: Layouts (depends on: content pipeline, config)
  ├── BaseLayout.astro (theme init script, head, fonts)
  └── BlogLayout.astro (meta, JSON-LD — depends on json-ld.ts)

Phase 4: Static components (depends on: layouts)
  ├── Footer.astro
  ├── BlogCard.astro
  ├── BlogGrid.astro
  ├── HeroSection.astro
  └── src/components/mdx/* (HeadingWithAnchor, CodeBlock)

Phase 5: SolidJS islands (depends on: layouts, site config)
  ├── ThemeToggle.tsx (SolidJS, client:load)
  └── Header.tsx (SolidJS, client:load, mobile menu)

Phase 6: Pages (depends on: all above)
  ├── index.astro (home — needs HeroSection, BlogGrid, latest posts)
  ├── blogs/index.astro (listing — needs BlogGrid, getCollection)
  ├── blogs/[slug].astro (detail — needs BlogLayout, Content render, JSON-LD)
  ├── about.astro
  └── llms.txt.ts

Phase 7: SEO utilities (depends on: pages, site config)
  └── @astrojs/sitemap integration (auto-generated from pages)

Phase 8: Deployment (depends on: everything)
  └── @astrojs/cloudflare adapter config + Cloudflare Pages setup
```

**Critical path:** content schema → content pipeline → layouts → pages. Everything else is parallel within phases.

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Radix UI in SolidJS Islands
**What:** Porting Radix UI (React-based) into the SolidJS island for Header or dialogs.
**Why bad:** Radix UI is React-only. SolidJS has Kobalte as an equivalent, but adding it for two small islands adds unnecessary weight.
**Instead:** Implement mobile menu with a simple SolidJS signal (`createSignal(false)`) and a conditional `classList`. The Header mobile menu does not need an accessible sheet component — a toggled `<nav>` with focus trap is sufficient for a personal blog.

### Anti-Pattern 2: Keeping the Blog Manifest Script
**What:** Running `generate-blog-manifest.mjs` alongside content collections.
**Why bad:** Redundant. Collections do everything the script did, with better typing.
**Instead:** Delete the script; delete `src/data/blog-manifest.ts`. All blog queries go through `getCollection('blog')`.

### Anti-Pattern 3: Using SolidJS for Static Components
**What:** Wrapping `BlogCard`, `HeroSection`, or `Footer` as SolidJS components because they existed as React components.
**Why bad:** Adds JS hydration cost with zero benefit. These components have no state, no events.
**Instead:** Rewrite as `.astro` components. They become pure HTML templates — simpler and faster.

### Anti-Pattern 4: Skipping `is:inline` on the Theme Init Script
**What:** Putting the localStorage → class init script as a regular module script.
**Why bad:** Astro will bundle and defer it, causing a flash of unstyled content (FOUC) on dark mode users.
**Instead:** Use `<script is:inline>` in `<head>` — runs synchronously before paint.

### Anti-Pattern 5: Deeply Nesting SolidJS Islands
**What:** Placing a SolidJS island inside another SolidJS island.
**Why bad:** Each island is an independent hydration root. Nesting is valid in Astro terms but creates complexity and can cause hydration issues.
**Instead:** Keep islands shallow and independent. Pass all needed data as props from Astro.

---

## Scalability Considerations

This is a personal blog with ~10+ posts. Scale is not a concern, but note:

| Concern | Current (<50 posts) | If >500 posts |
|---------|---------------------|---------------|
| Build time | Near-instant | Content collections build remains fast; Astro incremental is improving |
| Bundle size | 2 tiny SolidJS islands | Still 2 islands; no growth with content |
| Image optimization | Cloudflare Images handles all sizes | Same — no architecture change needed |

---

## Confidence Summary

| Decision | Confidence | Basis |
|----------|------------|-------|
| Content collections replace manifest | HIGH | Core Astro feature, well-documented in training data |
| `src/pages/` file-based routing | HIGH | Fundamental Astro architecture, unchanged across versions |
| SolidJS islands via `client:load` | HIGH | Astro islands pattern, cross-framework |
| Only 2 SolidJS islands needed | HIGH | Based on direct audit of current interactivity |
| Zod schema in `src/content/config.ts` | HIGH | Content collections schema definition, standard pattern |
| `@astrojs/sitemap` replaces sitemap.ts | HIGH | First-party integration, stable |
| `is:inline` for theme init script | MEDIUM | Pattern is widely documented; exact attribute syntax should be verified |
| MDX `components` prop API | MEDIUM | Astro MDX integration API; verify current version's exact prop name |
| Cloudflare adapter image service | MEDIUM | Was redesigned in adapter v3-v5 range; verify current behavior |
| `next-themes` replacement approach | MEDIUM | No direct Astro equivalent — inline script pattern is community consensus |

---

## Sources

- Current codebase analysis (`.planning/codebase/ARCHITECTURE.md`, `.planning/codebase/STRUCTURE.md`) — HIGH confidence
- Training data: Astro content collections documentation (Astro 4/5), islands architecture, MDX integration — MEDIUM confidence (verify at https://docs.astro.build)
- Training data: SolidJS integration with Astro, `client:*` directives — MEDIUM confidence (verify at https://docs.astro.build/en/guides/integrations-guide/solid-js/)
- Training data: `@astrojs/cloudflare` adapter image service — MEDIUM confidence (verify changelog for v3+ adapter)

**Recommended verification URLs before implementation:**
- https://docs.astro.build/en/guides/content-collections/
- https://docs.astro.build/en/guides/integrations-guide/solid-js/
- https://docs.astro.build/en/guides/integrations-guide/mdx/
- https://docs.astro.build/en/guides/deploy/cloudflare/
- https://github.com/withastro/adapters/tree/main/packages/cloudflare
