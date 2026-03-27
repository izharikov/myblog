# Phase 2: Static Pages & Layouts — Research

**Researched:** 2026-03-27
**Domain:** Astro 6 layouts, pages, content collection rendering, SEO metadata, image handling, sitemap, Tailwind v4 CSS tokens
**Confidence:** HIGH

---

## Summary

Phase 2 builds all four pages and shared layouts in Astro — converting the existing React components from `src/components/` (which still contain `next/image`, `next/link`, and React imports) into plain `.astro` components. The mobile menu and theme toggle are NOT in scope for this phase (those are Phase 4 SolidJS islands). The Header and Footer must be static `.astro` components here — the Header renders desktop nav only with a placeholder for the mobile menu slot.

The most critical discovery is that `globals.css` is missing the full Tailwind v4 `@theme inline` block and CSS custom property declarations (`--primary`, `--muted-foreground`, `--background`, etc.) that the original Next.js site defined. Without these, every component using `text-primary`, `bg-card`, `bg-secondary`, `text-muted-foreground`, etc. will render without color. These CSS variables must be ported from the original `globals.css` as the first task in this phase.

The second critical discovery: `schema-dts`, `class-variance-authority`, and `@radix-ui/*` are NOT installed. The `json-ld.ts` file imports `schema-dts` types and `badge.tsx`/`button.tsx` use CVA + Radix. Since Phase 2 is about static pages with correct HTML output (not interactivity), the simplest path is: (1) install `schema-dts` for JSON-LD type safety, (2) rewrite `BlogCard.astro`, `BlogGrid.astro`, `HeroSection.astro`, `Footer.astro`, `Header.astro` as pure `.astro` files that inline the badge/card/button markup using plain Tailwind classes — no CVA, no Radix, no React UI primitives needed in static components.

**Primary recommendation:** Write all Phase 2 components as `.astro` files with plain Tailwind classes, port CSS variables from the original `globals.css`, and use `getCollection` + `render()` for blog post rendering.

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CONT-02 | Blog listing page displays all posts in grid with cards | BlogGrid.astro + BlogCard.astro using getCollection('blog'); entry.data has title, description, date, tags, logo, slug |
| CONT-03 | Blog detail page renders MDX content at /blogs/[slug] | src/pages/blogs/[id].astro with getStaticPaths + render(); params use entry.id which equals the slug via generateId |
| CONT-06 | Date formatting and display matches current behavior | parseDate (DD.MM.YYYY → Date) + formatDate (en-US locale) logic from src/lib/blogs.ts must be ported — works as-is |
| CONT-07 | Blog tags displayed on cards and detail pages | entry.data.tags is string[] available from Zod schema; rendered as badge spans inline in .astro |
| PAGE-01 | Home page with hero section and 3 latest blog posts | index.astro: hero section + BlogGrid with getCollection sorted by date, sliced to 3 |
| PAGE-02 | About page with hero section | src/pages/about.astro: reuse HeroSection.astro without blog posts section |
| PAGE-03 | Blogs listing page (/blogs) | src/pages/blogs/index.astro: BlogGrid with all posts, no "See All" link |
| PAGE-04 | Blog detail page (/blogs/[slug]) | src/pages/blogs/[id].astro — uses entry.id as slug param |
| NAV-01 | Sticky header with logo and navigation links | Header.astro — static desktop nav; ThemeToggle placeholder div; no mobile menu in this phase |
| NAV-03 | Footer with consistent styling | Footer.astro converted from Footer.tsx — replace next/link with <a> |
| NAV-04 | Responsive layout across all breakpoints | Tailwind responsive classes in all components — sm:, md:, lg: breakpoints as per original |
| SEO-01 | Per-page metadata (title, description, canonical URL) | BaseLayout.astro head receives title + description props; canonical via Astro.url.href |
| SEO-02 | Open Graph tags (og:title, og:description, og:image, article type) | Added to BaseLayout.astro head; blog posts use BlogLayout.astro with article og:type |
| SEO-03 | Sitemap XML generated via @astrojs/sitemap | @astrojs/sitemap 3.7.2 installed; generates /sitemap-index.xml + /sitemap-0.xml; requires site: in astro.config.mjs |
</phase_requirements>

---

## Project Constraints (from CLAUDE.md)

- **Content preservation**: All existing MDX blog posts must work without content file modifications
- **URL parity**: All existing routes must be preserved (no broken links)
- **Deployment target**: Must remain on Cloudflare (Pages or Workers) — Cloudflare adapter removed in Phase 1 for Windows compatibility; static output via `wrangler pages deploy dist/`
- **Styling**: Keep Tailwind CSS v4 — no style framework change
- **SolidJS scope**: Only for interactive components; static content rendered by Astro
- **CRITICAL (from Phase 1 decisions)**: `z` must be imported from `astro:content`, not bare `zod`; Astro 6 bundles Zod 4 with breaking changes
- **CRITICAL (from Phase 1 decisions)**: `@cloudflare/vite-plugin` crashes on Windows with `output: static`; adapter stays removed until Phase 5
- **CRITICAL (from CLAUDE.md)**: Tailwind v4 uses `@tailwindcss/vite` in Vite plugins — never use `@astrojs/tailwind`

---

## Standard Stack

### Core (already installed — Phase 1 delivered)

| Library | Version | Purpose | Notes |
|---------|---------|---------|-------|
| astro | ^6.1.1 | Pages, layouts, routing, image optimization | Installed |
| @astrojs/mdx | ^5.0.3 | MDX rendering | Installed |
| @astrojs/sitemap | ^3.7.2 | Auto-generates sitemap-index.xml | Installed |
| @astrojs/solid-js | ^6.0.1 | SolidJS islands (ThemeToggle placeholder only in Phase 2) | Installed |
| tailwindcss | ^4.2.2 | Utility CSS | Installed |
| @tailwindcss/vite | ^4.2.2 | Vite plugin | Installed |
| clsx + tailwind-merge | ^2.0 + ^3.0 | cn() utility | Installed |

### Must Install in Phase 2

| Library | Version | Purpose | Why |
|---------|---------|---------|-----|
| schema-dts | ^1.1.x | TypeScript types for JSON-LD (Person, BlogPosting) | Used by existing json-ld.ts; not installed |

**Installation:**
```bash
npm install schema-dts
```

### NOT Needed (Do Not Install)

| Package | Why Excluded |
|---------|-------------|
| class-variance-authority | Components rewritten as .astro files with plain Tailwind classes |
| @radix-ui/* | React-only; replaced by plain HTML in .astro components |
| @kobalte/core | Phase 4 (SolidJS islands) only |
| lucide-solid | Phase 4 (ThemeToggle island) only — icons in Phase 2 components are inline SVGs |
| schema-dts (sidebar) | Required for json-ld.ts TypeScript types — this IS needed |

---

## Architecture Patterns

### Astro 6 Layouts: Slot-Based Composition

Layouts are `.astro` files in `src/layouts/` that receive props and use `<slot />` for content injection.

```astro
---
// src/layouts/BaseLayout.astro
interface Props {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
}
const { title, description, canonicalUrl, ogImage, ogType = 'website' } = Astro.props;
const canonical = canonicalUrl ?? Astro.url.href;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <!-- Open Graph -->
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content={ogType} />
    {ogImage && <meta property="og:image" content={ogImage} />}
  </head>
  <body class="bg-background text-foreground font-sans">
    <Header />
    <slot />
    <Footer />
  </body>
</html>
```

**Source:** https://docs.astro.build/en/basics/layouts/ — VERIFIED HIGH confidence

### Page importing layout:

```astro
---
// src/pages/index.astro
import BaseLayout from '@/layouts/BaseLayout.astro';
import { siteConfig } from '@/config/site';
---
<BaseLayout title={siteConfig.name} description={siteConfig.description}>
  <!-- page body here -->
</BaseLayout>
```

### Content Collection: Blog Detail Page Pattern

Astro 6 with glob loader uses `entry.id` as the route param. The project's `generateId` strips numeric prefixes, so `entry.id` equals the slug (`"xp-precompilation"`, etc.).

```astro
---
// src/pages/blogs/[id].astro
import { getCollection, render } from 'astro:content';
import BlogLayout from '@/layouts/BlogLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { id: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---
<BlogLayout
  title={post.data.title}
  description={post.data.description}
  post={post.data}
>
  <Content />
</BlogLayout>
```

**Source:** https://docs.astro.build/en/guides/content-collections/#building-for-static-output-default — VERIFIED HIGH confidence

**CRITICAL:** The route file must be named `[id].astro` NOT `[slug].astro` to match the `params.id` key. The URL will still be `/blogs/xp-precompilation` because `entry.id` = `"xp-precompilation"`.

### Blog Listing Page: getCollection with Sort

```astro
---
// src/pages/blogs/index.astro
import { getCollection } from 'astro:content';
import BaseLayout from '@/layouts/BaseLayout.astro';
import BlogGrid from '@/components/blog/BlogGrid.astro';

const posts = await getCollection('blog');
const sorted = posts.sort((a, b) => {
  return new Date(parseDate(b.data.date)).getTime() - new Date(parseDate(a.data.date)).getTime();
});
---
```

**Note:** `parseDate` must handle the `DD.MM.YYYY` format from the existing frontmatter. It should be a utility function in `src/lib/blogs.ts` — but `src/lib/blogs.ts` currently imports from `@/data/blog-manifest` which no longer exists. This file must be rewritten for Astro.

### Date Format: Parsing DD.MM.YYYY

The existing `parseDate` and `formatDate` functions in `src/lib/blogs.ts` must be preserved. The date format in frontmatter is `"20.01.2025"` (DD.MM.YYYY). The output display is `"Jan 20, 2025"` (en-US locale, month short).

```typescript
// Reusable utility — port to src/lib/date.ts or rewrite src/lib/blogs.ts
export function parseDate(dateString: string): Date {
  const [day, month, year] = dateString.split('.');
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}
```

### Tailwind v4 Custom Property Tokens (CRITICAL GAP)

The original Next.js site used shadcn/ui-style design tokens defined as CSS custom properties AND registered via `@theme inline` in globals.css. The current Astro `globals.css` is missing these entirely. Every component using `text-primary`, `bg-card`, `bg-background`, `text-muted-foreground`, etc. will fail to render with color.

**What must be added to `src/styles/globals.css`:**
- `@custom-variant dark (&:is(.dark *));` — Tailwind v4 dark mode via `.dark` class
- `@theme inline { --color-background: var(--background); ... }` block — maps CSS vars to Tailwind color utilities
- `:root { --background: oklch(...); --primary: oklch(...); ... }` — light mode values
- `.dark { --background: oklch(...); ... }` — dark mode values

The exact values are available from `git show main:src/app/globals.css` (already retrieved). This is a verbatim port of the `@theme inline`, `:root`, and `.dark` blocks — no new decisions needed.

**Also needed:** `@layer base` block for default border and body styles:
```css
@layer base {
  * { @apply border-border outline-ring/50; }
  body { @apply bg-background text-foreground; }
}
```

**Source:** `git show main:src/app/globals.css` — VERIFIED HIGH confidence (direct read of original file)

### Static .astro Components: Replacing React Components

All existing React components in `src/components/` use `React.ComponentProps`, `className`, Radix UI primitives, and `next/link`/`next/image`. They are excluded from TypeScript checking (`tsconfig.json` excludes `src/components`). Phase 2 creates new `.astro` equivalents; the old `.tsx` files stay untouched until Phase 3+ when they're migrated or deleted.

**Pattern — BlogCard.astro:**
- Replace `<Link href={...}>` with `<a href={...}>`
- Replace `<Image ...>` with `<img src={post.logo} ...>` OR `<Image>` from `astro:assets`
- Replace `<Card>/<CardContent>` wrappers with plain `<div>` with Tailwind classes
- Replace `<Badge>` with `<span class="inline-flex items-center ... rounded-full border px-2 py-0.5 text-xs ...">`
- Props typed as Astro interface, not React props

**Pattern — HeroSection.astro:**
- Replace `<Image>` with `<img>` (profile photo is in `public/`, no optimization needed here)
- Replace `className` with `class`
- No CertificationBadge row (currently commented out in original)

**Pattern — Footer.astro:**
- Replace `<Link>` with `<a>`
- Keep inline SVG icons (copy from `src/components/icons/index.tsx` as raw SVG)
- `new Date().getFullYear()` works in Astro frontmatter

**Pattern — Header.astro:**
- Static desktop nav links only
- No mobile menu (Phase 4)
- ThemeToggle: leave a placeholder `<div>` or render a static sun icon that doesn't toggle — actual toggle is Phase 4
- Replace `<NavigationMenu>` with plain `<nav>` + `<a>` links

### SEO: Per-Page Metadata Pattern

Astro has no built-in SEO component. The pattern is to pass props to a `<BaseHead>` Astro component (or directly in the layout `<head>`).

```astro
---
// src/components/BaseHead.astro
interface Props {
  title: string;
  description: string;
  canonicalUrl: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  articlePublishedTime?: string;
}
const { title, description, canonicalUrl, ogImage, ogType = 'website', articlePublishedTime } = Astro.props;
---
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width" />
<title>{title}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonicalUrl} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonicalUrl} />
<meta property="og:type" content={ogType} />
{ogImage && <meta property="og:image" content={ogImage} />}
{articlePublishedTime && <meta property="article:published_time" content={articlePublishedTime} />}
```

**The canonical URL must be absolute.** Use `new URL(Astro.url.pathname, siteConfig.site).href` to generate it.

### JSON-LD: Port json-ld.ts to Astro-Compatible Version

The existing `src/lib/json-ld.ts` imports from `schema-dts` and `@/types/blog`. After installing `schema-dts` and rewriting the blog type, this file can be used directly from Astro frontmatter (it has no React dependencies). The `post` passed to `generateBlogJsonLd` needs a `date: Date` field — the frontmatter `date` is a string, so parse it before calling.

```astro
---
// In BlogLayout.astro
import { generateBlogJsonLd } from '@/lib/json-ld';
import { parseDate } from '@/lib/date';
const jsonLd = generateBlogJsonLd({
  ...post.data,
  date: parseDate(post.data.date),
  dateDisplay: formatDate(parseDate(post.data.date)),
  path: post.id,
});
---
<script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />
```

### Sitemap: @astrojs/sitemap Output

The `@astrojs/sitemap` integration (already registered in `astro.config.mjs`) generates:
- `/sitemap-index.xml` — index file (this is the URL the ROADMAP success criterion checks for)
- `/sitemap-0.xml` — actual page URLs

The `site:` property in `astro.config.mjs` is already set to `'https://izharikov.dev'`. The integration requires this to generate absolute URLs. No additional configuration needed for basic sitemap generation.

**Source:** https://docs.astro.build/en/guides/integrations-guide/sitemap/ — VERIFIED HIGH confidence

### Astro Image Component with public/ Directory

Blog post images (logos) are stored in `public/images/...`. For images in `public/`, the `<Image>` component from `astro:assets` does NOT optimize them — they are served as-is. Using a plain `<img>` tag is acceptable and equivalent for `public/` images.

However, for `profile.jpg` (also in `public/`), a plain `<img>` is fine since image optimization is a Phase 5 concern (DEPLOY-03).

**Decision:** Use plain `<img>` tags for all images that reference `public/` paths. This avoids spurious build errors and the complexity of image optimization while static pages are being built. Image optimization is addressed in Phase 5 when the Cloudflare adapter is re-added.

**Source:** https://docs.astro.build/en/guides/images/ — VERIFIED HIGH confidence

### Recommended Project Structure for Phase 2

```
src/
├── layouts/
│   ├── BaseLayout.astro       # HTML shell, head, header, footer, CSS globals
│   └── BlogLayout.astro       # Extends BaseLayout; adds JSON-LD BlogPosting
├── components/
│   ├── BaseHead.astro         # All <head> SEO meta tags as a component
│   ├── blog/
│   │   ├── BlogCard.astro     # New: replaces BlogCard.tsx (no React)
│   │   └── BlogGrid.astro     # New: replaces BlogGrid.tsx (no React)
│   ├── home/
│   │   └── HeroSection.astro  # New: replaces HeroSection.tsx (no React)
│   └── layout/
│       ├── Header.astro       # New: static nav (no mobile menu, no ThemeToggle)
│       └── Footer.astro       # New: replaces Footer.tsx (no React)
├── pages/
│   ├── index.astro            # Home: hero + 3 latest posts
│   ├── about.astro            # About: hero section only
│   ├── blogs/
│   │   ├── index.astro        # All posts grid
│   │   └── [id].astro         # Dynamic blog post detail
│   └── test-collections.astro # DELETE in Phase 2 (or leave until Phase 5)
├── lib/
│   ├── blogs.ts               # REWRITE: remove blog-manifest dependency; use CollectionEntry
│   ├── date.ts                # NEW: parseDate + formatDate utilities (extracted from blogs.ts)
│   ├── json-ld.ts             # MINOR EDIT: type adjustments for Astro collection entry shape
│   └── utils.ts               # No change needed
├── styles/
│   └── globals.css            # ADD: @theme inline, :root vars, .dark vars from original
└── config/
    └── site.ts                # No change needed
```

### Anti-Patterns to Avoid

- **Anti-pattern: Using `<Image>` from astro:assets for public/ images** — Will not optimize but will require width+height or inferSize; adds complexity with no benefit when Cloudflare adapter is absent. Use `<img>` for Phase 2.
- **Anti-pattern: Keeping src/lib/blogs.ts import of blog-manifest** — The manifest no longer exists. Rewrite blogs.ts to operate on `CollectionEntry<'blog'>[]` passed in, not pulled from manifest.
- **Anti-pattern: Creating `[slug].astro` when params key is `id`** — The route file basename determines the Astro.params key. Since `getStaticPaths` returns `{ params: { id: post.id } }`, the file must be `[id].astro`. Either rename the params key to `slug` in `getStaticPaths` return AND name the file `[slug].astro`, or keep `id` consistently. Recommend `[slug].astro` with `params: { slug: post.id }` for semantic clarity.
- **Anti-pattern: Importing React component files from .astro pages** — The excluded `src/components` React files will cause errors if imported. Always create new `.astro` counterparts.
- **Anti-pattern: Using `className` in .astro files** — Astro uses `class` not `className` in template markup. Only SolidJS/React islands use `className`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Sitemap generation | Custom `/sitemap.xml` endpoint | @astrojs/sitemap (already installed) | Handles all static routes automatically; generates sitemap-index.xml |
| Date parsing | Custom regex parser | Existing `parseDate` in blogs.ts (DD.MM.YYYY) | Already validated and correct; just extract it |
| Canonical URL | String concatenation | `new URL(Astro.url.pathname, siteConfig.site).href` | Handles trailing slashes and edge cases |
| JSON-LD types | Custom type definitions | schema-dts (install it) | Type-safe schema.org types; existing json-ld.ts already uses it |
| Font loading | Google Fonts `<link>` | @fontsource-variable/geist (already in globals.css) | Self-hosted, no external request, already working |
| CSS token definitions | New design system | Port verbatim from `git show main:src/app/globals.css` | All OKLCH values are defined; verbatim port |

---

## Common Pitfalls

### Pitfall 1: Missing Tailwind CSS Design Tokens

**What goes wrong:** Pages render but all color utility classes like `text-primary`, `bg-card`, `bg-background`, `text-muted-foreground`, `bg-secondary` produce no visual output. Components appear black/white or transparent.

**Why it happens:** Tailwind v4 does not ship these tokens. They were defined in `@theme inline` + CSS custom properties in the original Next.js `globals.css`. The current Astro `globals.css` has only the `@import "tailwindcss"` line and font imports.

**How to avoid:** First task in Phase 2: port the `@theme inline`, `:root`, and `.dark` blocks from `git show main:src/app/globals.css` into `src/styles/globals.css`.

**Warning signs:** All text appears default black; cards and sections have no background differentiation; dark mode has no effect.

### Pitfall 2: Wrong Route Parameter Name in [slug].astro

**What goes wrong:** `Astro.params.slug` is undefined at runtime; blog pages return 404 or render empty.

**Why it happens:** The Astro route file name determines the param key. If the file is `[slug].astro` but `getStaticPaths` returns `params: { id: post.id }`, there is a mismatch.

**How to avoid:** Either name the file `[id].astro` and use `params: { id: post.id }`, OR name it `[slug].astro` and return `params: { slug: post.id }`. The recommendation is `[slug].astro` with `params: { slug: post.id }` since "slug" is semantically correct and the URL will be `/blogs/xp-precompilation` either way.

**Warning signs:** `Astro.params.slug` is `undefined` in the template; `astro build` may warn about param mismatches.

### Pitfall 3: src/lib/blogs.ts Imports Non-Existent blog-manifest

**What goes wrong:** TypeScript errors or runtime crash when any page imports from `@/lib/blogs`.

**Why it happens:** The existing `blogs.ts` imports `blogManifest` from `@/data/blog-manifest`, which was deleted in Phase 1. The file is currently excluded from TypeScript checking (tsconfig `exclude: ["src/lib"]`) so errors are hidden until `astro build`.

**How to avoid:** Rewrite `blogs.ts` to not import from blog-manifest. Instead, export utility functions that accept a `CollectionEntry<'blog'>[]` array (passed in from pages), or export pure functions like `parseDate`/`formatDate` that don't need blog data at all. Pages fetch collection data themselves with `getCollection('blog')`.

**Warning signs:** Build error: `Cannot find module '@/data/blog-manifest'`; occurs at first `astro build` or after removing `src/lib` from tsconfig exclude.

### Pitfall 4: schema-dts Not Installed

**What goes wrong:** Build error when json-ld.ts is imported: `Cannot find module 'schema-dts'`.

**Why it happens:** `schema-dts` is listed in the original project's dependencies but is not in the current `package.json`.

**How to avoid:** `npm install schema-dts` before importing json-ld.ts from any Astro page.

**Warning signs:** TS error in json-ld.ts; build error during `astro check` once `src/lib` is removed from tsconfig exclude.

### Pitfall 5: Astro Import of React Component Files

**What goes wrong:** Build errors like `React is not defined` or `useState is not available in Astro`.

**Why it happens:** `src/components/blog/BlogCard.tsx`, `Header.tsx`, `Footer.tsx`, etc. are React components. When imported directly in `.astro` files (without a `client:*` directive), Astro tries to SSR them, hitting React-specific APIs.

**How to avoid:** Never import existing `.tsx` React components from `.astro` pages. Create parallel `.astro` counterparts. The `src/components/` React files stay excluded from tsconfig until Phase 3+.

**Warning signs:** Build error referencing React APIs; `className` rendering literally in HTML.

### Pitfall 6: globals.css Not Imported in BaseLayout

**What goes wrong:** No CSS at all — page renders as unstyled HTML.

**Why it happens:** Tailwind CSS requires the `globals.css` file (which contains `@import "tailwindcss"`) to be imported in the layout. If `BaseLayout.astro` doesn't import it, no Tailwind styles apply.

**How to avoid:** Import `@/styles/globals.css` in `BaseLayout.astro` frontmatter:
```astro
---
import '@/styles/globals.css';
---
```

**Warning signs:** Page renders with no styling whatsoever; `astro dev` shows no colored text.

### Pitfall 7: Date Sorting — String vs Date Comparison

**What goes wrong:** Blog posts appear in wrong order on home page and /blogs.

**Why it happens:** Dates in frontmatter are stored as strings (`"20.01.2025"`, `"DD.MM.YYYY"`). Sorting by `post.data.date` as a string uses lexicographic order, which doesn't sort correctly for this format.

**How to avoid:** Always convert to `Date` via `parseDate()` before sorting:
```typescript
posts.sort((a, b) => parseDate(b.data.date).getTime() - parseDate(a.data.date).getTime());
```

**Warning signs:** Posts appear in file-name order or alphabetical order instead of chronological order.

### Pitfall 8: Sitemap Requires `site:` in astro.config.mjs

**What goes wrong:** `@astrojs/sitemap` throws a build warning or generates no sitemap if `site:` is not set.

**Why it happens:** The sitemap integration requires a base URL to generate absolute URLs for all pages.

**How to avoid:** Confirm `site: 'https://izharikov.dev'` in `astro.config.mjs` (already set in Phase 1 — verify it remains).

**Warning signs:** Build warning: `[@astrojs/sitemap] Integration requires the 'site' astro.config option`; no sitemap files in `dist/`.

---

## Code Examples

### Pattern: Astro Page with Content Collection

```astro
---
// src/pages/blogs/[slug].astro
import { getCollection, render } from 'astro:content';
import BlogLayout from '@/layouts/BlogLayout.astro';
import { parseDate, formatDate } from '@/lib/date';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { slug: post.id },  // entry.id = "xp-precompilation" (generateId stripped prefix)
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
const date = parseDate(post.data.date);
const dateDisplay = formatDate(date);
---
<BlogLayout
  title={post.data.title}
  description={post.data.description}
  post={{ ...post.data, date, dateDisplay, path: post.id }}
>
  <Content />
</BlogLayout>
```

Source: https://docs.astro.build/en/guides/content-collections/ (VERIFIED)

### Pattern: Static Header (.astro, no mobile menu)

```astro
---
// src/components/layout/Header.astro
import { siteConfig } from '@/config/site';
---
<header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div class="container max-w-screen-xl mx-auto px-4 flex h-16 items-center justify-between">
    <a href="/" class="font-bold text-lg">{siteConfig.logo}</a>
    <nav class="hidden md:flex items-center gap-6">
      {siteConfig.navigation.map(item => (
        <a href={item.href} class="text-sm font-medium hover:text-primary transition-colors">
          {item.name}
        </a>
      ))}
      <!-- ThemeToggle island placeholder — replaced in Phase 4 -->
      <div class="w-9 h-9" aria-hidden="true"></div>
    </nav>
    <!-- Mobile menu placeholder — replaced in Phase 4 -->
  </div>
</header>
```

### Pattern: BlogCard.astro

```astro
---
// src/components/blog/BlogCard.astro
interface Props {
  title: string;
  description: string;
  slug: string;
  logo: string;
  dateDisplay: string;
  tags: string[];
}
const { title, description, slug, logo, dateDisplay, tags } = Astro.props;
---
<a href={`/blogs/${slug}`}>
  <div class="overflow-hidden rounded-xl border bg-card text-card-foreground flex flex-col gap-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
    <div class="aspect-video w-full bg-secondary flex items-center justify-center overflow-hidden">
      <img src={logo} alt={title} width="600" height="338" class="object-cover w-full h-full" loading="lazy" />
    </div>
    <div class="px-6 pb-6 space-y-3">
      <h3 class="text-xl font-bold line-clamp-2">
        <span class="hover:text-primary transition-colors">{title}</span>
      </h3>
      <p class="text-sm text-muted-foreground line-clamp-3">{description}</p>
      <div class="flex flex-col justify-between text-xs text-muted-foreground pt-2 gap-4">
        <span>Published: {dateDisplay}</span>
        <div class="flex gap-2 flex-wrap">
          {tags.map(tag => (
            <span class="inline-flex items-center rounded-full border border-transparent bg-secondary text-secondary-foreground px-2 py-0.5 text-xs font-medium">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
</a>
```

### Pattern: SEO head in BaseLayout

```astro
---
const canonical = new URL(Astro.url.pathname, siteConfig.site).href;
const fullOgImage = ogImage ? new URL(ogImage, siteConfig.site).href : undefined;
---
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonical} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={canonical} />
  <meta property="og:type" content={ogType} />
  {fullOgImage && <meta property="og:image" content={fullOgImage} />}
  <meta name="generator" content={Astro.generator} />
</head>
```

### Pattern: JSON-LD Script Tag in BlogLayout

```astro
---
const jsonLd = generateBlogJsonLd(postForJsonLd);
---
<script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />
```

**Note:** `set:html` is the Astro way to render raw HTML/text content without escaping. Required for JSON-LD `<script>` tags.

---

## State of the Art

| Old Approach | Current Approach | Notes |
|--------------|------------------|-------|
| Next.js `generateMetadata()` | Props on Astro layout + manual `<meta>` tags | No magic; explicit but simple |
| Next.js `next/image` | Astro `<Image>` from `astro:assets` (or plain `<img>` for public/) | Static mode: `<Image>` still works but no optimization without Cloudflare adapter |
| Next.js `generateStaticParams` | Astro `getStaticPaths()` | Same concept, different API |
| `next/link` for `<a>` tags | Plain `<a href={...}>` in .astro files | No prefetching by default in static mode |
| React component `className` | `.astro` template `class` | Breaking difference — `className` in .astro templates renders literally |
| `export const revalidate` / ISR | Not applicable — `output: 'static'` is purely SSG | No ISR in static mode |

---

## Open Questions

1. **ThemeToggle in Header placeholder**
   - What we know: Phase 2 needs a static header; Phase 4 adds the SolidJS ThemeToggle island
   - What's unclear: Should Phase 2 include a static sun/moon icon that does nothing (preserves visual layout) or an empty placeholder div?
   - Recommendation: Empty `<div class="w-9 h-9">` placeholder — no misleading UI; avoids hardcoding a static icon that will be replaced

2. **tsconfig.json `exclude` for src/lib and src/components**
   - What we know: Currently excludes `src/lib` and `src/components` to avoid React TS errors; this hides the `blog-manifest` import error
   - What's unclear: Should `src/lib` be re-enabled in tsconfig after rewriting `blogs.ts`? And should new `.astro` component files be in a separate directory to avoid the exclusion?
   - Recommendation: Keep `src/components` excluded (React files still there); remove `src/lib` from exclude AFTER rewriting `blogs.ts` to verify no remaining issues. New `.astro` components in `src/components/` will be excluded too — this is fine since `.astro` files are checked via `astro check`, not tsc directly.

3. **About page content**
   - What we know: The original `src/app/about/page.tsx` renders `<HeroSection />` — the same hero as the home page. No unique about-page content was found in the codebase.
   - What's unclear: Is the about page really just the hero section with no other content?
   - Recommendation: Replicate exactly — `about.astro` renders `HeroSection.astro` with `BaseLayout`. The original site does the same.

---

## Environment Availability

All dependencies for Phase 2 are either already installed or installable via npm. No external services or CLI tools beyond `npm` are required.

| Dependency | Required By | Available | Version | Notes |
|------------|------------|-----------|---------|-------|
| astro | Pages, layouts | Yes | ^6.1.1 | Installed in Phase 1 |
| @astrojs/mdx | MDX rendering | Yes | ^5.0.3 | Installed in Phase 1 |
| @astrojs/sitemap | Sitemap generation | Yes | ^3.7.2 | Installed in Phase 1 |
| schema-dts | json-ld.ts types | No | — | Must install: `npm install schema-dts` |
| Node.js 22+ | Astro 6 requirement | Yes | — | Required by Astro 6; present from Phase 1 |

---

## Sources

### Primary (HIGH confidence)
- https://docs.astro.build/en/basics/layouts/ — Layout slot pattern, props API
- https://docs.astro.build/en/guides/content-collections/ — getStaticPaths + render() + entry.id
- https://docs.astro.build/en/guides/images/ — public/ image handling behavior
- https://docs.astro.build/en/guides/integrations-guide/sitemap/ — Output URLs (/sitemap-index.xml), filter config
- `git show main:src/app/globals.css` — CSS variable token definitions (direct read of original)
- Direct code inspection: `src/components/`, `src/lib/blogs.ts`, `src/lib/json-ld.ts`, `src/config/site.ts`, `src/content.config.ts`, `astro.config.mjs`, `package.json`, `.astro/data-store.json`

### Secondary (MEDIUM confidence)
- https://docs.astro.build/en/guides/routing/ — Dynamic routes, getStaticPaths syntax

### Tertiary (LOW — not needed)
- None

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages installed; schema-dts gap confirmed by package.json inspection
- Architecture (layouts, pages): HIGH — Astro docs verified; patterns confirmed against real codebase
- CSS token gap: HIGH — confirmed by direct code inspection of both original and Astro globals.css
- Route params (entry.id vs slug): HIGH — confirmed via data-store.json inspection + Astro docs
- Pitfalls: HIGH — all pitfalls derived from direct code inspection, not inference

**Research date:** 2026-03-27
**Valid until:** 2026-04-27 (Astro 6.x is stable; stack unlikely to change in 30 days)
