# Phase 1: Foundation & Content Pipeline — Research

**Researched:** 2026-03-27
**Domain:** Astro 6 project scaffold, Tailwind CSS 4 Vite integration, content collections, MDX frontmatter conversion, SolidJS island setup
**Confidence:** HIGH — all critical technical questions verified against official docs and npm registry

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FOUND-01 | Astro 6 project scaffold with TypeScript 6, Vite 7, Node 22+ | Astro 6.1.1 requires Node 22.12+; bundles Vite 7; tsconfig extends `astro/tsconfigs/strict` |
| FOUND-02 | Tailwind CSS 4.2.2 configured via @tailwindcss/vite plugin | Confirmed: vite.plugins array in astro.config.mjs; `@import "tailwindcss"` in CSS |
| FOUND-03 | SolidJS integration (@astrojs/solid-js 6.0.1) enabled for islands | Confirmed: integrations array; tsconfig jsxImportSource for per-file pragma |
| FOUND-04 | Site config (name, nav, socials, author) ported to Astro | Direct TypeScript port of src/config/site.ts — no API changes needed |
| FOUND-05 | Path aliases (@/* → ./src/*) configured in tsconfig | `paths` in tsconfig.json; `@/blogs/*` alias also needed for blogs/ directory |
| CONT-01 | All existing MDX blog posts render correctly in Astro content collections | MDX frontmatter must be converted from `export const meta` to YAML; then glob loader reads from blogs/ base |
| CONT-04 | Blog slugs match current URL structure (no broken links) | YAML frontmatter `slug` field overrides generated id; each post has explicit `slug` in current meta object |
| CONT-05 | Frontmatter metadata (title, date, tags, logo) parsed via Zod schema | Zod schema in src/content.config.ts; Astro 6 uses Zod 4 — import from `astro/zod` |
</phase_requirements>

---

## Project Constraints (from CLAUDE.md)

- **Content preservation**: All existing MDX blog posts must work without content file modifications
- **URL parity**: All existing routes must be preserved (no broken links)
- **Deployment target**: Must remain on Cloudflare (Pages or Workers)
- **Styling**: Keep Tailwind CSS v4 — no style framework change
- **SolidJS scope**: Only for interactive components; static content rendered by Astro
- **Workflow**: All file changes must go through GSD commands; do not make direct repo edits outside a GSD workflow

**Content preservation interpretation (STATE.md decision):** The "no content file modification" constraint is interpreted as "no content text changes." Converting `export const meta = {...}` to YAML frontmatter is a mechanical metadata format change, not a content change. This decision was pre-approved in STATE.md. Convert all 9 MDX files to YAML frontmatter in Phase 1.

---

## Summary

Phase 1 is a greenfield Astro scaffold replacing the entire Next.js project in-place on the `feature/migration` branch. The critical dependency chain is: (1) convert MDX frontmatter to YAML, (2) scaffold Astro at project root, (3) configure Tailwind v4 via Vite plugin, (4) configure content collections with glob loader pointing at `blogs/`, (5) wire up SolidJS integration. Everything downstream depends on content collections working correctly with correct slugs.

The two biggest technical risks in this phase are the MDX frontmatter conversion (format incompatibility confirmed) and the Tailwind v4 configuration (must use `@tailwindcss/vite`, never `@astrojs/tailwind`). Both are resolved by following the verified patterns documented here.

Astro 6 introduced two breaking changes directly relevant to this phase: (1) the content collections config file moved to `src/content.config.ts` (was `src/content/config.ts` in Astro 2-4), and (2) Zod upgraded to v4 with API changes — always import `z` from `astro/zod`, never from the bare `zod` package. Node 22.12+ is required; the machine has Node 24 available, which satisfies this.

**Primary recommendation:** Delete all Next.js files first, then scaffold Astro from scratch, then move content. Do not try to incrementally convert — the `tsconfig.json`, `package.json`, and root config files are incompatible between the two frameworks.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| astro | 6.1.1 | Framework, routing, SSG, MDX, image optimization | Replaces Next.js entirely; static-first, islands architecture |
| solid-js | 1.9.12 | Interactive islands runtime | Per project constraint; ~7 KB vs React ~45 KB |
| typescript | 6.0.2 | Type checking | Current; Astro 6 ships with TS 6 support |
| vite | 7.x | Bundler | Ships with Astro 6; no separate install |

### Astro Integrations
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @astrojs/solid-js | 6.0.1 | SolidJS island support | Official integration; handles SSR/hydration |
| @astrojs/mdx | 5.0.3 | MDX content processing | Official; replaces @next/mdx + @mdx-js/* |
| @astrojs/sitemap | 3.7.2 | Auto-generated sitemap.xml | Official; auto-discovers all Astro routes |
| @astrojs/cloudflare | 13.1.4 | Cloudflare Pages adapter | Official; replaces @opennextjs/cloudflare |

### Styling
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| tailwindcss | 4.2.2 | Utility-first CSS | Always; project constraint |
| @tailwindcss/vite | 4.2.2 | Vite plugin for Tailwind v4 | Always in Astro; NOT @astrojs/tailwind |

### Fonts
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @fontsource-variable/geist | 5.2.8 | Geist Sans variable font | Replaces next/font/google; self-hosted |
| @fontsource-variable/geist-mono | 5.2.7 | Geist Mono variable font | For code blocks; CSS variable --font-geist-mono |

### Content & MDX
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| remark-gfm | 4.0.1 | GitHub Flavored Markdown | Always; tables, strikethrough, task lists |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| @tailwindcss/vite | @astrojs/tailwind | @astrojs/tailwind is Tailwind v3 only — DO NOT USE |
| @fontsource-variable/geist | geist npm package | geist package is Next.js-only; Fontsource is framework-agnostic |
| @fontsource-variable/geist | Google Fonts CDN link | Self-hosted avoids external request; Fontsource preferred |
| src/content.config.ts | src/content/config.ts | Old Astro 2-4 path; removed in Astro 5+ — DO NOT USE |

**Installation (Phase 1 packages only):**
```bash
# Remove all Next.js deps first (see files-to-delete section)
# Then install Astro and Phase 1 dependencies:
npm install astro @astrojs/solid-js @astrojs/mdx @astrojs/sitemap @astrojs/cloudflare
npm install solid-js
npm install tailwindcss @tailwindcss/vite
npm install @fontsource-variable/geist @fontsource-variable/geist-mono
npm install remark-gfm
npm install -D typescript wrangler
```

**Verified versions (2026-03-27 npm registry):**
- astro: 6.1.1
- @astrojs/solid-js: 6.0.1
- @astrojs/mdx: 5.0.3
- @astrojs/sitemap: 3.7.2
- @astrojs/cloudflare: 13.1.4
- tailwindcss: 4.2.2
- @tailwindcss/vite: 4.2.2
- solid-js: 1.9.12
- @fontsource-variable/geist: 5.2.8
- @fontsource-variable/geist-mono: 5.2.7
- remark-gfm: 4.0.1
- typescript: 6.0.2

---

## Architecture Patterns

### Recommended Project Structure
```
(project root)
├── blogs/                    # PRESERVED — MDX source files (converted to YAML frontmatter)
├── public/                   # PRESERVED — static assets (images, favicon, etc.)
├── src/
│   ├── content.config.ts     # NEW — collection definitions (Astro 6 location)
│   ├── pages/                # NEW — replaces src/app/
│   │   └── index.astro       # placeholder for Phase 1 (real pages in Phase 2)
│   ├── layouts/              # NEW — BaseLayout.astro, BlogLayout.astro (Phase 2)
│   ├── components/           # NEW — static .astro and SolidJS .tsx islands
│   ├── styles/
│   │   └── globals.css       # MIGRATED — @import "tailwindcss"; CSS variables
│   ├── config/
│   │   └── site.ts           # PRESERVED — direct copy, no changes
│   ├── lib/                  # MIGRATED — blogs.ts, json-ld.ts, img.ts (Phase 2)
│   └── types/                # MIGRATED — blog.ts, certification.ts
├── astro.config.mjs          # NEW — framework config
├── tsconfig.json             # REPLACED — Astro-compatible config
└── package.json              # REPLACED — Astro deps, no Next.js
```

### Files to Delete (Next.js cleanup)
```
# Root config files — delete entirely:
next.config.ts
next-env.d.ts
open-next.config.ts
cloudflare-env.d.ts
postcss.config.mjs
components.json
mdx-components.tsx            # will be re-created as src/components/mdx/
image-loader.ts

# Source directories — delete entirely:
src/app/                      # entire Next.js App Router directory
src/hooks/                    # React-specific hooks (useIsMobile.ts)
src/data/                     # blog-manifest.ts (replaced by content collections)

# Scripts — delete entirely:
scripts/generate-blog-manifest.mjs

# Dependency files that will be regenerated:
# (package.json rewritten, package-lock.json regenerated)
```

### Files to Preserve
```
blogs/                        # MDX content (frontmatter will be converted)
public/                       # All static assets intact
src/config/site.ts            # Direct copy — framework-agnostic
src/types/blog.ts             # Keep structure; update type names if needed
src/types/certification.ts    # Keep as-is
src/lib/json-ld.ts            # Direct copy — plain TypeScript, no React deps
src/lib/img.ts                # Keep utility logic; update Next.js-specific paths
src/lib/blogs.ts              # Rewrite to use getCollection() instead of manifest
```

### Pattern 1: Astro 6 Config — Complete astro.config.mjs
**What:** Single configuration file combining all integrations and Vite plugins
**When to use:** Always — this is the Astro 6 canonical config
```typescript
// astro.config.mjs
// Source: https://docs.astro.build + https://tailwindcss.com/docs/installation/framework-guides/astro
import { defineConfig } from 'astro/config';
import solidJs from '@astrojs/solid-js';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import remarkGfm from 'remark-gfm';

export default defineConfig({
  site: 'https://izharikov.dev',
  output: 'static',
  adapter: cloudflare(),
  integrations: [
    solidJs(),
    mdx({
      remarkPlugins: [remarkGfm],
      // syntaxHighlight: 'shiki' is the default — leave as-is for Phase 1
      // custom MDX components passed via <Content components={...}> in Phase 3
    }),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      // dual-theme config goes here in Phase 3
    },
  },
});
```

### Pattern 2: Content Collections Config — src/content.config.ts
**What:** Defines the blog collection schema using Zod 4 (bundled with Astro 6)
**When to use:** The ONLY content collections config file; must be at `src/content.config.ts`

**CRITICAL:** Astro 6 uses Zod 4. Import `z` from `astro/zod`, never from bare `zod` package. Zod 4 has API changes: `z.string().email()` → `z.email()`, error messages use `error` not `message` property.

```typescript
// src/content.config.ts
// Source: https://docs.astro.build/en/guides/content-collections/
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({
    pattern: '**/*.mdx',
    base: './blogs',
    generateId: ({ entry }) => {
      // Strip numeric prefix: "1-xp-precompilation.mdx" → "xp-precompilation"
      // This is the fallback — explicit slug in YAML frontmatter takes priority
      return entry.replace(/^\d+-/, '').replace(/\.mdx$/, '');
    },
  }),
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),     // explicit slug override in frontmatter
    logo: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    date: z.string(),                // keep as string; parse in lib/blogs.ts
  }),
});

export const collections = { blog };
```

**Slug strategy (CONT-04):** The current `export const meta` objects already contain explicit `slug` fields (e.g., `slug: "xp-precompilation"`). These become the YAML `slug:` field. The `generateId` in glob() is only a fallback if the frontmatter `slug` is missing. Both mechanisms together guarantee URL parity.

### Pattern 3: MDX Frontmatter Conversion
**What:** Convert each MDX file from `export const meta = {...}` to YAML frontmatter
**When to use:** Must be done BEFORE any Astro scaffolding can consume the content

Current format (incompatible with Astro content collections):
```mdx
export const meta = {
    title: "Sitecore XP MVC Views Precompilation: Make Startup 4+ Times Faster",
    slug: "xp-precompilation",
    logo: "/images/sitecore-techtalks.png",
    description: "Learn how to precompile Sitecore XP MVC views...",
    tags: ["XP", "MVC", "Razor", "Performance"],
    date: "20.01.2025",
};

{/* ----- */}
```

Target format (YAML frontmatter — Astro content collections):
```mdx
---
title: "Sitecore XP MVC Views Precompilation: Make Startup 4+ Times Faster"
slug: "xp-precompilation"
logo: "/images/sitecore-techtalks.png"
description: "Learn how to precompile Sitecore XP MVC views..."
tags: ["XP", "MVC", "Razor", "Performance"]
date: "20.01.2025"
---

{/* ----- */}
```

**Special case — template literals:** Post 9 uses backtick strings in meta (e.g., `title: \`Sitecore Marketplace Apps: Custom Authorization Setup\``). Convert to double-quoted YAML strings.

**Special case — in-file import:** Post 9 has `import { Img } from '@/components/ui/img';` after the meta block. This import line stays in the MDX body (not in frontmatter); it will cause a build error until Phase 3 creates the Astro-compatible Img component. For Phase 1, the goal is only that `getCollection('blog')` returns correct metadata — full rendering is Phase 2/3.

### Pattern 4: TypeScript Config for Astro 6 + SolidJS
**What:** tsconfig.json that satisfies Astro strict mode + SolidJS JSX coexistence
**When to use:** Replace the current Next.js-based tsconfig entirely

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist", "node_modules"],
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "solid-js",
    "paths": {
      "@/*": ["./src/*"],
      "@/blogs/*": ["./blogs/*"]
    }
  }
}
```

**SolidJS JSX coexistence:** Because `jsxImportSource` is set globally to `solid-js`, `.astro` files automatically use Astro's own JSX handling (not affected by this setting). SolidJS `.tsx` island files use solid-js JSX. If any file needs a different JSX source (e.g., a future React component — NOT planned), add `/** @jsxImportSource react */` pragma at the top of that file.

**Removed from old tsconfig:**
- `"plugins": [{"name": "next"}]` — Next.js plugin, remove
- `"types": ["./cloudflare-env.d.ts", "node"]` — cloudflare-env.d.ts deleted
- `"include": ["next-env.d.ts", ".next/types/**/*.ts"]` — Next.js artifacts

### Pattern 5: Tailwind CSS v4 Global Stylesheet
**What:** globals.css with Tailwind v4 import syntax + CSS variables for fonts
**When to use:** Single global stylesheet imported in BaseLayout.astro

```css
/* src/styles/globals.css */
/* Source: https://tailwindcss.com/docs/installation/framework-guides/astro */
@import "tailwindcss";

/* Font variables — replaces next/font/google variable injection */
@import "@fontsource-variable/geist/wght.css";
@import "@fontsource-variable/geist-mono/wght.css";

:root {
  --font-geist-sans: 'Geist Variable', sans-serif;
  --font-geist-mono: 'Geist Mono Variable', monospace;
}
```

**NOTE:** Existing Tailwind `dark:` variant classes, `@apply` directives, and CSS custom properties from the current `globals.css` all continue to work unchanged under Tailwind v4's Vite plugin processing.

### Pattern 6: Using Content Collections in Pages
**What:** How to query and render blog entries from content collections
**When to use:** Phase 2 pages; documented here so planner understands the API

```typescript
// src/pages/blogs/[slug].astro (Phase 2)
// Source: https://docs.astro.build/en/guides/content-collections/
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.data.slug ?? post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
// Note: render() is a standalone import in Astro 6 (was entry.render() in Astro 4)
```

```typescript
// src/pages/blogs/index.astro (Phase 2)
const allPosts = await getCollection('blog');
// Filter, sort by date, etc.
```

### Anti-Patterns to Avoid
- **Using `src/content/config.ts`:** Old Astro 2-4 path. Astro 5+ requires `src/content.config.ts`. Will be silently ignored or cause confusing errors.
- **Using `@astrojs/tailwind` integration:** Designed for Tailwind v3 + PostCSS. Will produce zero styles in v4. Use only `@tailwindcss/vite` in the `vite.plugins` array.
- **Using `entry.render()`:** Old Astro 4 API. Astro 6 uses standalone `render(entry)` imported from `astro:content`.
- **Using `getEntryBySlug()` or `getDataEntryById()`:** Removed in Astro 6. Use `getEntry()` only.
- **Importing `z` from `zod`:** In Astro 6 projects, always `import { z } from 'astro/zod'` to get the Zod 4 version bundled with Astro.
- **Mixing import and YAML frontmatter in the same MDX file's metadata:** Either the `export const meta` pattern OR YAML `---` — never both.
- **Using `@import "@tailwindcss/..."` with old directive syntax (`@tailwind base`):** Tailwind v4 uses `@import "tailwindcss"` as a single directive.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Content frontmatter parsing | Custom gray-matter script | Astro content collections + Zod schema | Built-in validation, TypeScript inference, IDE autocomplete |
| Blog manifest generation | `scripts/generate-blog-manifest.mjs` equivalent | `getCollection('blog')` at build time | Content Layer API replaces all manifest patterns natively |
| Slug ID generation | Custom slug transform function | `slug` field in YAML frontmatter (primary) + `generateId` in glob loader (fallback) | Two-layer safety; no runtime transform needed |
| CSS variable injection for fonts | JS-based class injection | CSS `@import` + `:root` variables in globals.css | Pure CSS; zero JS; loads synchronously before paint |
| Vite config for Tailwind | postcss.config.mjs | @tailwindcss/vite plugin in astro.config.mjs | Official v4 path; handles all CSS processing through Vite |

**Key insight:** The entire `scripts/generate-blog-manifest.mjs` + `src/data/blog-manifest.ts` system is replaced by Astro content collections. All 9 blog posts become discoverable via a single `await getCollection('blog')` call with type-safe frontmatter.

---

## Common Pitfalls

### Pitfall 1: Wrong Content Config File Location
**What goes wrong:** Creating `src/content/config.ts` (Astro 2-4 location) instead of `src/content.config.ts` (Astro 5+ location).
**Why it happens:** Most blog tutorials and training data reference the old path.
**How to avoid:** File must be at project root `src/content.config.ts`. The content *files* still live in `src/content/blog/` or anywhere pointed to by the `base` param in the glob loader.
**Warning signs:** `getCollection('blog')` returns empty array despite MDX files existing; no TypeScript errors but zero entries at runtime.

### Pitfall 2: Tailwind Produces Zero Styles
**What goes wrong:** Adding `@astrojs/tailwind` integration to `integrations[]` instead of `@tailwindcss/vite` to `vite.plugins[]`.
**Why it happens:** `@astrojs/tailwind` is still published and appears in search results, but it's for Tailwind v3 and PostCSS.
**How to avoid:** Only add tailwind to `vite: { plugins: [tailwindcss()] }`. Never add it to `integrations`.
**Warning signs:** No Tailwind styles applied anywhere; no build error (the integration just does nothing useful for v4).

### Pitfall 3: Zod Schema Errors in Astro 6
**What goes wrong:** Using `import { z } from 'zod'` or Zod 3 API patterns in content.config.ts.
**Why it happens:** Astro 6 upgraded to Zod 4 which has breaking API changes. Bare `zod` package in node_modules is Zod 4 but you may have wrong API usage from Zod 3 training data.
**How to avoid:** Always `import { z } from 'astro/zod'`. For string validation: use `z.string()` for basic strings; Zod 4 moved email/url/etc. to top-level (`z.email()` not `z.string().email()`). For this blog schema, all fields are basic strings/arrays — no Zod 4 breaking changes apply to the schema defined here.
**Warning signs:** TypeScript errors on schema definition; runtime Zod validation errors at build time.

### Pitfall 4: MDX Files With `export const meta` Return Empty Frontmatter
**What goes wrong:** MDX files in content collections show up in `getCollection()` but all `data` fields are `undefined`.
**Why it happens:** Astro's Content Layer API reads YAML frontmatter via gray-matter. The JS `export const meta = {...}` pattern is a module export, not frontmatter. There is no error — Astro simply finds no YAML block.
**How to avoid:** Convert all 9 MDX files to YAML frontmatter before scaffolding Astro. Verify with a quick `getCollection('blog')` check in a test page.
**Warning signs:** `post.data.title` is `undefined`; blog listing shows blank titles/dates; no build error.

### Pitfall 5: Slug Mismatch Breaks URL Parity
**What goes wrong:** File `1-xp-precompilation.mdx` generates id `1-xp-precompilation` instead of `xp-precompilation`. All current blog links pointing to `/blogs/xp-precompilation` would 404.
**Why it happens:** glob() default ID generation uses the full filename minus extension. The numeric prefix is part of the filename.
**How to avoid:** Two-layer defense — (1) add explicit `slug: "xp-precompilation"` to every post's YAML frontmatter (matches the `slug` field already in `export const meta`), and (2) add `generateId` to strip numeric prefix as fallback. Then in `getStaticPaths()` use `post.data.slug ?? post.id` for the route param.
**Warning signs:** `/blogs/1-xp-precompilation` works but `/blogs/xp-precompilation` 404s; or vice versa.

### Pitfall 6: SolidJS JSX Conflict With Astro Files
**What goes wrong:** `.astro` files show TypeScript errors about JSX when `jsxImportSource: "solid-js"` is set globally.
**Why it happens:** Misunderstanding of Astro's TypeScript setup — `jsxImportSource` only affects `.tsx`/`.jsx` files, not `.astro` files. Astro uses its own compiler for `.astro` files regardless of `jsxImportSource`.
**How to avoid:** Set `"jsxImportSource": "solid-js"` in tsconfig.json — this is correct and does NOT affect `.astro` files. Do NOT attempt to set `"jsx": "react-jsx"` (old Next.js setting). Keep `"jsx": "preserve"`.
**Warning signs:** Type errors in `.astro` files about JSX namespace; usually a false alarm from incorrect tsconfig.

### Pitfall 7: Geist Font CSS Variable Not Defined
**What goes wrong:** The existing `src/lib/` code and components reference `--font-geist-sans` and `--font-geist-mono` CSS variables. Without redefining these, components fall back to system fonts silently.
**Why it happens:** `next/font/google` injected these CSS variables automatically. Fontsource does not inject them — you must define them manually in CSS.
**How to avoid:** In globals.css, after the `@import "@fontsource-variable/geist/wght.css"` line, explicitly add `:root { --font-geist-sans: 'Geist Variable', sans-serif; --font-geist-mono: 'Geist Mono Variable', monospace; }`.
**Warning signs:** Body text renders in system sans-serif instead of Geist; code blocks use system monospace.

### Pitfall 8: Placeholder Page Required for Dev Server
**What goes wrong:** `astro dev` fails or serves an error if `src/pages/` directory doesn't contain at least one `.astro` file.
**Why it happens:** Astro requires at least one page to be defined.
**How to avoid:** Create a minimal `src/pages/index.astro` placeholder immediately after scaffold. It can be just `<html><body><p>Phase 1 scaffold complete</p></body></html>` — proper pages come in Phase 2.

---

## Code Examples

Verified patterns from official documentation:

### Complete package.json Scripts (Astro 6)
```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "deploy": "astro build && wrangler pages deploy dist/"
  }
}
```

### Glob Loader with Base Outside src/
```typescript
// Source: https://docs.astro.build/en/reference/content-loader-reference/
import { glob } from 'astro/loaders';

// blogs/ directory is at project root, outside src/
// base path is relative to project root, not src/
loader: glob({
  pattern: '**/*.mdx',
  base: './blogs',           // relative to astro project root
  generateId: ({ entry }) => {
    // entry is filename relative to base, e.g. "1-xp-precompilation.mdx"
    // Strip numeric prefix for fallback slug
    return entry.replace(/^\d+-/, '').replace(/\.mdx$/, '');
  },
}),
```

### Content Collections API (Astro 6)
```typescript
// Source: https://docs.astro.build/en/guides/content-collections/
import { getCollection, getEntry, render } from 'astro:content';

// Get all posts
const posts = await getCollection('blog');

// Get single post by slug
const post = await getEntry('blog', 'xp-precompilation');

// Render MDX to HTML component
const { Content, headings } = await render(post);
// Note: render() is imported standalone (not post.render()) in Astro 6
```

### SolidJS Island Usage in .astro File
```astro
---
// Source: https://docs.astro.build/en/guides/integrations-guide/solid-js/
import ThemeToggle from '../components/ThemeToggle.tsx';
---

<!-- client:load = hydrates immediately; use for above-fold interactive elements -->
<ThemeToggle client:load />
```

### Fontsource Geist Import in globals.css
```css
/* Source: https://fontsource.org/fonts/geist/install */
@import "tailwindcss";
@import "@fontsource-variable/geist/wght.css";
@import "@fontsource-variable/geist-mono/wght.css";

:root {
  --font-geist-sans: 'Geist Variable', sans-serif;
  --font-geist-mono: 'Geist Mono Variable', monospace;
}

html {
  font-family: var(--font-geist-sans);
}
```

---

## MDX File Inventory

All 9 MDX files requiring frontmatter conversion:

| File | Current `slug` in meta | Confirmed `import` in body? |
|------|------------------------|------------------------------|
| `1-xp-precompilation.mdx` | `xp-precompilation` | No |
| `3-send-mcp.mdx` | (verify) | No (assumed) |
| `3-sitecore-ci-cd.mdx` | (verify) | No (assumed) |
| `4-sitecore-ch-dam-exam.mdx` | (verify) | No (assumed) |
| `5-sitecoreai-mcp-marketplace-symposium2025-recap.mdx` | (verify) | No (assumed) |
| `6-sitecore-mcp-server-issue.mdx` | (verify) | No (assumed) |
| `7-sitecore-marketplace-updates.mdx` | (verify) | No (assumed) |
| `8-sitecore-marketplace-ai-tools.mdx` | (verify) | No (assumed) |
| `9-sitecore-marketplace-app-server-side-authentication.mdx` | `sitecore-marketplace-app-custom-authorization-setup` | **YES** — `import { Img } from '@/components/ui/img'` |

**For post 9:** The `import { Img }` line stays in the MDX body after conversion to YAML frontmatter. It will cause a build error when Astro tries to render the blog detail page, but Phase 1 only needs `getCollection('blog')` to work — not full rendering. The import error is deferred to Phase 3 when the Astro-compatible `Img` component is created.

**Action required before checking each file:** Read each MDX file's first 10 lines to extract the exact `slug` value and check for any `import` statements. Only post 1 and post 9 have been directly inspected.

---

## Files-to-Delete Reference

Complete list of files to remove before or during Astro scaffold:

**Root-level files:**
- `next.config.ts` — Next.js config
- `next-env.d.ts` — Next.js type declarations
- `open-next.config.ts` — OpenNext Cloudflare config
- `cloudflare-env.d.ts` — Workers bindings types
- `postcss.config.mjs` — Tailwind v3 PostCSS config (replaced by Vite plugin)
- `components.json` — shadcn/ui config (no equivalent in Astro)
- `mdx-components.tsx` — Next.js global MDX component map (replaced by per-render `components` prop)
- `image-loader.ts` — next/image Cloudflare loader

**Source directories:**
- `src/app/` — entire Next.js App Router (pages, layouts, route groups)
- `src/data/blog-manifest.ts` — replaced by content collections
- `src/hooks/use-mobile.ts` — React hook (will be reimplemented as SolidJS signal if needed)

**Scripts:**
- `scripts/generate-blog-manifest.mjs` — entire scripts/ directory

**Keep these from src/:**
- `src/config/site.ts` — plain TypeScript, no framework deps
- `src/types/` — type definitions (update JSX-specific parts if any)
- `src/lib/json-ld.ts` — plain TypeScript
- `src/lib/blogs.ts` — rewrite to use getCollection()
- `src/lib/img.ts` — keep utility, update dev URL path

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js 22.12+ | Astro 6 minimum | Yes | 24.0.0 | — |
| npm | Package installation | Yes | (system) | — |
| wrangler | CF Pages deploy (Phase 5) | Yes (devDep) | 4.53.0 | — |

**All Phase 1 dependencies are npm packages** — no external services, databases, or system tools beyond Node/npm are required.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None configured (static site build; Astro's `astro check` for type checking) |
| Config file | None — use `astro check` as type gate |
| Quick run command | `npx astro check` |
| Full suite command | `npm run build` (full build validates all content collection parsing + type safety) |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | Notes |
|--------|----------|-----------|-------------------|-------|
| FOUND-01 | Astro 6 scaffold compiles and dev server starts | smoke | `npm run dev` (manual verify) | Pass = dev server starts without errors |
| FOUND-02 | Tailwind utility classes apply in browser | smoke | `npm run dev` (manual verify) | Pass = `text-red-500` produces red text |
| FOUND-03 | SolidJS island renders on page | smoke | `npm run dev` (manual verify) | Pass = minimal island renders without hydration error |
| FOUND-04 | siteConfig exports correct values | type | `npx astro check` | Pass = no TS errors in src/config/site.ts |
| FOUND-05 | @/* and @/blogs/* path aliases resolve | type | `npx astro check` | Pass = no "Cannot find module '@/...'" errors |
| CONT-01 | getCollection('blog') returns 9 entries | integration | `npm run build` | Pass = build completes; 9 blog entries in output |
| CONT-04 | Entry IDs match expected slugs | integration | `npm run build` | Pass = built paths match current URL slugs |
| CONT-05 | Zod schema validates all 9 posts | build-gate | `npm run build` | Pass = no Zod validation errors in build output |

### Wave 0 Gaps
- No test framework needed — validation is via `astro check` (type checking) and `npm run build` (content validation)
- A minimal smoke-test page is needed: create `src/pages/test-collections.astro` that calls `getCollection('blog')` and renders `post.data.title` for each entry — visual confirmation that CONT-01, CONT-04, CONT-05 pass before proceeding to Phase 2.

---

## Open Questions

1. **Slug values in posts 3–8 (unread)**
   - What we know: Posts 1 and 9 have been read and their slugs verified.
   - What's unclear: The exact `slug` values in posts 3–8 (the first `3-` file prefix collision is notable — two files start with `3-`).
   - Recommendation: Read the first 8 lines of each remaining MDX file before writing the YAML conversion task. The planner should include an explicit step to extract slug values from all 9 files.

2. **Two files with `3-` prefix**
   - What we know: `3-send-mcp.mdx` and `3-sitecore-ci-cd.mdx` both start with `3-`.
   - What's unclear: Whether this causes any ID collision in the glob loader.
   - Recommendation: Since each post has an explicit `slug` in its frontmatter, and the `generateId` is only a fallback, there should be no collision as long as the `slug` values are distinct. Verify both `slug` values differ.

3. **`motion` library usage in unread components**
   - What we know: STATE.md flags this as a pending audit for HeroSection.tsx, BlogCard.tsx, CertificationBadge.tsx.
   - What's unclear: Whether any animations exist that need a SolidJS equivalent.
   - Recommendation: Audit these three files before executing Phase 1. If motion is unused, remove the dependency in the package.json rewrite. This does not block Phase 1 but affects the dependency list.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `src/content/config.ts` | `src/content.config.ts` | Astro 5.0 | Must use new path; old path silently ignored |
| `entry.render()` method | `render(entry)` standalone import | Astro 5.0 | Old method removed in Astro 6 |
| `getEntryBySlug()` | `getEntry()` | Astro 5.0 | Old function removed in Astro 6 |
| Zod 3 (`z.string().email()`) | Zod 4 (`z.email()`) | Astro 6.0 | Breaking for complex schemas; not applicable to this blog's simple schema |
| `@astrojs/tailwind` integration | `@tailwindcss/vite` Vite plugin | Tailwind v4 / early 2025 | Old integration produces zero styles with Tailwind v4 |
| `@next/mdx` + compile-time imports | `@astrojs/mdx` + content collections | Astro migration | Content Layer API; type-safe frontmatter; glob loader |

---

## Sources

### Primary (HIGH confidence)
- [Astro Content Collections Docs](https://docs.astro.build/en/guides/content-collections/) — config file location `src/content.config.ts`, glob loader API, slug override
- [Astro Content Loader Reference](https://docs.astro.build/en/reference/content-loader-reference/) — generateId option, glob pattern, base parameter
- [Tailwind CSS + Astro Install Guide](https://tailwindcss.com/docs/installation/framework-guides/astro) — exact `@tailwindcss/vite` + `vite.plugins` config
- [Astro @astrojs/solid-js Docs](https://docs.astro.build/en/guides/integrations-guide/solid-js/) — integrations array, tsconfig jsxImportSource
- [Astro @astrojs/mdx Docs](https://docs.astro.build/en/guides/integrations-guide/mdx/) — components prop pattern, remark/rehype plugins
- [Astro TypeScript Docs](https://docs.astro.build/en/guides/typescript/) — tsconfig presets, path aliases, SolidJS coexistence
- [Upgrade to Astro v6](https://docs.astro.build/en/guides/upgrade-to/v6/) — Node 22.12+ requirement, Zod 4, removed APIs

### Secondary (MEDIUM confidence)
- npm registry (2026-03-27): verified package versions for astro, @astrojs/solid-js, @astrojs/mdx, @astrojs/sitemap, @astrojs/cloudflare, tailwindcss, @tailwindcss/vite, solid-js, @fontsource-variable/geist, @fontsource-variable/geist-mono, remark-gfm, typescript
- [Fontsource Geist Install](https://fontsource.org/fonts/geist/install) — CSS import syntax for variable font; CSS variable definition pattern
- WebSearch cross-reference: content.config.ts location confirmed across multiple 2026 sources

### Tertiary (LOW confidence — flag for validation)
- Exact font-family name for `@fontsource-variable/geist` (`'Geist Variable'`) — confirmed by search but should be verified against the installed package's CSS at runtime if fonts don't load

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all versions verified against npm registry 2026-03-27
- Architecture: HIGH — content collections config location and glob loader API verified against official docs
- Pitfalls: HIGH — MDX frontmatter format confirmed by reading actual source files; other pitfalls verified against official upgrade guide
- Tailwind config: HIGH — verified against tailwindcss.com official framework guide

**Research date:** 2026-03-27
**Valid until:** 2026-05-01 (Astro and Tailwind are actively developed; re-verify if >6 weeks pass)
