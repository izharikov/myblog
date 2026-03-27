# Project Research Summary

**Project:** Next.js to Astro + SolidJS Blog Migration
**Domain:** Personal technical blog — static content, MDX posts, Cloudflare-deployed
**Researched:** 2026-03-27
**Confidence:** MEDIUM-HIGH (stack and architecture are well-understood; some version numbers require verification against npm)

## Executive Summary

This is a brownfield framework migration of a personal developer blog: Next.js 16 + React 19 (deployed via OpenNext on Cloudflare Workers) is being replaced with Astro 6.1.1 + SolidJS 1.9.12 (deployed via the official Cloudflare adapter on Cloudflare Pages). The migration is feature-preserving — no new features, no redesign — and the destination stack is a natural fit for the content: Astro's static-first island architecture means the final site ships zero JS by default, with only two small SolidJS islands required (ThemeToggle and mobile Header menu). The elimination of React, OpenNext, the ISR R2 cache, and the custom blog manifest generation script represents a significant simplification. Syntax highlighting moves from a 150 KB client-side React component to Astro's built-in Shiki (build-time, zero client JS), which is the most impactful single performance win.

The recommended approach is a strict phase sequence driven by content-pipeline dependencies: the MDX frontmatter incompatibility must be resolved first (before any Astro scaffolding begins), followed by foundation setup, static pages, SolidJS islands, and finally deployment rewiring. The critical path is: content schema → content pipeline → layouts → pages → islands → SEO → deployment. Verified versions as of March 2026 are Astro 6.1.1, SolidJS 1.9.12 (stable; 2.0 is beta-only), TypeScript 6.0, Tailwind CSS 4.2.2, @astrojs/solid-js 6.0.0, and @astrojs/cloudflare 13.x. Note that Astro has joined Cloudflare, giving first-class Cloudflare Workers support in Astro 6.

The primary technical risk of this migration is the MDX frontmatter format mismatch: current posts use `export const meta = {...}` (JS module exports), but Astro content collections expect YAML frontmatter. This must be resolved as a prerequisite — either convert all 9 MDX files to YAML (recommended: clean, enables type-safe collections) or preserve the JS-export pattern using `import.meta.glob` (avoids file modification but sacrifices content collections). A second risk cluster involves the React-only dependencies that cannot be ported: `next-themes`, `react-syntax-highlighter`, Radix UI, `next/image`, and `next/link` must all be replaced with Astro-native or SolidJS equivalents before the site builds at all.

## Key Findings

### Recommended Stack

The target stack retains the framework-agnostic tools unchanged (Tailwind CSS v4, clsx, tailwind-merge, class-variance-authority, schema-dts, remark-gfm, wrangler) and surgically replaces only what is framework-coupled. Astro 6.1.1 provides routing, layouts, MDX processing, image optimization, sitemap generation, and Cloudflare Pages deployment via a single official adapter. SolidJS 1.9.12 handles the two interactive islands. The `@astrojs/tailwind` integration must NOT be used — it targets Tailwind v3. The correct path for Tailwind v4 is the `@tailwindcss/vite` Vite plugin added directly to `astro.config.mjs`.

**Core technologies:**
- **Astro 6.1.1**: Framework, routing, SSG, MDX, image optimization, Cloudflare adapter — replaces Next.js entirely
- **SolidJS 1.9.12**: Interactive islands (ThemeToggle, mobile Header menu) — replaces React; ships ~7 KB vs React's ~45 KB
- **@astrojs/cloudflare 13.x**: Cloudflare Pages adapter — replaces `@opennextjs/cloudflare` shim entirely; `output: 'static'` mode
- **Tailwind CSS 4.2.2 + @tailwindcss/vite**: Styling — same utility classes, new Vite-native integration
- **Astro built-in Shiki**: Syntax highlighting — replaces react-syntax-highlighter; zero client JS, build-time
- **@kobalte/core 0.13.11**: Accessible SolidJS UI primitives for dialog/dropdown — pre-1.0, consider hand-rolling given small scope
- **lucide-solid**: Icon library — drop-in replacement for lucide-react (identical API, different import path)
- **Inline `<script is:inline>`**: Theme initialization — replaces next-themes with ~5 lines of JS; zero dependencies

**Removed entirely (no replacement needed):**
react, react-dom, @radix-ui/*, lucide-react, next-themes, @next/mdx, @mdx-js/loader, @mdx-js/react, next-mdx-remote, react-syntax-highlighter, @opennextjs/cloudflare, eslint-config-next, image-loader.ts, generate-blog-manifest.mjs, blog-manifest.ts, open-next.config.ts, cloudflare-env.d.ts

### Expected Features

This migration is strictly feature-parity. All 27 current features must be preserved; no new features are in scope.

**Must have (table stakes — all currently present, all must survive migration):**
- MDX blog posts render correctly via Astro content collections + @astrojs/mdx
- Blog listing page and blog detail pages with slug routing
- Syntax highlighting (build-time Shiki with CSS-variable dual themes — not runtime)
- Dark/light theme toggle persisted to localStorage (SolidJS island + inline head script)
- Responsive layout, sticky header, mobile menu drawer (SolidJS island)
- SEO metadata: title, description, Open Graph, canonical URLs per page
- JSON-LD structured data (Person on home, BlogPosting on posts)
- Sitemap XML via @astrojs/sitemap (replaces manual sitemap.ts)
- LLMs.txt API route via Astro endpoint

**Should have (differentiators — preserved from current site):**
- Theme-aware syntax highlighting via Shiki CSS variables (dark/light without JS)
- Copy-to-clipboard on code blocks (vanilla `<script>` or minimal SolidJS island)
- Anchor links on headings with clipboard copy (inline script sufficient; no SolidJS needed)
- Open Graph tags with og:image for social preview cards

**Defer (validate before implementing):**
- `/blogs/${slug}.md` raw markdown route — the link exists in UI but the route may not exist in current Next.js build; validate before implementing as Astro endpoint
- RSS feed — not currently present; trivial to add later via @astrojs/rss

**Anti-features (do not build):**
Tag filtering/search, comments, CMS, auth, redesign/new visual identity, View Transitions, SPA client-side routing, React or Radix UI (would defeat the migration purpose)

### Architecture Approach

The target architecture is a strict layered static system: Pages layer (src/pages/*.astro) assembles HTML by pulling from the Content Layer (src/content/blog/*.mdx via getCollection()) and composing Astro components with at most two SolidJS islands as leaves. The Layout layer (BaseLayout.astro, BlogLayout.astro) owns the HTML shell, head management, fonts, theme init script, and slots for page bodies. The Component layer separates static .astro components (BlogCard, BlogGrid, HeroSection, Footer, CodeBlock, HeadingWithAnchor) from SolidJS islands (Header.tsx with mobile menu, ThemeToggle.tsx). SolidJS islands are leaves — they receive JSON-serializable props from Astro but cannot contain Astro component children, and they do not query content collections directly.

**Major components:**
1. **BaseLayout.astro** — HTML shell, inline theme init script, fonts, head, slot for page body
2. **BlogLayout.astro** — extends BaseLayout; blog-specific head meta, JSON-LD BlogPosting
3. **src/content/config.ts** — Zod schema for blog collection; replaces blog-manifest.ts and generate-blog-manifest.mjs
4. **Header.tsx (SolidJS island, client:load)** — mobile menu open/close state; static nav links passed as props
5. **ThemeToggle.tsx (SolidJS island, client:load)** — reads/writes localStorage; toggles dark class on `<html>`
6. **src/pages/blogs/[slug].astro** — calls getStaticPaths() + getEntry() + entry.render(); MDX components passed via `components` prop
7. **src/components/mdx/** — HeadingWithAnchor.astro (inline script for clipboard), CodeBlock.astro (Shiki wrapper + copy button)

**Directory restructuring required:**
- `blogs/*.mdx` → `src/content/blog/*.mdx`
- `src/app/` → `src/pages/` (.tsx → .astro)
- `mdx-components.tsx` (root) → `src/components/mdx/` directory
- New: `src/layouts/` directory
- Deleted: `scripts/`, `src/data/blog-manifest.ts`, `image-loader.ts`, `open-next.config.ts`, `cloudflare-env.d.ts`

### Critical Pitfalls

1. **MDX frontmatter format mismatch (CRITICAL, Phase 0)** — Current posts use `export const meta = {...}` (JS exports). Astro content collections expect YAML `---` frontmatter. This is a hard prerequisite conflict: silently produces empty titles/dates without build failure. Resolution must be decided before any migration code is written. Recommendation: convert all 9 MDX files to YAML frontmatter — dataset is small, conversion is mechanical, result is type-safe collections.

2. **MDX in-file imports of Next.js components (CRITICAL, Phase 1)** — At least one MDX file (`9-*.mdx`) imports `{ Img }` which wraps `next/image`. This causes build failure. Fix: create an Astro-compatible `Img` component using `<Image>` from `astro:assets`, and pass it via the `components` prop in the blog detail page layout rather than via per-file imports. Audit all 9 MDX files for any `import` statements before migration begins.

3. **Theme FOUC without blocking head script (CRITICAL, Phase 2)** — Without replicating `next-themes`' blocking script, dark-mode users see a white flash on every page load. Fix: add `<script is:inline>` in BaseLayout.astro `<head>` that reads localStorage and sets the dark class before paint. The SolidJS ThemeToggle island must initialize its signal from `document.documentElement.classList`, not from localStorage directly, to avoid a double-read race.

4. **Tailwind v4 requires Vite plugin, not @astrojs/tailwind (CRITICAL, Phase 1)** — `@astrojs/tailwind` was written for Tailwind v3 and uses PostCSS. Tailwind v4 requires `@tailwindcss/vite` in the Vite plugins array in astro.config.mjs. Using the wrong integration produces no styles at all.

5. **Cloudflare Workers vs Cloudflare Pages are different products (MODERATE, Phase 4)** — Current deployment uses `@opennextjs/cloudflare` targeting Workers with wrangler deploy. Astro's `@astrojs/cloudflare` adapter targets Cloudflare Pages with `wrangler pages deploy`. Different wrangler.toml structure, different output directory, R2 ISR cache bindings are not needed and must be removed. cloudflare-env.d.ts must be deleted.

6. **Radix UI has no SolidJS port (MODERATE, Phase 2)** — All Radix UI components (Sheet, NavigationMenu, DropdownMenu, Dialog, Separator) are React-only. Do not add @astrojs/react just to reuse Radix — that defeats the migration. Replace NavigationMenu with plain `<nav>` HTML. Replace Sheet (mobile drawer) with a SolidJS island using a native `<dialog>` element or CSS slide-in panel with `createSignal`.

7. **Slug generation from filenames breaks URL parity (MODERATE, Phase 1)** — Files like `1-xp-precompilation.mdx` produce slug `1-xp-precompilation` by default, but the current slug is `xp-precompilation`. Fix: add a `slug` field to YAML frontmatter during the frontmatter conversion (recommended), or strip the numeric prefix in a content collection transform.

8. **`next/link` in MDX component map causes build failure (MODERATE, Phase 3)** — `mdx-components.tsx` uses `next/link` for the `a` component override. Replace with a plain `<a>` tag in the Astro MDX component map.

9. **Geist font loading via `next/font/google` is unavailable in Astro (MINOR, Phase 1)** — Replace with `npm install geist` and import the pre-built CSS, or use a `<link>` to Google Fonts. CSS variables `--font-geist-sans` and `--font-geist-mono` must be defined manually in globals.css.

10. **Heading anchor generation must be preserved exactly (MINOR, Phase 3)** — Do not use rehype-slug. The current custom `anchor()` function (`text.toLowerCase().replace(/\s/g, '-')`) produces the IDs that existing shared links point to. Any difference breaks bookmarked URLs.

## Implications for Roadmap

Based on the combined research, the migration should follow 5 phases with a mandatory Phase 0 pre-work step.

### Phase 0: Pre-Migration Decisions and Cleanup
**Rationale:** Two hard prerequisites must be resolved before any Astro code is written: the frontmatter format decision (which determines the entire content pipeline strategy) and a component audit for motion/next-mdx-remote usage. Starting migration without resolving these creates irreversible architectural debt.
**Delivers:** Decision on YAML vs JS-export frontmatter; converted MDX files (if YAML chosen); audit confirming which components use `motion` and `import` statements in MDX files; dead dependencies removed (next-mdx-remote, motion if unused)
**Addresses:** Pitfall 1 (frontmatter), Pitfall 2 (MDX imports), Pitfall 16 (motion audit)
**Research flag:** None needed — decisions are based on codebase inspection, not external research

### Phase 1: Foundation and Content Pipeline
**Rationale:** Everything else depends on content collections working correctly. The Astro project scaffold, Tailwind v4 Vite plugin config, Zod collection schema, and MDX file migration must all be complete before any page can render. Slug strategy and font loading are also foundational.
**Delivers:** Working Astro project with `npx astro dev` running; Tailwind styles applied; all 9 MDX posts discoverable via `getCollection('blog')` with correct slugs; fonts loading correctly; 404 page in place
**Uses:** Astro 6.1.1, @tailwindcss/vite, @astrojs/mdx, @astrojs/cloudflare (config only), Zod schema
**Avoids:** Pitfall 1 (frontmatter format), Pitfall 4 (Tailwind v4 Vite plugin), Pitfall 6 (slug generation), Pitfall 18 (Geist fonts)
**Research flag:** Verify `@tailwindcss/vite` config in current Astro 6 docs before writing astro.config.mjs

### Phase 2: Static Pages and Layouts
**Rationale:** Once content collections work, the static HTML pages can be built without any SolidJS or interactive components. This validates routing, MDX rendering, SEO metadata, JSON-LD, and image handling before introducing island complexity.
**Delivers:** All 5 pages rendering (home, /blogs, /blogs/[slug], /about, /llms.txt); BaseLayout and BlogLayout with correct head tags; json-ld.ts and site.ts ported; Astro `<Image>` replacing next/image; imgUrl helper updated; sitemap.xml auto-generated
**Uses:** @astrojs/sitemap, astro:assets, schema-dts, src/lib/json-ld.ts (unchanged), @astrojs/cloudflare image service
**Avoids:** Pitfall 5 (imgUrl helper), Pitfall 6 (static paths/404), Pitfall 11 (next/link in MDX)
**Research flag:** Verify @astrojs/cloudflare 13.x image service behavior (was redesigned across adapter versions)

### Phase 3: MDX Components
**Rationale:** MDX component overrides (code blocks, headings, images, links) are isolated from the interactive layer and can be built and tested independently. Shiki configuration is the highest-risk item here — resolving it before adding SolidJS islands avoids compound debugging.
**Delivers:** Custom MDX component map active; Shiki syntax highlighting with CSS-variable dual themes working; HeadingWithAnchor with clipboard copy via inline script; CodeBlock.astro with copy button; `<Img>` component using astro:assets; correct anchor generation preserved
**Uses:** Astro built-in Shiki, vanilla `<script is:inline>`, Clipboard API
**Avoids:** Pitfall 9 (react-syntax-highlighter), Pitfall 11 (next/link), Pitfall 17 (anchor generation), Pitfall 2 (MDX in-file imports)
**Research flag:** Verify Shiki dual-theme / CSS-variables theme config in Astro 6 MDX integration docs

### Phase 4: SolidJS Islands
**Rationale:** Islands are last among the UI components because they introduce a new compilation context (SolidJS JSX inside Astro) and the most complex runtime behavior (FOUC prevention, localStorage sync). Building static pages first means any island failure is isolated and doesn't block content validation.
**Delivers:** ThemeToggle SolidJS island with FOUC-free initialization; Header SolidJS island with mobile drawer; dark mode class toggling all Tailwind `dark:` variants correctly; @kobalte/core integrated or mobile menu hand-rolled with native `<dialog>`
**Uses:** SolidJS 1.9.12, @astrojs/solid-js 6.0.0, @kobalte/core 0.13.11 (or hand-rolled), lucide-solid
**Avoids:** Pitfall 3 (FOUC), Pitfall 4 (Radix UI absence), Pitfall 7 (SolidJS island cannot receive Astro children), Pitfall 8 (useTheme)
**Research flag:** Evaluate @kobalte/core 0.13.11 vs hand-rolling mobile drawer given pre-1.0 status; corvu is an alternative worth checking

### Phase 5: Deployment and Validation
**Rationale:** Final phase validates the full static build against Cloudflare Pages infrastructure. Wrangler config restructuring, R2 binding removal, and environment variable changes are isolated here to avoid interfering with development workflow during earlier phases.
**Delivers:** wrangler.toml restructured for Cloudflare Pages; R2 binding and cloudflare-env.d.ts removed; `wrangler pages dev dist/` preview working; CI deploy command updated; all page URLs validated against current site; LLMs.txt validated; OG image URLs working in production
**Uses:** @astrojs/cloudflare 13.x (output: 'static'), wrangler 4.x
**Avoids:** Pitfall 10 (Workers vs Pages), Pitfall 5 (imgUrl production URLs)
**Research flag:** None — Cloudflare Pages deployment via @astrojs/cloudflare is well-documented

### Phase Ordering Rationale

- Phase 0 before everything: the frontmatter decision determines whether content collections are usable at all
- Phase 1 before pages: no page can render without working content collections and correct Tailwind config
- Phase 2 before islands: validate content and routing in pure static mode first; reduces debugging surface area when islands are added
- Phase 3 (MDX components) before Phase 4 (islands): code block architecture must be decided (Shiki vs runtime) before ThemeToggle is built, because theme-aware highlighting depends on whether Shiki CSS variables or a SolidJS reactive approach is used
- Phase 5 last: deployment config changes in isolation; don't block development workflow during implementation phases

### Research Flags

Phases needing deeper research during planning:
- **Phase 1:** @tailwindcss/vite configuration syntax in Astro 6 — training data may not reflect the exact astro.config.mjs integration pattern for Tailwind v4
- **Phase 2:** @astrojs/cloudflare 13.x image service — the adapter's image service was redesigned in v3-v5 range; behavior at v13 should be verified before relying on automatic Cloudflare Images passthrough
- **Phase 3:** Astro 6 MDX `components` prop API — exact prop name and scope (per-render vs global config) should be verified against current @astrojs/mdx docs
- **Phase 3:** Shiki dual-theme / CSS-variables configuration in Astro 6 — syntax may have changed from Astro 5 training data
- **Phase 4:** @kobalte/core 0.13.11 coverage — evaluate whether the mobile drawer primitive (Sheet/Drawer) exists and is stable, or whether hand-rolling is lower risk given the pre-1.0 version

Phases with well-established patterns (skip deep research):
- **Phase 0:** Pure codebase inspection work — no external research needed
- **Phase 5:** Cloudflare Pages deployment via @astrojs/cloudflare is well-documented and first-class given Astro's Cloudflare partnership

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | MEDIUM | Core choices (Astro, SolidJS, Cloudflare adapter) are HIGH confidence. Version numbers updated to March 2026 actuals. Exact integration config syntax for Tailwind v4 + Astro 6 is MEDIUM — verify against current docs. @kobalte/core is MEDIUM given pre-1.0 status. |
| Features | HIGH | Feature inventory derived from direct codebase analysis — highest-confidence input. Astro equivalents are well-established patterns. One unknown: whether /blogs/[slug].md route is live on current site. |
| Architecture | MEDIUM-HIGH | Core patterns (content collections, islands, static output) are HIGH — fundamental Astro architecture. MDX components API and Cloudflare image service specifics are MEDIUM — verify before implementation. |
| Pitfalls | HIGH | All critical pitfalls verified from reading actual source files (package.json, MDX files, mdx-components.tsx, Header.tsx, code-block.tsx). Not inference — confirmed problems. |

**Overall confidence:** MEDIUM-HIGH

### Gaps to Address

- **MDX frontmatter format decision**: Must be made explicit before Phase 1. Recommendation is YAML conversion for type-safe collections, but the "no content modification" constraint in PROJECT.md needs to be interpreted. If strict no-modification is enforced, a custom `import.meta.glob` loader approach must be architected.
- **`/blogs/[slug].md` route status**: Validate whether this endpoint exists and serves in the current Next.js deployment before deciding to implement in Astro. If the current link is already broken, skip implementation.
- **`motion` library usage**: Audit HeroSection.tsx, BlogCard.tsx, CertificationBadge.tsx for motion imports before Phase 0 can close. If animations exist, they need a SolidJS migration plan.
- **@kobalte/core mobile drawer**: Verify whether Kobalte 0.13.11 has a Sheet/Drawer primitive that matches the current Radix Sheet behavior (focus trap, close-on-escape, close-on-overlay-click). If not, the hand-rolled approach with native `<dialog>` is lower risk.
- **Astro 6 content collections config location**: Training data references `src/content/config.ts`. Astro 5+ may use a different path (e.g., `src/content.config.ts`). Verify before scaffolding.

## Sources

### Primary (HIGH confidence)
- Direct codebase analysis — all 9 MDX files, package.json, mdx-components.tsx, Header.tsx, code-block.tsx, heading-with-anchor.tsx, ThemeToggle.tsx, src/app/ pages, src/lib/, src/config/, wrangler.toml, .planning/codebase/* documents

### Secondary (MEDIUM confidence)
- Training data (knowledge cutoff August 2025): Astro 5.x content collections, islands architecture, MDX integration, @astrojs/cloudflare, @astrojs/sitemap — https://docs.astro.build
- Training data: SolidJS 1.x signals, createSignal, createEffect, Astro island directives — https://www.solidjs.com/docs
- Training data: Tailwind CSS v4 Vite plugin approach — https://tailwindcss.com
- Training data: Kobalte 0.13.x component API — https://kobalte.dev
- Training data: lucide-solid package — https://lucide.dev

### Tertiary (applied from additional context — verify)
- Verified versions (March 2026): Astro 6.1.1, SolidJS 1.9.12, TypeScript 6.0, Tailwind 4.2.2, @astrojs/solid-js 6.0.0, @astrojs/cloudflare 13.x — applied from task additional_context
- Astro joined Cloudflare; first-class Workers support in Astro 6 — applied from task additional_context; verify implications for output mode config

---
*Research completed: 2026-03-27*
*Ready for roadmap: yes*
