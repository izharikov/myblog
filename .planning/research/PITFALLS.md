# Domain Pitfalls: Next.js to Astro + SolidJS Migration

**Domain:** Next.js → Astro + SolidJS blog migration (brownfield rewrite)
**Researched:** 2026-03-27
**Confidence:** HIGH — based on direct codebase analysis + ecosystem knowledge of specific technologies involved

---

## Critical Pitfalls

Mistakes that require significant rework or cause silent data loss.

---

### Pitfall 1: MDX Frontmatter Format Is Incompatible Between Stacks

**What goes wrong:** The current MDX files use a JavaScript export object for metadata rather than YAML frontmatter:

```mdx
export const meta = {
  title: `Sitecore Marketplace Apps: Custom Authorization Setup`,
  slug: "...",
  logo: "/images/...",
  date: "27.03.2026",
};
```

Astro's MDX integration (and `@astro/content-collections`) expects YAML frontmatter at the top of the file using `---` delimiters. The JS export pattern from Next.js works because `@next/mdx` treats MDX files as React components and the export is a named export from a module. Astro's content layer uses `gray-matter` to parse YAML frontmatter and will not read the `export const meta` object as content metadata.

**Why it happens:** Two entirely different MDX consumption models: Next.js imports MDX as JS modules (named exports survive), Astro's content collections parse frontmatter as data before compilation.

**Consequences:**
- Astro content collection queries return empty/undefined frontmatter for every post
- Build does not fail — posts just show blank titles, no date, no tags
- Manifest-based approach currently used could mask this until runtime
- The constraint "preserve all existing MDX files without modification" conflicts with Astro's content collection model

**Prevention:**
- Define whether to keep the JS-export metadata pattern (requires bypassing content collections and using a custom manifest, as currently done) OR migrate to YAML frontmatter
- If keeping JS exports: use `import.meta.glob` in Astro to import MDX files as modules and extract the `meta` export manually, preserving the existing manifest pattern
- If converting to YAML frontmatter: convert all 9 MDX files before migration starts (small dataset, do it once cleanly)
- Do NOT mix the two approaches across different blog posts

**Detection warning signs:**
- Blog post titles appear as undefined or empty in listings
- `Astro.props.frontmatter` is undefined in blog page templates
- Content collection `getCollection('blog')` returns entries with no data fields

**Phase to address:** Phase 1 (foundation/content pipeline setup). This is a prerequisite for everything else.

---

### Pitfall 2: MDX Component Imports Inside Files Break in Astro

**What goes wrong:** The current MDX posts import React components directly inside the file:

```mdx
import { Img } from '@/components/ui/img';
```

In Astro's MDX integration, components imported inside MDX files must be Astro components or framework components registered with the correct integration. Currently `Img` wraps `next/image`, which does not exist in Astro. The import will fail at build time or produce a broken component.

**Why it happens:** In Next.js, MDX files are just React component modules — any React import works naturally. In Astro, MDX files run in a different compilation context where framework component imports need the relevant integration loaded, and Next.js-specific components (using `next/image`, `next/link`) are simply unavailable.

**Consequences:**
- Build failure if `next/image` or `next/link` is imported anywhere in MDX files
- If import is silently removed, images inside blog posts disappear
- Every MDX file that imports `{ Img }` must be updated OR the `Img` component must be replaced with an Astro-compatible equivalent

**Prevention:**
- Create a new `Img` component for Astro using `<Image>` from `astro:assets` with the same props interface
- Make the new `Img` a SolidJS component only if it needs interactivity (it does not — render it as a plain Astro component)
- Pass components via `mdxComponents` prop in the Astro layout, not by importing inside each MDX file
- Audit all 9 MDX files for any `import` statements: `blogs/9-*.mdx` already confirmed to use `import { Img }` — others need checking

**Detection warning signs:**
- Build error: `Cannot find module 'next/image'` during MDX compilation
- Images from `<Img>` component missing from rendered posts

**Phase to address:** Phase 1 (content pipeline). Must resolve before any post renders correctly.

---

### Pitfall 3: Theme Toggle Causes Flash of Wrong Theme (FOUC) Without Careful Setup

**What goes wrong:** The current implementation uses `next-themes` which handles SSR suppression via `suppressHydrationWarning` on `<html>`. In Astro, the equivalent — using a SolidJS island for the theme toggle — will produce a flash of the wrong theme (FOUC) unless a theme-initialization script is injected into `<head>` before page render.

The current `layout.tsx` sets `<html lang="en" suppressHydrationWarning>` and wraps content in `<ThemeProvider>`. Astro has no equivalent provider mechanism. The SolidJS island hydrates after the page renders, meaning there is a visible flash on first load for users with non-default theme preferences.

**Why it happens:** Astro renders HTML at the edge with no client JS during initial paint. The theme class (e.g., `class="dark"`) on `<html>` must be set synchronously in `<head>` via an inline `<script>` tag before body renders. SolidJS `createSignal` for theme state initializes only when the island hydrates, which is after paint.

**Consequences:**
- Users see a bright flash before dark mode activates
- Worse than current Next.js behavior where `suppressHydrationWarning` prevents this
- Fails the "maintain or improve" experience goal

**Prevention:**
- Inject a blocking inline `<script>` in the Astro layout's `<head>` that reads `localStorage` and sets `document.documentElement.className` before body renders
- Initialize the SolidJS ThemeToggle island's state from `document.documentElement.className` rather than from `localStorage` directly (read the DOM, not storage, to avoid double-read race)
- Use `client:load` or `client:idle` for the ThemeToggle island — NOT `client:visible` (would delay toggle appearing at all)
- The inline script should be ~5 lines maximum; no library needed

**Detection warning signs:**
- Brief white flash before dark theme applies on page load
- Theme toggle appears in wrong state on first render (sun shown when dark is active)
- `localStorage` theme value does not match the rendered page state

**Phase to address:** Phase 2 (interactive components migration).

---

### Pitfall 4: Radix UI Components Have No SolidJS Port — Replacement Strategy Matters

**What goes wrong:** The current stack uses three Radix UI primitives: `@radix-ui/react-dialog` (Sheet/mobile drawer), `@radix-ui/react-dropdown-menu`, and `@radix-ui/react-navigation-menu`. All are React-only. There is no official Radix UI for SolidJS.

The naive approach — installing Radix UI and trying to use it with `@astrojs/react` or inside SolidJS islands — will either fail (React component in SolidJS island context) or add React to the bundle (defeating the migration purpose).

**Why it happens:** shadcn/ui components are built on Radix primitives. The project uses shadcn-style components (`Sheet`, `NavigationMenu`, `Button`). There is no drop-in SolidJS equivalent of shadcn/ui with Radix primitives.

**Consequences:**
- Sheet (mobile drawer): needs a SolidJS replacement or a plain-HTML/CSS implementation
- NavigationMenu: used only for desktop nav — can be replaced with semantic HTML `<nav>` without any library
- Dropdown: not visible in current nav code — may not be actively used
- If React integration is added to avoid rewriting, the bundle size benefit is eliminated

**Prevention:**
- Desktop navigation: replace `NavigationMenu` + `NavigationMenuLink` with plain `<nav>` and anchor elements — no library needed, current usage is simple link list
- Mobile drawer (Sheet): implement as a SolidJS island using a native `<dialog>` element or CSS slide-in panel — no library needed for this use case
- Do NOT add `@astrojs/react` just to reuse Radix UI — this defeats the migration
- `class-variance-authority` (CVA) and `clsx` can be kept as-is in Astro/SolidJS — they are framework-agnostic
- `lucide-react` icons must be replaced with `lucide-solid` in SolidJS islands (not lucide-react)

**Detection warning signs:**
- Import errors: `Cannot find module '@radix-ui/react-dialog'` in SolidJS island files
- React appearing in bundle analysis despite no React integration configured
- Mobile menu failing to open (missing Portal rendering for Sheet)

**Phase to address:** Phase 2 (interactive components migration).

---

### Pitfall 5: The `imgUrl` Helper and Custom Image Loader Cannot Be Ported Directly

**What goes wrong:** The current image system has two layers of complexity:
1. `next/image` component with a custom Cloudflare loader (`image-loader.ts`) in production
2. A `imgUrl()` helper function that generates `/_next/image?...` URLs in development and `/cdn-cgi/image/...` URLs in production

Both are tightly coupled to Next.js infrastructure. In Astro:
- `next/image` does not exist
- `/_next/image` URLs will 404 — Astro has no built-in image resize server in the same place
- The `imgUrl()` helper hard-codes Next.js's dev image endpoint

**Why it happens:** Astro uses `astro:assets` for image optimization, which generates different URL patterns and uses Vite's asset pipeline at build time. For Cloudflare Pages specifically, Astro's `@astrojs/cloudflare` adapter handles image optimization differently from Next.js + OpenNext.

**Consequences:**
- All 9 blog post logos (used in hero images) will break if not migrated
- The `<Img>` component used inside MDX files will 404 in dev if it retains the `/_next/image` path logic
- OG image URLs in metadata are built using `imgUrl()` — these will produce broken social preview cards if not updated

**Prevention:**
- Replace `next/image` with Astro's `<Image>` component from `astro:assets` in static Astro templates
- For the `/cdn-cgi/image/` production transform: this actually works independently of Next.js — the Cloudflare Image Resizing URL format is a Cloudflare feature, not a Next.js feature. The `cloudflareUrl()` logic in `img.ts` can be kept as a utility; only the dev path (`/_next/image`) needs updating
- Astro dev server does not provide image resizing — use direct image paths in dev (no transform) or use Astro's built-in `<Image>` which handles this automatically
- The `imgUrl()` function used in OG meta: rewrite to use the Cloudflare URL directly in all environments (not just production) since Astro dev does not need Next.js image transformation

**Detection warning signs:**
- Blog post hero images returning 404 in development
- OG image preview URLs returning 404 in production
- Console errors: `net::ERR_ABORTED 404 /_next/image`

**Phase to address:** Phase 3 (image/media migration). Must be done alongside MDX content pipeline.

---

### Pitfall 6: `generateStaticParams` + `dynamicParams = false` Pattern Has No Direct Equivalent

**What goes wrong:** The current blog slug routing uses:
```typescript
export function generateStaticParams() {
  return Object.keys(blogSlugToPath).map((slug) => ({ slug }));
}
export const dynamicParams = false;
```

This tells Next.js to pre-render only known slugs and return 404 for unknown ones. Astro does this differently via `getStaticPaths()` returning a `paginate`-style array. The 404 behavior on unknown slugs requires `output: 'static'` mode in Astro config AND Cloudflare Pages must be configured to serve 404.html for unknown routes.

**Why it happens:** Next.js and Astro have different SSG conventions. In Astro, `getStaticPaths()` is the equivalent but the 404 page is a special file (`src/pages/404.astro`). Cloudflare Pages automatically uses `404.html` if present.

**Consequences:**
- If 404 behavior is not replicated, unknown blog slugs serve a blank page rather than a 404
- The `dynamicParams = false` behavior (hard 404) is a security/UX requirement for this project
- If `output` is set incorrectly (e.g., `server` instead of `static`), Cloudflare Pages adapter may behave differently

**Prevention:**
- Use `output: 'static'` in Astro config — this is the correct mode for a static blog on Cloudflare Pages
- Create `src/pages/404.astro` for the custom 404 page
- Use `getStaticPaths()` in `src/pages/blogs/[slug].astro` returning slugs from the manifest
- Verify Cloudflare Pages serves `404.html` for unmatched routes (it does by default)

**Detection warning signs:**
- `/blogs/nonexistent-slug` returns a blank white page instead of 404
- Build produces a `[slug].html` file in output (should be pre-rendered per-slug files instead)

**Phase to address:** Phase 1 (routing setup).

---

## Moderate Pitfalls

### Pitfall 7: SolidJS Islands Cannot Receive Astro Component Children as Props

**What goes wrong:** In the current React implementation, the `Header` component is a single unit — it contains `ThemeToggle` and `Sheet` as child components and they share state directly. In Astro + SolidJS, an island component is a boundary: you cannot pass Astro component subtrees as children into a SolidJS island and have them render inside the island's DOM.

Attempting to nest Astro content inside a SolidJS `<Header>` island will either silently fail (children ignored) or produce hydration errors.

**Prevention:**
- Keep the Astro layout template responsible for the static header shell (logo, nav links as `<a>` tags)
- Make `ThemeToggle` and `MobileMenu` separate, small SolidJS islands placed inline in the Astro header template
- Islands communicate via `localStorage` or `document` events if they need to coordinate — for this project they do not need to
- The mobile menu island renders its own drawer including the nav links list (static strings, not Astro component children)

**Phase to address:** Phase 2 (interactive components migration).

---

### Pitfall 8: `useTheme` from `next-themes` Does Not Exist in SolidJS

**What goes wrong:** `ThemeToggle.tsx` and `CodeBlock.tsx` both call `useTheme()` from `next-themes`. This hook is React-only. In SolidJS islands, there is no React hook system at all — `use*` hooks from React libraries cannot be called.

`CodeBlock` specifically uses `useTheme` + `useEffect` + `useState` to:
1. Detect current theme (including system preference)
2. Select a syntax highlighter style based on theme
3. Handle SSR hydration (the `mounted` check pattern)

All of this needs to be reimplemented in SolidJS signals + effects.

**Prevention:**
- Replace `useTheme()` with a SolidJS signal initialized from `document.documentElement.classList.contains('dark')`
- Listen to DOM mutations (or a custom event dispatched by the theme toggle) to update the signal when theme changes
- Replace `useEffect` with `createEffect`, `useState` with `createSignal`
- The `mounted` check pattern (preventing SSR mismatch) is not needed in SolidJS islands because they hydrate from scratch — but the signal must initialize correctly on the client

**Phase to address:** Phase 2 (interactive components migration).

---

### Pitfall 9: `react-syntax-highlighter` Cannot Be Used in SolidJS Islands

**What goes wrong:** `CodeBlock.tsx` uses `react-syntax-highlighter`. This is a React component that renders using React's virtual DOM. It cannot be imported or rendered inside a SolidJS island because SolidJS does not use React's rendering system.

**Prevention:**
- Replace `react-syntax-highlighter` with `shiki` — a framework-agnostic syntax highlighter that returns HTML strings, which can be set via SolidJS's `innerHTML` prop
- Alternatively, use Astro's built-in `shiki` integration via `@astrojs/mdx` — code blocks can be highlighted at build time without any client-side JS at all
- Preferred approach: use Astro's built-in Shiki (via `remarkSyntaxHighlight` or `@astrojs/prism`) to highlight code at build time, eliminating the need for client-side syntax highlighting entirely. This removes `react-syntax-highlighter` from the bundle entirely.
- The `CopyButton` (copy-to-clipboard) should remain a small SolidJS island placed adjacent to the pre-rendered code block

**Phase to address:** Phase 3 (MDX components migration).

---

### Pitfall 10: Cloudflare Workers vs Cloudflare Pages — Different Build Commands and Output

**What goes wrong:** The current deployment uses `@opennextjs/cloudflare` which targets Cloudflare Workers (not Pages). The package.json deploy scripts use `opennextjs-cloudflare build && opennextjs-cloudflare deploy`. Astro's Cloudflare adapter targets Cloudflare Pages. These are different products with different deployment commands, different `wrangler.toml` structures, and different environment variable handling.

Key differences that cause problems:
- Workers use `wrangler deploy` with a Worker script entry point; Pages uses `wrangler pages deploy` with a static output directory
- The R2 bucket currently used for Next.js ISR cache is not needed for a static Astro site
- `cloudflare-env.d.ts` contains Cloudflare bindings types for Workers (`Env`, `KVNamespace`) that don't apply to static Pages
- The `openNextCloudflareForDev` init pattern is obsolete in Astro

**Prevention:**
- Configure Astro with `@astrojs/cloudflare` adapter and `output: 'static'` — this produces a `dist/` directory deployable to Cloudflare Pages
- The `wrangler.toml` needs to be restructured for Pages (or removed and replaced with a `_headers` / `_redirects` file)
- Delete `cloudflare-env.d.ts` — no Worker bindings needed for a static site
- R2 bucket for ISR cache is no longer needed; remove it
- Dev workflow changes from `opennextjs-cloudflare preview` to `astro dev` (standard Vite server) or `wrangler pages dev dist/`

**Detection warning signs:**
- `wrangler deploy` fails because there is no Worker script
- Static assets 404 in deployed Pages because output directory is wrong
- Environment variables not resolving because Workers vs Pages env var injection differs

**Phase to address:** Phase 4 (deployment migration).

---

### Pitfall 11: `next/link` in MDX Custom Components Must Be Replaced

**What goes wrong:** `mdx-components.tsx` defines a custom `a` component that uses `next/link`:
```tsx
import Link from 'next/link'
// ...
a: ({ href, children }) => (
  <Link href={href as string} ...>
```

In Astro's MDX component map, `next/link` does not exist. Any MDX component override using `next/link` will cause a build failure. Astro's equivalent is a plain `<a>` tag — client-side navigation is handled automatically by Astro's View Transitions (if enabled) or is not needed at all for external links.

**Prevention:**
- Replace `next/link` with a plain `<a>` tag in the Astro MDX component map
- For internal links that benefit from client-side navigation, Astro's `<ViewTransitions>` or native `<a>` are sufficient; no special `Link` component is needed
- Similarly, the `heading-with-anchor.tsx` component uses both `next/link` (for the anchor `#` link) and `@radix-ui/react-slot` — both must be replaced in the Astro version. The anchor link becomes a plain `<a href={#anchor}>`.

**Phase to address:** Phase 3 (MDX components migration).

---

### Pitfall 12: Tailwind CSS v4 Requires Different Astro Configuration

**What goes wrong:** Tailwind CSS v4 changed from PostCSS plugin configuration to a Vite plugin. The current setup uses `@tailwindcss/postcss` in `postcss.config.mjs`. In Astro, the `@astrojs/tailwind` integration is for Tailwind v3. Tailwind v4 with Astro requires `@tailwindcss/vite` added directly to the Vite config in `astro.config.mjs`, not the Astro integration.

The `tw-animate-css` dev dependency (used for Radix UI animation utilities) may also need revisiting since the Radix UI components are being replaced.

**Why it happens:** Astro's official Tailwind integration (`@astrojs/tailwind`) was written for v3 and adds `tailwindcss` as a PostCSS plugin. Tailwind v4 dropped the PostCSS approach in favor of Vite-first processing.

**Prevention:**
- Add `@tailwindcss/vite` to `astro.config.mjs` in the `vite.plugins` array — NOT using `@astrojs/tailwind`
- Keep existing CSS variables (for CSS custom properties like `--font-geist-mono`) — they work in Astro the same way
- CSS `@import` of Tailwind in a global stylesheet: use `@import 'tailwindcss'` (v4 syntax), same as current globals.css
- Verify `globals.css` imports and any `@apply` directives still work under Vite processing

**Detection warning signs:**
- Styles not applied at all (Tailwind classes have no effect)
- Build warning: `tailwindcss` not found as PostCSS plugin
- CSS variables from Tailwind theme not available in components

**Phase to address:** Phase 1 (Astro project setup / foundation).

---

### Pitfall 13: `export const meta` Pattern Breaks the "No Modification" Content Constraint

**What goes wrong:** The requirement says "Preserve all existing blog content without modification." However, if the migration moves to Astro content collections with YAML frontmatter, every MDX file must have its `export const meta = {...}` block converted to YAML `---` frontmatter. This is a direct conflict.

Conversely, if the no-modification constraint is honored literally, the blog manifest approach (already in use) must be preserved: frontmatter is read during the pre-build `generate-manifest.mjs` script and stored in `blog-manifest.ts`, and MDX files are imported as modules to extract the `meta` export.

**Consequences of not resolving this contradiction early:**
- If Astro content collections are set up assuming YAML frontmatter, all 9 posts render with missing metadata
- If the manifest approach is kept but Astro content collections are also set up, there are two sources of truth — confusion and bugs

**Prevention:**
- Explicitly decide before any code is written: use Astro content collections (requires modifying MDX files) OR keep the manifest-based import approach (no content file changes)
- Recommendation: convert the 9 MDX files to YAML frontmatter. The dataset is small (9 files), the conversion is mechanical, and content collections give Astro-native type safety. The "no modification" constraint should be interpreted as "no content text changes" not "no frontmatter format changes." Document this decision.
- If the no-modification constraint is hard: port the `generate-blog-manifest.mjs` script to work with Astro by using `import.meta.glob('../../blogs/*.mdx')` in a build-time script or Astro integration hook

**Phase to address:** Phase 1 (content pipeline) — must be decided before any other migration work.

---

## Minor Pitfalls

### Pitfall 14: The `.md` Raw Markdown Route Breaks in Astro

**What goes wrong:** The current blog post page links to `/blogs/${slug}.md` for "View article as markdown." There is also a reference in the metadata `alternates` to `types: { 'text/markdown': ... }`. Astro does not automatically serve MDX source files as `.md` routes. The MDX source files are compiled at build time and the originals are not included in the output.

**Prevention:**
- If the raw markdown link must be preserved: create a dynamic Astro API route `src/pages/blogs/[slug].md.ts` that reads the source MDX file and returns it as text/plain with the `.md` extension
- Alternatively, drop the raw markdown link if it is not heavily used (it is a minor feature — link count unknown)
- The `llms.txt` route references `.md` URLs — this must also be updated if the feature is preserved

**Phase to address:** Phase 3 (routes/SEO migration).

---

### Pitfall 15: `next-mdx-remote` Is Listed as a Dependency But Not Used

**What goes wrong:** `package.json` includes `next-mdx-remote: ^6.0.0` but the codebase uses `@next/mdx` with static imports instead. This is dead code. If someone tries to migrate using `next-mdx-remote` patterns (which is a different MDX loading approach), they will create confusion.

**Prevention:**
- Remove `next-mdx-remote` from dependencies before starting migration — it will not be used in Astro either
- Do not confuse `@next/mdx` (static compile-time MDX imports) with `next-mdx-remote` (runtime MDX evaluation) when mapping patterns to Astro equivalents

**Phase to address:** Phase 0 (pre-migration cleanup).

---

### Pitfall 16: `motion` (Framer Motion) Library Needs Assessment

**What goes wrong:** `motion: ^12.23.26` is in dependencies. No usage of Framer Motion animations is visible in the audited components, but it may be used in components not yet read (`HeroSection`, `BlogCard`, `CertificationBadge`). If motion animations exist, they are React-specific and cannot run in Astro templates or SolidJS islands without the React integration.

**Prevention:**
- Audit `HeroSection.tsx`, `BlogCard.tsx`, and `CertificationBadge.tsx` for `motion` imports before starting migration
- If animations exist: either replace with SolidJS-compatible alternatives (`@motionone/solid`) or use CSS transitions instead
- If no animations are found: remove `motion` from dependencies

**Phase to address:** Phase 0 (pre-migration audit).

---

### Pitfall 17: The Custom Anchor Generation Function Has a Known Fragility

**What goes wrong:** In `mdx-components.tsx`, heading anchors are generated by:
```typescript
const anchor = (text: string) => text.toString().toLowerCase().replace(/\s/g, '-');
```

This does not handle: special characters (e.g., backticks in heading text), unicode, duplicate headings, or HTML entities. In Astro's MDX integration, if `rehype-slug` is used for heading IDs instead, the generated IDs will differ from what the current implementation produces — breaking any existing anchor links shared or bookmarked by readers.

**Prevention:**
- Keep the same anchor generation logic in the Astro MDX component map to preserve URL parity
- Do NOT use `rehype-slug` as a rehype plugin unless its output is verified to match the current custom `anchor()` function
- Document the anchor format as a project invariant

**Phase to address:** Phase 3 (MDX components migration).

---

### Pitfall 18: Geist Font Loading Moves from `next/font/google` to CSS @font-face

**What goes wrong:** The current layout loads Geist fonts via:
```typescript
import { Geist, Geist_Mono } from "next/font/google";
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
```

`next/font` does not exist in Astro. The CSS variable injection pattern (setting `--font-geist-sans` on `<body>`) must be replicated manually.

**Prevention:**
- Use the Geist font package directly: `npm install geist` and import CSS from `geist/dist/fonts/geist-sans/style.css` (the package provides pre-built CSS)
- OR use a `<link>` tag to Google Fonts in the Astro layout head
- Set the CSS variables manually in `globals.css` to preserve the `--font-geist-sans` and `--font-geist-mono` references used throughout components
- The `codeTagProps` in `CodeBlock` references `var(--font-geist-mono)` — if the variable is not set, code blocks fall back to system monospace

**Phase to address:** Phase 1 (Astro layout setup).

---

## Phase-Specific Warnings

| Phase | Topic | Likely Pitfall | Mitigation |
|-------|-------|---------------|------------|
| Phase 0 (Pre-migration) | Dependency audit | `motion`, `next-mdx-remote` unused but present | Remove before starting; document what each dep is used for |
| Phase 1 (Foundation) | MDX frontmatter format | `export const meta` vs YAML frontmatter | Decide approach upfront; do not mix the two |
| Phase 1 (Foundation) | Tailwind v4 setup | Wrong integration (`@astrojs/tailwind` instead of `@tailwindcss/vite`) | Use Vite plugin, not Astro integration |
| Phase 1 (Foundation) | Font loading | `next/font/google` unavailable | Use Geist npm package CSS directly |
| Phase 1 (Foundation) | Static paths / 404 | `dynamicParams = false` equivalent needed | `output: static` + `getStaticPaths()` + `src/pages/404.astro` |
| Phase 2 (Interactive) | Theme FOUC | No provider equivalent | Inline blocking script in `<head>` before body |
| Phase 2 (Interactive) | Radix UI components | No SolidJS port | Rewrite Sheet as native dialog; NavigationMenu as plain HTML nav |
| Phase 2 (Interactive) | Island boundaries | Astro content cannot be passed as children to SolidJS islands | Separate static shell from island; keep islands small |
| Phase 3 (MDX Components) | `next/link` in component map | Build failure | Replace with plain `<a>` tags |
| Phase 3 (MDX Components) | In-file MDX imports (`Img`) | `next/image` not found at build time | Create Astro-compatible `Img`; pass via component map not per-file imports |
| Phase 3 (MDX Components) | Syntax highlighting | `react-syntax-highlighter` unusable in SolidJS | Use Shiki at build time in Astro MDX config; SolidJS only for CopyButton |
| Phase 3 (MDX Components) | Anchor generation | Different logic produces different IDs → broken links | Keep same `anchor()` function exactly; do not use rehype-slug |
| Phase 4 (Deployment) | Cloudflare Workers vs Pages | Wrong `wrangler` commands and output structure | Use `@astrojs/cloudflare` + `output: static`; restructure wrangler config for Pages |
| Phase 4 (Deployment) | Image optimization | `/_next/image` URLs in dev + `imgUrl()` helper | Update imgUrl helper; use Cloudflare CDN paths directly in Astro |

---

## Sources

- Direct codebase analysis: `mdx-components.tsx`, `src/app/blogs/[slug]/page.tsx`, `src/components/layout/Header.tsx`, `src/components/code-block.tsx`, `src/components/theme-provider.tsx`, `next.config.ts`, `package.json`, all 9 MDX blog files
- Confidence: HIGH for all pitfalls where the specific code pattern was confirmed by reading the actual files
- Architecture knowledge: Astro island model, SolidJS signal system, Cloudflare Pages vs Workers deployment differences — HIGH confidence based on known ecosystem behavior as of August 2025 knowledge cutoff
- Note: Astro and SolidJS are actively developed; verify current adapter/integration versions when implementing
