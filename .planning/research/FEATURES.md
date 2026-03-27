# Feature Landscape

**Domain:** Personal technical blog — MDX content, static site, Cloudflare-deployed
**Researched:** 2026-03-27
**Migration scope:** Next.js 16 + React 19 → Astro + SolidJS (brownfield, feature-preserving)
**Confidence:** HIGH (features verified against actual source files; Astro equivalents from training knowledge through August 2025)

---

## Inventory: Every Current Feature

A complete enumeration of what the existing site does, derived from codebase analysis.

| # | Feature | Location in Current Code |
|---|---------|--------------------------|
| 1 | MDX blog posts with frontmatter | `blogs/*.mdx`, `src/data/blog-manifest.ts` |
| 2 | Build-time blog manifest generation | `scripts/generate-blog-manifest.mjs` |
| 3 | Blog listing page with grid + cards | `src/app/blogs/page.tsx`, `BlogGrid`, `BlogCard` |
| 4 | Blog detail page (slug routing) | `src/app/blogs/[slug]/page.tsx` |
| 5 | Syntax highlighting (theme-aware) | `src/components/code-block.tsx` (react-syntax-highlighter) |
| 6 | Copy-to-clipboard on code blocks | `src/components/ui/shadcn-io/copy-button/` |
| 7 | MDX components registry (headings, links, tables, images, code) | `mdx-components.tsx` |
| 8 | Anchor links on headings (hover-reveal, copy URL) | `src/components/ui/heading-with-anchor.tsx` |
| 9 | Dark/light theme toggle (persisted to localStorage) | `src/components/layout/ThemeToggle.tsx`, `next-themes` |
| 10 | Sticky header with logo + navigation | `src/components/layout/Header.tsx` |
| 11 | Mobile menu (Sheet/drawer, state-driven) | `src/components/layout/Header.tsx` (Radix Sheet) |
| 12 | Footer | `src/components/layout/Footer.tsx` |
| 13 | Hero section (profile photo, bio) | `src/components/home/HeroSection.tsx` |
| 14 | Home page: 3 latest posts + hero | `src/app/page.tsx` |
| 15 | About page (reuses HeroSection) | `src/app/about/page.tsx` |
| 16 | SEO metadata per page (title, description, og:image, keywords) | `generateMetadata()` in page files |
| 17 | JSON-LD structured data (Person on home, BlogPosting on posts) | `src/lib/json-ld.ts` |
| 18 | Open Graph tags (article type, publishedTime, og:image) | `generateMetadata()` in blog slug page |
| 19 | Sitemap XML | `src/app/(seo)/sitemap.ts` |
| 20 | LLMs.txt route | `src/app/(seo)/llms.txt/route.ts` |
| 21 | Image optimization (Cloudflare Images in prod, Next.js in dev) | `src/lib/img.ts`, `image-loader.ts` |
| 22 | Blog tags display | blog slug page, BlogCard |
| 23 | Date formatting and display | `src/lib/blogs.ts` |
| 24 | "View article as markdown" link on post page | blog slug page (links to `/blogs/${slug}.md`) |
| 25 | Tailwind CSS v4 styling | global config |
| 26 | Responsive layout (container, breakpoints) | throughout components |
| 27 | Site config (name, nav, socials, author) | `src/config/site.ts` |

**Note on feature #24:** The `/blogs/${slug}.md` link is referenced in the UI but no corresponding route exists in the current codebase. This is either a planned feature or currently broken. **Needs validation before migration.**

---

## Table Stakes

Features users expect. Missing = product feels broken or incomplete. All are present in the current site and must be preserved in Astro.

| Feature | Why Expected | Migration Complexity | Notes |
|---------|--------------|---------------------|-------|
| MDX blog posts render correctly | Core content delivery | Medium | Astro has `@astrojs/mdx` integration; MDX files work natively. Custom component registry maps to `components` prop in Astro MDX config. |
| Blog listing page | Navigation to content | Low | Pure static page; Astro `.astro` page with content collection query. |
| Blog detail pages with readable typography | Reading experience | Medium | Static `.astro` page. Custom prose components need re-implementation without React. |
| Syntax highlighting | Developer blog audience expects it | Medium | Replace `react-syntax-highlighter` (runtime, theme-aware) with Astro's built-in Shiki (build-time, zero JS). Architecture change required — see Pitfalls. |
| Dark/light theme toggle | Modern blog expectation | Medium | Replace `next-themes` with SolidJS signal + localStorage + CSS class on `<html>`. No direct Astro equivalent for `next-themes`. |
| Responsive design | Mobile users | Low | Tailwind classes carry over unchanged. |
| SEO metadata | Discoverability | Low | Astro has first-class `<meta>` and OG tag support via `<head>` in layouts. |
| Sitemap XML | Search engine indexing | Low | `@astrojs/sitemap` integration handles this automatically with minimal config. |
| Sticky navigation header | Wayfinding | Low-Medium | Static HTML in Astro layout; mobile menu SolidJS interactive island. |
| Mobile menu | Usability on small screens | Medium | Replace Radix Sheet with SolidJS component. No direct Radix equivalent for SolidJS yet. |
| About page | Credibility / author context | Low | Astro static page; no interactivity needed. |
| Anchor links on headings | Deep-linking within posts | Medium | Client-side clipboard logic → SolidJS island, or can be done with vanilla JS in `<script>` tags in Astro. |

---

## Differentiators

Features this blog has that go beyond minimum-viable. Not expected by all blog readers, but provide value.

| Feature | Value Proposition | Migration Complexity | Notes |
|---------|-------------------|---------------------|-------|
| JSON-LD structured data (Person + BlogPosting) | Rich search results (Google Knowledge Panel, article cards) | Low | Inline `<script type="application/ld+json">` in Astro `<head>` or body. No library needed — just serialize the object. `schema-dts` types can be kept for authoring. |
| LLMs.txt route | AI-friendly content discovery; forward-looking SEO | Low | Astro API route (`src/pages/llms.txt.ts`) returning plain text. Direct equivalent. |
| Theme-aware syntax highlighting | Consistent code appearance across dark/light modes | High | Current approach (runtime React component that reads theme) does not map to Astro's Shiki (build-time). Requires either: (a) CSS variable-based dual-theme Shiki config, or (b) keep a SolidJS island for code blocks with a lighter highlighter. Option (a) is preferred — Shiki supports `css-variables` theme. |
| Copy-to-clipboard on code blocks | Developer QoL | Medium | No longer needs a React client component if switching to Shiki. Can use a small SolidJS island or vanilla `<script>` for the copy button only. |
| "View article as markdown" link | LLM-friendliness; transparency | Unknown — route may be unimplemented | Needs a `/blogs/[slug].md` API route in Astro. Medium complexity if the MDX source is served raw; check if raw MDX files should be served. |
| Open Graph tags with og:image | Social share previews | Low | Astro head management handles this. Image URL construction logic carries over unchanged. |
| Blog tags | Content categorization and scannability | Low | Static rendering; no interactivity. Tailwind classes carry over. |

---

## Migration Mapping: Current Feature → Astro Equivalent

Every current feature mapped to its Astro target implementation.

### Content Pipeline

| Current (Next.js) | Astro Equivalent | Complexity | Notes |
|-------------------|-----------------|------------|-------|
| `blogs/*.mdx` files | Same files in `src/content/blog/` (Content Collections) | Low — file move only | Frontmatter shape preserved. Content Collections provide typed `getCollection()` API. |
| `scripts/generate-blog-manifest.mjs` (custom build script) | Astro Content Collections (built-in) | Low — remove custom script | `getCollection('blog')` replaces the manifest. No build script needed. |
| `src/data/blog-manifest.ts` (auto-generated manifest) | Astro Content Collection schema (`src/content/config.ts`) | Low — replace with schema | Define Zod schema for frontmatter; Astro validates at build time. |
| `@next/mdx` loader + `mdx-components.tsx` global override | `@astrojs/mdx` + `components` option in frontmatter or layout | Medium | Astro MDX components can be passed via the layout or globally via `mdx()` integration config. One-to-one mapping for most overrides. |
| `blogSlugToPath` mapping | `entry.slug` from Content Collections | Low — remove custom mapping | Astro derives slugs from filenames automatically. Current numeric prefix in filenames (`1-`, `3-`, etc.) will affect slug; may need `slug` frontmatter field. |

### Routing

| Current (Next.js) | Astro Equivalent | Complexity | Notes |
|-------------------|-----------------|------------|-------|
| `src/app/page.tsx` (home) | `src/pages/index.astro` | Low | Static page, no SSR. |
| `src/app/blogs/page.tsx` (listing) | `src/pages/blogs/index.astro` | Low | Static page with `getCollection()`. |
| `src/app/blogs/[slug]/page.tsx` | `src/pages/blogs/[slug].astro` with `getStaticPaths()` | Low-Medium | `getStaticPaths()` maps to Next's `generateStaticParams()`. MDX rendered via `<Content />` component from entry. |
| `src/app/about/page.tsx` | `src/pages/about.astro` | Low | No interactivity. |
| `src/app/(seo)/sitemap.ts` | `@astrojs/sitemap` integration | Low | Config-driven; auto-generates `/sitemap.xml`. |
| `src/app/(seo)/llms.txt/route.ts` | `src/pages/llms.txt.ts` (Astro endpoint) | Low | Astro supports `export async function GET()` in `.ts` endpoint files. |

### Interactive Components (SolidJS Islands)

| Current (Next.js / React) | Astro+SolidJS Equivalent | Complexity | Notes |
|--------------------------|--------------------------|------------|-------|
| `ThemeToggle.tsx` (`next-themes`, React state) | SolidJS island: signal + localStorage + `document.documentElement.classList` | Medium | Replace `next-themes` entirely. Read localStorage on mount, toggle class on `<html>`. Requires `client:load` directive. Must handle SSR flash (FOUC) — see Pitfalls. |
| `Header.tsx` mobile menu (Radix Sheet, `useState`, `useIsMobile`) | SolidJS island wrapping nav toggle + drawer | Medium | No Radix UI for SolidJS with Sheet equivalent at parity. Implement custom drawer or use `solid-ui` / hand-rolled. `createSignal` replaces `useState`. CSS media query or ResizeObserver replaces `useIsMobile`. |
| `CodeBlock.tsx` (react-syntax-highlighter, theme-aware, copy button) | Shiki at build time (Astro built-in) + SolidJS copy button island | High | Architecture shift: move highlighting from runtime React to build-time Shiki. Dual themes via Shiki `css-variables` theme or `dual` theme config. Copy button becomes a minimal SolidJS island. |
| `heading-with-anchor.tsx` (clipboard copy, hover reveal) | SolidJS island OR vanilla `<script>` + CSS | Medium | Clipboard API call on click can be vanilla JS. If anchor links need reactive hover state, SolidJS island is cleaner. Consider vanilla script for zero-SolidJS overhead. |
| `CopyButton` (copy-to-clipboard) | Vanilla `<script>` or SolidJS island | Low-Medium | Simple clipboard write; vanilla JS `<script>` in Astro is sufficient. |

### SEO & Metadata

| Current (Next.js) | Astro Equivalent | Complexity | Notes |
|-------------------|-----------------|------------|-------|
| `generateMetadata()` per page | `<meta>` tags in `<head>` of each `.astro` page or layout slot | Low | Astro layouts accept `title`, `description`, etc. as props. No magic — explicit `<meta>` tags. |
| JSON-LD `<script>` via `dangerouslySetInnerHTML` | `<script type="application/ld+json" set:text={JSON.stringify(jsonLd)} />` | Low | Astro's `set:text` directive is the safe equivalent. No library change needed. |
| `schema-dts` types | Keep as-is | None | Pure TypeScript type package; no framework dependency. |
| Open Graph tags | Explicit `<meta property="og:...">` in layout head slot | Low | Manual but straightforward. |
| `alternates.types` (markdown link in metadata) | Manual `<link rel="alternate">` in head | Low | If the `.md` route is implemented, add `<link rel="alternate" type="text/markdown">`. |

### Image Optimization

| Current (Next.js) | Astro Equivalent | Complexity | Notes |
|-------------------|-----------------|------------|-------|
| `next/image` with custom loader | Astro `<Image>` from `astro:assets` | Medium | Astro's `<Image>` handles local images natively. For remote images (Cloudflare R2/CDN), use `<Image src={url} inferSize />` or plain `<img>` with manual Cloudflare Images URL. |
| `image-loader.ts` (Cloudflare Images URL builder) | Keep `src/lib/img.ts` logic, use in Astro | Low | The URL-building logic is framework-agnostic. Adapt to use Cloudflare Images URL directly in `<img>` tags when in production. |
| Responsive `sizes` prop | `widths` + `sizes` props on Astro `<Image>` | Low | Direct equivalent. |
| AVIF/WebP format negotiation | Astro `<Image>` `format` prop + Cloudflare Images `format=auto` | Low | Cloudflare Images handles this automatically in prod. |

### Styling

| Current (Next.js) | Astro Equivalent | Complexity | Notes |
|-------------------|-----------------|------------|-------|
| Tailwind CSS v4 | Tailwind CSS v4 via `@astrojs/tailwind` or Vite plugin | Low | Tailwind v4 uses a Vite plugin; Astro integrates via Vite. All class names carry over unchanged. |
| CSS globals (`globals.css`) | Import in root layout `.astro` file | Low | Direct equivalent. |
| `dark:` class-based variants | Same — Tailwind `dark:` with `darkMode: 'class'` config | Low | Unchanged. Theme toggle sets class on `<html>`. |
| shadcn/ui components | Replace with Tailwind + SolidJS or solid-ui equivalents | Medium-High | shadcn/ui is React-only. Components used: Button, Card, Badge, Separator, NavigationMenu, Sheet, DropdownMenu. For static components (Badge, Separator, Card), convert to plain Astro/HTML+Tailwind. For interactive ones (Sheet, NavigationMenu), implement in SolidJS. |

### Deployment

| Current (Next.js) | Astro Equivalent | Complexity | Notes |
|-------------------|-----------------|------------|-------|
| Cloudflare Workers via OpenNext | Cloudflare Pages via `@astrojs/cloudflare` adapter | Low | Native Astro adapter. Static output mode is simpler; `output: 'static'` removes adapter dependency entirely for a fully static site. |

---

## Anti-Features

Features to deliberately NOT build during this migration.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| RSS Feed | Not currently implemented; out of scope per PROJECT.md | Note as future feature; Astro makes it trivial to add later (`@astrojs/rss`) |
| Tag filtering / search | Not currently implemented; feature creep | Static tag display only; no interactivity |
| Comments system | Not currently implemented | No comments; keep blog clean |
| CMS or admin panel | Out of scope per PROJECT.md | Static MDX workflow unchanged |
| Authentication | Out of scope per PROJECT.md | Not applicable to static blog |
| Redesign / new visual identity | Deferred to Milestone 2 per PROJECT.md | Use existing styles verbatim |
| React or Radix UI components | Core motivation of migration is to remove React | SolidJS for islands; plain Astro/HTML for static content |
| Client-side routing (SPA mode) | Static blog does not need it; adds JS weight | Astro MPA model; full page navigations |
| `next-themes` | React-specific library | Implement theme with ~20 lines of SolidJS + localStorage |
| View Transitions API | Not in current site; out of migration scope | Can be added in Milestone 2 |

---

## Feature Dependencies

```
Content Collections (MDX files migrated) → Blog listing page
Content Collections (MDX files migrated) → Blog detail pages
Blog detail pages → Syntax highlighting (code blocks in MDX)
Blog detail pages → Anchor links on headings
Blog detail pages → JSON-LD BlogPosting
Blog detail pages → SEO metadata per post
Blog detail pages → "View as markdown" route (if implemented)

Theme toggle (SolidJS, localStorage) → Theme-aware syntax highlighting
  ↳ If Shiki build-time: NO dependency on theme toggle (use CSS vars)
  ↳ If runtime highlighter: DEPENDS on theme toggle signal

Dark mode CSS class on <html> → All dark: Tailwind variants
Theme toggle (SolidJS island) → Dark mode CSS class on <html>

Site config (author, nav, social) → Header, Footer, HeroSection, JSON-LD, LLMs.txt
Sitemap → Content Collections (needs all slugs)
LLMs.txt → Content Collections (needs all slugs + titles)

shadcn/ui components removed → SolidJS custom mobile menu
shadcn/ui components removed → SolidJS custom sheet/drawer
shadcn/ui components removed → Plain HTML+Tailwind for static components (Badge, Card, etc.)
```

---

## MVP Recommendation

The migration has a fixed scope (feature parity only), so "MVP" means: minimum work to have a working Astro site with all features present.

**Sequencing by dependency and risk:**

1. **Content Collections first** — unblocks everything. Migrate MDX files, define schema, replace manifest generation. All other features depend on this.

2. **Static pages and layouts** — home, blogs listing, about, blog detail. These are pure Astro with no interactivity. Validates routing, MDX rendering, and SEO metadata in one pass.

3. **Syntax highlighting (Shiki)** — architectural decision point. Commit to build-time Shiki with CSS variable dual themes early; this affects code block component design and removes the need for a SolidJS island for highlighting. High-risk if deferred.

4. **Theme toggle (SolidJS)** — first SolidJS island. Validates the Astro + SolidJS island pattern. Small surface area, low risk.

5. **Mobile menu (SolidJS)** — second island. More complex (drawer state, close-on-navigate). Builds on theme toggle island pattern.

6. **Anchor links + copy button** — last islands. Low risk; can be vanilla JS if SolidJS overhead not justified.

7. **SEO routes** — sitemap, LLMs.txt. Low complexity; wire up last after content structure is stable.

**Defer (post-migration validation):**
- The `/blogs/${slug}.md` markdown route: validate whether this should exist before implementing in Astro. If the current Next.js site serves it, implement an Astro endpoint. If it is a dead link, skip.

---

## Notes on Specific Migration Risks

### Syntax Highlighting Architecture Change (HIGH risk)

Current implementation uses `react-syntax-highlighter` as a client component that reads the current theme from `next-themes` at runtime to switch between `vscDarkPlus` (dark) and `ghcolors` (light). This works because React hydrates on the client with the theme already known.

In Astro, code blocks in MDX are processed at build time by the Shiki highlighter (built into Astro). There is no runtime theme awareness. The recommended pattern is to configure Shiki with the `css-variables` theme (or a dual-theme like `github-dark`/`github-light` using Shiki's `dual` feature) and define the CSS variables in the Tailwind base layer, scoped to `.dark` and `:root`. This eliminates the client component entirely for highlighting.

**Consequence:** The copy button (currently part of `CodeBlock`) must be separated into a standalone SolidJS island or vanilla script that attaches to pre-rendered `<pre>` elements.

### FOUC (Flash of Unstyled Content) on Theme (MEDIUM risk)

`next-themes` handles FOUC by injecting a blocking script in `<head>` that reads localStorage and sets the class before paint. Without this, users see a flash from the default theme to their saved preference.

In Astro, this must be replicated manually: a small `<script>` tag in the root layout's `<head>` (not deferred, not a module) that reads `localStorage.getItem('theme')` and sets `document.documentElement.classList`. The SolidJS theme toggle island then syncs with whatever the script already set.

### Radix UI Absence for SolidJS (MEDIUM risk)

The current mobile menu uses Radix UI's Sheet (a slide-in drawer with focus trap, ARIA attributes, and close-on-escape). Radix UI is React-only. For SolidJS, options are:
- `solid-ui` (shadcn/ui port for SolidJS) — evaluate coverage
- `corvu` (SolidJS headless UI library with Sheet/Drawer) — active project as of mid-2025
- Hand-rolled with SolidJS + CSS — acceptable for this simple use case

For a mobile nav menu on a personal blog, a hand-rolled SolidJS drawer with `createSignal` and basic focus/escape handling is proportionate. Full a11y parity with Radix is a nice-to-have, not a blocker.

### Blog Slug Generation (LOW-MEDIUM risk)

Current MDX files use numeric prefixes (`1-xp-precompilation.mdx`, `3-send-mcp.mdx`). With Astro Content Collections, the slug is derived from the filename by default. The numeric prefix would become part of the slug (e.g., `1-xp-precompilation`), breaking URL parity.

**Fix:** Add a `slug` field to each MDX file's frontmatter OR configure a custom `slug` transform in the content collection schema. Since the constraint is "no content file modification," the transform approach is preferred — strip numeric prefix in the `getStaticPaths()` mapping, matching against the existing slug list from the manifest.

Actually, re-examining: the current `blogSlugToPath` shows that slugs (`xp-precompilation`) already differ from filenames (`1-xp-precompilation`). Astro's default slug from filename would NOT match. **A custom slug field in frontmatter is the cleanest solution — but this requires touching MDX files.** Alternatively, a collection entry transform can strip the numeric prefix. This is a constraint worth flagging for the roadmap.

---

## Sources

- Source analysis: codebase files read directly (HIGH confidence — primary source)
- `mdx-components.tsx`, `code-block.tsx`, `heading-with-anchor.tsx`, `ThemeToggle.tsx`, `Header.tsx` — all verified from source
- Astro feature capabilities (Content Collections, MDX integration, Shiki, Cloudflare adapter, API endpoints): Training knowledge through August 2025 — MEDIUM confidence. Verify against current Astro docs before implementation.
- `@astrojs/sitemap`, `@astrojs/mdx` integrations: Training knowledge — MEDIUM confidence. APIs stable since Astro 3.x but check for Astro 5.x changes.
- SolidJS island pattern in Astro (`client:load`): Training knowledge — MEDIUM confidence.
- `corvu` as Radix Sheet alternative for SolidJS: Training knowledge, project was active mid-2025 — LOW confidence, verify availability and maturity.
- `solid-ui` (shadcn/ui for SolidJS): Training knowledge — LOW confidence, verify component coverage.
