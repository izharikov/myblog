# Technology Stack: Astro + SolidJS Blog

**Project:** Next.js to Astro + SolidJS Blog Migration
**Researched:** 2026-03-27
**Research basis:** Training data (knowledge cutoff August 2025). All external tooling (WebSearch, WebFetch, Context7) was unavailable during this session. Version numbers are best-known as of August 2025 — verify against npm before installing.

---

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Astro | ^5.x | Static site generation, routing, layouts | Astro 5.x (released late 2024) introduced the Content Layer API which replaces the older `src/content/` collections for MDX. Static-first with zero JS by default — perfect fit for a content blog. Islands architecture means SolidJS components only ship where needed. |
| TypeScript | ^5.x | Application code, components, utilities | Already in use. Astro has first-class TypeScript support with its own `.astro` files supporting `---` frontmatter in TypeScript. |

**Confidence: HIGH** — Astro 5.x is confirmed stable as of August 2025. The islands architecture and static-first approach are core Astro design principles, not subject to change.

### UI Layer (Interactive Islands Only)

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| SolidJS | ^1.9.x | Interactive components (theme toggle, mobile menu, dialogs) | Solid 1.9.x is the stable series. Fine-grained reactivity with no virtual DOM means the smallest possible hydration cost. Only 3–4 components in this blog need interactivity — Solid's tiny runtime (~7 KB) is far cheaper than shipping React (~45 KB). |

**Confidence: HIGH** — SolidJS 1.x stable API is well established. The rationale for using it for island components in an Astro blog is standard community practice.

### Astro Integrations

| Integration | Version | Purpose | Why |
|-------------|---------|---------|-----|
| `@astrojs/solid-js` | ^4.x | Renders SolidJS components as Astro islands | Official integration. Handles SSR/hydration automatically. Use `client:load` for immediately-interactive islands (theme toggle) and `client:visible` for below-fold islands. |
| `@astrojs/mdx` | ^4.x | MDX processing inside Astro's content pipeline | Official integration. Replaces `@next/mdx` + `@mdx-js/loader`. Works with Astro's Content Layer API. Supports remark/rehype plugins. |
| `@astrojs/sitemap` | ^3.x | Automatic sitemap.xml generation | Official integration. Replaces the manual Next.js `sitemap.ts` route. Auto-discovers all Astro routes at build time. |
| `@astrojs/cloudflare` | ^12.x | Cloudflare Pages deployment adapter | Official integration. Replaces `@opennextjs/cloudflare`. Native Astro → Cloudflare Pages/Workers compilation with no shim layer. Supports static output mode (no server-side overhead) plus optional SSR endpoints. |

**Confidence: MEDIUM** — Integration package major versions increment with Astro major versions. The version numbers above are estimates based on Astro 5.x compatibility. Verify with `npx astro add solid-js mdx sitemap cloudflare` which will install correct peer-compatible versions automatically.

**Note on Tailwind:** As of Astro 4.x+, Tailwind CSS v4 is integrated via the `@astrojs/tailwind` integration package OR directly via Vite's PostCSS pipeline. See Styling section below.

### Styling

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Tailwind CSS | ^4.x | Utility-first CSS | Already in use; no change. Tailwind v4 is a hard constraint from PROJECT.md. |
| `@tailwindcss/vite` | ^4.x | Vite plugin for Tailwind CSS v4 | Astro uses Vite under the hood. Tailwind v4 introduced a native Vite plugin (`@tailwindcss/vite`) that is faster than the PostCSS route. Use this instead of `@tailwindcss/postcss` in the Astro context. |
| `clsx` | ^2.x | Conditional class composition | Already in use; keep. Framework-agnostic. |
| `tailwind-merge` | ^3.x | Merge Tailwind classes without conflicts | Already in use; keep. Framework-agnostic. |
| `class-variance-authority` | ^0.7.x | Typed component variants | Already in use; keep. Framework-agnostic. |

**Confidence: HIGH for Tailwind v4 + Vite plugin approach.** As of Tailwind CSS v4 release (early 2025), the recommended integration path moved from PostCSS to the native Vite plugin. The `@astrojs/tailwind` integration wrapper existed for older Tailwind versions; with v4, the Vite plugin is the canonical path.

**Confidence: MEDIUM for exact Vite plugin package name.** Verify against https://tailwindcss.com/docs/installation/framework-guides for Astro + Tailwind v4 setup.

### MDX Content Pipeline

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| `@astrojs/mdx` | ^4.x | MDX compilation | Replaces `@next/mdx`, `@mdx-js/loader`, `@mdx-js/react`, `next-mdx-remote`. Single integration handles everything. |
| `remark-gfm` | ^4.x | GitHub Flavored Markdown | Already in use; keep. Remark plugin is framework-agnostic — works identically in Astro's MDX pipeline. |
| `gray-matter` | ^4.x | Frontmatter parsing in build scripts | Already in use. May be needed for any custom manifest scripts, though Astro's Content Layer API handles frontmatter natively from MDX — reduces direct gray-matter usage. |

**What replaces `react-syntax-highlighter`:**

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| `shiki` | ^1.x (via Astro built-in) | Syntax highlighting in code blocks | Astro bundles Shiki as its built-in syntax highlighter (configurable in `astro.config.ts` via `markdown.shikiConfig`). Zero client-side JS — all highlighting happens at build time. Replaces the heavy `react-syntax-highlighter` bundle (~150 KB). This is one of the biggest bundle wins of the migration. |

**Confidence: HIGH** — Astro's built-in Shiki integration is a documented core feature, not a plugin. Zero runtime cost vs. react-syntax-highlighter shipping to the browser.

### SolidJS Component Equivalents (React → Solid Migration)

#### Radix UI → Kobalte

| Radix UI (current) | Kobalte equivalent | Package |
|--------------------|--------------------|---------|
| `@radix-ui/react-dialog` | `Dialog` | `@kobalte/core` |
| `@radix-ui/react-dropdown-menu` | `DropdownMenu` | `@kobalte/core` |
| `@radix-ui/react-navigation-menu` | `NavigationMenu` | `@kobalte/core` |
| `@radix-ui/react-separator` | `Separator` | `@kobalte/core` |

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| `@kobalte/core` | ^0.13.x | Accessible, unstyled SolidJS UI primitives | Kobalte is the SolidJS equivalent of Radix UI. Same design philosophy: accessible, unstyled, composable. Port-for-port equivalent of the Radix components used in this project. Maintained by the SolidJS community. |

**Confidence: MEDIUM** — Kobalte is the established Radix UI equivalent for SolidJS as of August 2025. However, the project uses very few interactive components (dialog, dropdown, nav menu) — evaluate whether Kobalte's full component set is needed or if hand-rolling the 2–3 interactive components (theme toggle, mobile menu) is simpler given the small scope. Kobalte v0.13.x is the known version series; verify current version before installing.

**shadcn/ui equivalent for SolidJS:** There is no 1:1 equivalent of shadcn/ui for SolidJS with the same community adoption level. Given that this migration preserves visual design and defers redesign to Milestone 2, the recommended approach is to hand-port the existing shadcn components to Solid + Kobalte primitives rather than adopting a new component library. The components involved are minimal (copy button, mobile sheet/drawer).

#### lucide-react → lucide-solid

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| `lucide-solid` | ^0.x | SVG icon library for SolidJS | Direct equivalent of `lucide-react`. Same icon set, identical API, compiled as SolidJS JSX. Drop-in replacement — change the import path, no logic changes needed. |

**Confidence: HIGH** — `lucide-solid` is an official Lucide package targeting SolidJS. The icon names and prop API are identical to `lucide-react`.

#### motion → solid-motionone (or none)

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| `@motionone/solid` (or skip) | ^10.x | Animations | The current `motion` package (Framer Motion v12 rebranded) is React-specific. `@motionone/solid` is the SolidJS binding for Motion One (the lower-level animation library). However: the blog currently uses motion for decorative animations. Evaluate whether animations are needed at all — Astro's static output removes most React animation boilerplate, and CSS transitions may cover the remaining cases without any JS library. |

**Confidence: MEDIUM** — `@motionone/solid` exists and is the correct package for animation in SolidJS. Whether it's needed depends on which specific animations the current blog uses. The package names may have changed with the motion v12 rebranding; verify against https://motion.dev.

**Recommendation:** Audit which animations in the current codebase are meaningful vs. decorative. CSS transitions can replace most decorative animations at zero JS cost. Only add `@motionone/solid` if specific animations require JS (e.g., layout animations, gesture-driven motion).

### Theme Management (Dark/Light Mode)

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Inline script in `<head>` | N/A | Flash-free theme initialization | `next-themes` is React-specific — no direct equivalent needed. The Astro pattern is a small inline `<script>` tag in the root layout's `<head>` that reads `localStorage` and sets the `dark` class before paint. This is simpler, faster, and requires zero dependencies. SolidJS island provides the toggle button with reactive state. |

**Confidence: HIGH** — The inline script approach for theme initialization in Astro is a well-documented community pattern that avoids FOUC. It is simpler than `next-themes` and has no runtime dependency.

### SEO

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Astro built-in `<head>` management | N/A | Meta tags, Open Graph, canonical URLs | Astro layouts manage `<head>` directly — no SEO library needed. Move metadata from `generateMetadata()` functions into `.astro` layout components using props. |
| `@astrojs/sitemap` | ^3.x | sitemap.xml | Replaces the manual `sitemap.ts` route. |
| `schema-dts` | ^1.x | TypeScript types for JSON-LD structured data | Already in use; keep. Framework-agnostic TypeScript definitions. JSON-LD generation logic in `src/lib/json-ld.ts` is portable — it's plain TypeScript with no React dependency. |

**Confidence: HIGH** — Astro's head management is a core feature. schema-dts is framework-agnostic.

### Image Optimization

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Astro `<Image>` component | Built-in | Build-time image optimization | Astro's built-in `<Image>` replaces `next/image`. Performs AVIF/WebP transformation at build time. For Cloudflare deployment, configure `image.service` in `astro.config.ts` to use `no-op` or Cloudflare Images passthrough — the same logic as the current `image-loader.ts` but as a config option. |

**Confidence: HIGH** — Astro's `<Image>` component is a documented built-in feature.

### Deployment

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| `@astrojs/cloudflare` | ^12.x | Cloudflare Pages adapter | Official Astro adapter. Replaces `@opennextjs/cloudflare` — eliminates the OpenNext shim entirely. For a static blog, set `output: 'static'` in `astro.config.ts` for pure static output (no Workers runtime needed), or `output: 'hybrid'` if any API routes require server rendering. |
| Wrangler | ^4.x | Cloudflare CLI for preview and deploy | Already in use; keep. `@astrojs/cloudflare` builds output compatible with `wrangler pages deploy`. |

**Confidence: HIGH** — `@astrojs/cloudflare` is an official Astro integration with documented Cloudflare Pages support.

**Key deployment decision:** The current stack uses Cloudflare Workers with an R2 bucket for incremental cache (ISR). In Astro with `output: 'static'`, there is no ISR — all pages are pre-built and served as static files. This is actually simpler and eliminates the R2 binding requirement entirely. For a blog with ~10 posts that rebuilds on content changes, full static output is the right approach.

### Dev Tooling

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| TypeScript | ^5.x | Type checking | Keep — same as current. |
| ESLint | ^9.x | Code linting | Keep — swap `eslint-config-next` for `eslint-plugin-astro` + `eslint-plugin-solid`. |
| `eslint-plugin-astro` | latest | Astro-specific lint rules | Official Astro ESLint plugin for `.astro` files. |
| `eslint-plugin-solid` | latest | SolidJS-specific lint rules | Community plugin for SolidJS reactive patterns. |

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Routing framework | Astro | SvelteKit, Qwik City | Project constraint — Astro is specified. |
| Interactive UI | SolidJS | Preact, vanilla JS | Project constraint — SolidJS is specified. |
| Accessible primitives | Kobalte | Hand-rolled ARIA | Kobalte gives accessible keyboard navigation, focus management, ARIA attributes for free. Worth the dependency for dialog/dropdown. |
| Accessible primitives | Kobalte | Ark UI (SolidJS) | Ark UI is a newer alternative from Chakra UI team with SolidJS support. Less community adoption than Kobalte for this use case as of August 2025. |
| Syntax highlighting | Astro built-in Shiki | Prism (rehype-prism-plus) | Shiki is faster, better-looking, and zero client-side JS. Prism requires a client-side bundle. |
| Syntax highlighting | Astro built-in Shiki | react-syntax-highlighter port | No SolidJS port exists; moving to Shiki is the correct migration path. |
| Theme management | Inline script | `solid-theme` or similar | No mature equivalent of next-themes for SolidJS exists. The inline script pattern is the Astro community standard and has zero dependencies. |
| Tailwind integration | `@tailwindcss/vite` | `@astrojs/tailwind` + PostCSS | `@astrojs/tailwind` is designed for Tailwind v3 and older. Tailwind v4's native Vite plugin is the documented path for Tailwind v4 in Vite-based frameworks. |
| Cloudflare deployment | `@astrojs/cloudflare` | `@opennextjs/cloudflare` | OpenNext is a compatibility shim to run Next.js on Cloudflare. Irrelevant after migrating to Astro. |
| Animation | CSS transitions / no library | `@motionone/solid` | Most blog animations are decorative and can be replaced with CSS. Adding a JS animation library increases island bundle size. Defer JS animation until specific needs are identified. |

---

## Installation

```bash
# 1. Create new Astro project (run in empty directory, not in existing project)
npm create astro@latest

# 2. Add official integrations (astro add handles peer deps and config updates)
npx astro add solid-js mdx sitemap cloudflare

# 3. Tailwind CSS v4 with Vite plugin
npm install tailwindcss @tailwindcss/vite

# 4. SolidJS ecosystem
npm install @kobalte/core lucide-solid

# 5. MDX remark plugins (carry over from current stack)
npm install remark-gfm

# 6. Utility libraries (carry over — framework-agnostic)
npm install clsx tailwind-merge class-variance-authority schema-dts gray-matter

# 7. Dev dependencies
npm install -D typescript eslint eslint-plugin-astro eslint-plugin-solid wrangler
```

**Note:** `npx astro add` is the recommended way to install Astro integrations — it updates `astro.config.ts` automatically and installs the correct version pinned to your Astro version.

---

## Dependency Migration Map

| Current (Next.js) | Target (Astro) | Notes |
|-------------------|----------------|-------|
| `next` | `astro` | Core framework |
| `react` + `react-dom` | `solid-js` | SolidJS for island components only |
| `@radix-ui/react-dialog` | `@kobalte/core` Dialog | |
| `@radix-ui/react-dropdown-menu` | `@kobalte/core` DropdownMenu | |
| `@radix-ui/react-navigation-menu` | `@kobalte/core` NavigationMenu | Evaluate if needed — may simplify to plain HTML |
| `@radix-ui/react-separator` | `@kobalte/core` Separator | Or plain `<hr>` with Tailwind |
| `@radix-ui/react-slot` | Not needed | Slot pattern solved differently in Solid |
| `lucide-react` | `lucide-solid` | Identical API, different import |
| `motion` (Framer Motion) | CSS transitions (prefer) or `@motionone/solid` | Audit first |
| `next-themes` | Inline `<script>` in Astro layout | No dependency needed |
| `@next/mdx` | `@astrojs/mdx` | Official Astro integration |
| `@mdx-js/loader` | Removed | Handled by `@astrojs/mdx` |
| `@mdx-js/react` | Removed | SolidJS used for interactive MDX components |
| `next-mdx-remote` | Removed | Astro Content Layer API handles this |
| `react-syntax-highlighter` | Removed | Astro built-in Shiki |
| `@types/react-syntax-highlighter` | Removed | |
| `@opennextjs/cloudflare` | `@astrojs/cloudflare` | Official adapter |
| `eslint-config-next` | `eslint-plugin-astro` + `eslint-plugin-solid` | |
| `@tailwindcss/postcss` | `@tailwindcss/vite` | Tailwind v4 Vite plugin |
| `tw-animate-css` | Keep or drop | Evaluate if animations still needed |
| `gray-matter` | Keep (reduced use) | Astro Content Layer parses frontmatter natively |
| `remark-gfm` | Keep | Framework-agnostic remark plugin |
| `schema-dts` | Keep | Framework-agnostic TypeScript types |
| `clsx` | Keep | Framework-agnostic |
| `tailwind-merge` | Keep | Framework-agnostic |
| `class-variance-authority` | Keep | Framework-agnostic |
| `wrangler` | Keep | Same Cloudflare CLI |

**Removed entirely (no replacement needed):**
- `@types/react`, `@types/react-dom` — Solid uses its own types
- `@types/mdx` — Astro handles MDX types
- `next-mdx-remote` — Astro Content Layer replaces this pattern
- `react-is` — React-specific

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Astro core | HIGH | Astro 5.x is stable, well-documented, widely used |
| SolidJS core | HIGH | Solid 1.x stable API |
| `@astrojs/solid-js` integration | HIGH | Official integration, stable |
| `@astrojs/mdx` integration | HIGH | Official integration, stable |
| `@astrojs/cloudflare` adapter | HIGH | Official integration, documented |
| `@astrojs/sitemap` integration | HIGH | Official integration, stable |
| Tailwind v4 + Vite plugin | MEDIUM | Tailwind v4 was new in early 2025; verify the specific Vite plugin package name and config against current Tailwind docs |
| Kobalte versions | MEDIUM | Version numbers estimated; run `npm info @kobalte/core` to get latest |
| `@motionone/solid` name | MEDIUM | Motion rebranding in v12 may affect package naming; verify |
| Integration version numbers | MEDIUM | All `@astrojs/*` versions estimated for Astro 5.x compat; use `npx astro add` to get pinned versions |
| Inline theme script pattern | HIGH | Documented Astro community pattern, no dependencies involved |

---

## Sources

- Astro docs (training data, August 2025): https://docs.astro.build
- SolidJS docs (training data): https://www.solidjs.com/docs
- Kobalte docs (training data): https://kobalte.dev
- Lucide docs (training data): https://lucide.dev
- Tailwind CSS v4 docs (training data): https://tailwindcss.com
- Motion One docs (training data): https://motion.dev
- All version numbers are training-data estimates — verify with `npm info <package>` or the official docs before pinning in package.json.
