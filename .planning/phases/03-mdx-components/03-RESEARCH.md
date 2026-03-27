# Phase 3: MDX Components - Research

**Researched:** 2026-03-27
**Domain:** Astro MDX custom components, Shiki dual-theme syntax highlighting, SolidJS/vanilla JS clipboard interaction
**Confidence:** HIGH

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| MDX-01 | Custom heading components with proper styling | Astro `components` prop on `<Content />` supports h1–h6 override with `.astro` files |
| MDX-02 | Code blocks with Shiki syntax highlighting (build-time, zero JS) | Shiki is Astro's built-in highlighter; `shikiConfig.themes` in `astro.config.mjs` enables build-time highlighting |
| MDX-03 | Dual-theme syntax highlighting (light/dark via CSS variables) | `shikiConfig.themes: { light, dark }` + `defaultColor: false` + CSS `.dark .astro-code` selector enables pure-CSS theme switching |
| MDX-04 | Copy-to-clipboard button on code blocks | Override `pre` element via `components` prop using an `.astro` wrapper with `<script>` vanilla JS for clipboard — no framework overhead needed |
| MDX-05 | Custom image component replacing next/image imports in MDX | `img` element override via `components` prop; existing stub at `src/components/ui/img.tsx` used by post 9 already works; MDX JSX imports resolve via `@/` alias |
| MDX-06 | Custom link, table, blockquote components | All override via `components` prop in `<Content />` — complete mapping available from old `mdx-components.tsx` |
| MDX-07 | Anchor links on headings (hover-reveal, copy URL) | Heading components receive `id` prop auto-set by Astro's github-slugger; anchor icon in `<a href="#id">` with `navigator.clipboard` via inline `<script>` or SolidJS island |
</phase_requirements>

---

## Summary

Phase 3 implements the full MDX component layer for Astro. The core mechanism is Astro's `components` prop on the `<Content />` component returned by `render()` from `astro:content`. Any HTML element emitted by MDX (h1–h6, pre, img, a, table, blockquote, etc.) can be replaced with a custom Astro or SolidJS component by passing a `components` object.

Shiki is bundled inside Astro (`shiki@4.0.2` at time of writing). Dual-theme light/dark syntax highlighting is enabled by setting `markdown.shikiConfig.themes` in `astro.config.mjs` and adding CSS variables for `.dark .astro-code` selectors. No runtime JS is required for highlighting — it is entirely build-time.

The copy-to-clipboard button is the only interactive element in this phase. A small `<script>` block inside an Astro `CodeBlock.astro` component is the simplest zero-framework approach; it reads `.innerText` from the `<code>` child and calls `navigator.clipboard.writeText()`. This avoids SolidJS island overhead for a single button. Heading anchor copy (MDX-07) follows the same pattern: a plain `<a>` tag plus an inline `onclick` or `<script>` that calls `navigator.clipboard.writeText(window.location.origin + window.location.pathname + '#' + id)`.

**Primary recommendation:** Build all MDX component overrides as `.astro` files, use Shiki dual-theme via CSS variables, and use inline `<script>` blocks for clipboard interactions (not SolidJS islands) to keep Phase 3 JS-free from the framework perspective.

---

## Project Constraints (from CLAUDE.md)

- **Content preservation**: All existing MDX blog posts must work without content file modifications. Post 9 imports `{ Img }` from `@/components/ui/img` — this stub must be promoted to a real component in Phase 3.
- **URL parity**: Fragment IDs on headings must match current site format (lowercase, hyphenated, matching the `github-slugger` output that Astro already uses).
- **Styling**: Tailwind CSS v4 with `@tailwindcss/vite`. No PostCSS. CSS variables already defined in `globals.css` (light and dark).
- **SolidJS scope**: Only for interactive components. The copy button and heading anchor copy can use vanilla JS `<script>` inside `.astro` files — no SolidJS island required here.
- **tsconfig.json exclusion**: `src/components`, `src/lib`, `src/types` are excluded from TypeScript compilation. Phase 3 creates new `.astro` and `.tsx` files in `src/components/` — `astro check` handles `.astro` files directly, but the tsconfig exclusion of `src/components` must be updated if any `.ts`/`.tsx` files in that directory need type-checking via `tsc`. Confirmed: `astro check` currently passes with 0 errors despite exclusion.

---

## Standard Stack

### Core (already installed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro `@astrojs/mdx` | 5.0.3 | MDX processing and custom component injection | Astro's official MDX integration; `components` prop is the canonical override mechanism |
| Shiki | 4.0.2 (bundled via `astro`) | Build-time syntax highlighting | Zero-JS, embedded in Astro; replaces react-syntax-highlighter |
| Tailwind CSS v4 | 4.2.2 | Utility CSS for all component styling | Project constraint |
| lucide-solid | 0.577.0 | Icons (Link icon for anchor, Copy icon for button) | Already installed; project choice |

### No new packages required

All functionality in Phase 3 can be implemented without installing additional packages. Specifically:
- No `astro-expressive-code` needed — Shiki's built-in dual-theme is sufficient
- No `rehype-slug` needed — Astro already injects heading IDs via its own rehype plugin
- No `rehype-autolink-headings` needed — heading anchor links are built into the custom heading component

**Version verification (npm view, 2026-03-27):**
```bash
npm view @astrojs/mdx version  # 5.0.3
npm view shiki version         # 4.0.2
```

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── components/
│   ├── blog/
│   │   ├── BlogCard.astro          # existing
│   │   └── BlogGrid.astro          # existing
│   ├── mdx/                        # NEW — all MDX component overrides
│   │   ├── Heading.astro           # h1-h6 with anchor link
│   │   ├── CodeBlock.astro         # pre wrapper with copy button
│   │   ├── InlineCode.astro        # code (inline, no language)
│   │   ├── Img.astro               # img override (wraps stub)
│   │   ├── Link.astro              # a override
│   │   ├── Table.astro             # table + overflow wrapper
│   │   └── Blockquote.astro        # blockquote with border styling
│   └── ui/
│       └── img.tsx                 # existing stub — promote or replace
├── layouts/
│   └── BlogLayout.astro            # update: import + pass components prop
└── styles/
    └── globals.css                 # update: add .dark .astro-code CSS vars
```

### Pattern 1: Content Component with MDX Overrides

The `components` prop is passed to `<Content />` in `BlogLayout.astro` (which wraps `<slot />`). The `[slug].astro` page already calls `render(post)` and passes `<Content />` to `BlogLayout`. The cleanest approach is to accept the `Content` component as a prop in `BlogLayout.astro` or to have `[slug].astro` pass the components object directly.

**Recommended approach — update `[slug].astro`:**

```astro
---
// src/pages/blogs/[slug].astro
import { getCollection, render } from 'astro:content';
import BlogLayout from '@/layouts/BlogLayout.astro';
import Heading from '@/components/mdx/Heading.astro';
import CodeBlock from '@/components/mdx/CodeBlock.astro';
import InlineCode from '@/components/mdx/InlineCode.astro';
import Img from '@/components/mdx/Img.astro';
import Link from '@/components/mdx/Link.astro';
import Table from '@/components/mdx/Table.astro';
import Blockquote from '@/components/mdx/Blockquote.astro';

const mdxComponents = {
  h1: Heading,
  h2: Heading,
  h3: Heading,
  h4: Heading,
  h5: Heading,
  h6: Heading,
  pre: CodeBlock,
  img: Img,
  a: Link,
  table: Table,
  blockquote: Blockquote,
};

// ... getStaticPaths ...
const { post } = Astro.props;
const { Content } = await render(post);
---
<BlogLayout ...>
  <Content components={mdxComponents} />
</BlogLayout>
```

NOTE: When using a single `Heading` component for all heading levels (h1–h6), Astro passes an `id` prop automatically (set by its internal rehype plugin). The component must read `Astro.props` to get `id` and render `<hN id={id}>`.

### Pattern 2: Heading Component with Dynamic Tag

```astro
---
// src/components/mdx/Heading.astro
// Receives: id (auto-set by Astro), children (slot), plus data-heading-level
// Problem: Astro cannot dynamically choose tag name at render time from props alone.
// Solution: Use separate files per level OR use a JavaScript variable for the tag.
---
```

**Known constraint:** Astro `.astro` files cannot use a dynamic element tag like `<{Tag}>` — this requires either:
1. **Separate component per heading level** (H2.astro, H3.astro, etc.) — cleaner, the Astro-idiomatic approach
2. **A single `.tsx` SolidJS component** that accepts a `level` prop — adds island overhead

Use separate Astro components per level. Each file is small (3–5 lines). Pass them all in the `components` map.

```astro
---
// src/components/mdx/H2.astro
const { id, ...rest } = Astro.props;
---
<h2 id={id} class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mt-10 mb-4 group flex items-center gap-2" {...rest}>
  <slot />
  {id && (
    <a href={`#${id}`} class="opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" data-anchor-copy>
      <!-- lucide Link icon SVG or inline -->
      <span class="text-muted-foreground hover:text-foreground">
        <svg .../>
      </span>
    </a>
  )}
</h2>
<script>
  // attach click handler to copy URL+hash
</script>
```

### Pattern 3: Shiki Dual-Theme Configuration

In `astro.config.mjs`:

```javascript
// Source: https://docs.astro.build/en/guides/syntax-highlighting/
export default defineConfig({
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',   // equivalent to old ghcolors
        dark: 'github-dark',     // close to old vscDarkPlus
      },
      defaultColor: false,       // required for CSS variable approach
    },
  },
  // ...
});
```

In `globals.css` (Tailwind v4):

```css
/* Shiki dual-theme: activate dark colors when .dark class is on <html> */
/* Astro uses .astro-code class instead of .shiki */
.dark .astro-code,
.dark .astro-code span {
  color: var(--shiki-dark) !important;
  background-color: var(--shiki-dark-bg) !important;
  font-style: var(--shiki-dark-font-style) !important;
  font-weight: var(--shiki-dark-font-weight) !important;
  text-decoration: var(--shiki-dark-text-decoration) !important;
}
```

This ties into Phase 4's `.dark` class applied to `<html>` by the ThemeToggle island. Phase 3 must output the CSS — Phase 4 will activate it.

### Pattern 4: CodeBlock Astro Component with Copy Button

```astro
---
// src/components/mdx/CodeBlock.astro
// Wraps the <pre> element emitted by Shiki
// Shiki renders: <pre class="astro-code ..."><code>...</code></pre>
// When this component overrides `pre`, it receives the pre's children (code) via <slot />
---
<div class="relative mb-4 mt-6 rounded-lg overflow-hidden border group">
  <button
    class="copy-btn absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity z-10 ..."
    aria-label="Copy code"
    data-copy-button
  >
    <!-- copy icon -->
  </button>
  <pre {...Astro.props} class={`${Astro.props.class ?? ''} ...`}>
    <slot />
  </pre>
</div>
<script>
  // querySelectorAll('[data-copy-button]') — init all on page
  document.querySelectorAll('[data-copy-button]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const pre = btn.closest('div').querySelector('pre');
      const code = pre?.querySelector('code');
      const text = code?.innerText ?? '';
      await navigator.clipboard.writeText(text);
      // swap icon briefly
    });
  });
</script>
```

**Critical:** When `<pre>` is overridden via `components`, Shiki still writes its output as children of the `<pre>` tag. You receive them via `<slot />`. The rendered HTML has `<pre class="astro-code ..."><code>...</code></pre>`. The copy script extracts from `code.innerText`.

**Script deduplication:** If multiple code blocks exist on a page, Astro deduplicates inline `<script>` blocks with identical content automatically — confirmed behavior for `.astro` files. No manual deduplication needed.

### Pattern 5: Img Component (MDX-05)

Post 9 uses an explicit `import { Img } from '@/components/ui/img'` — a JSX component stub. This is different from the `img` element override via the `components` prop.

There are two cases to handle:
1. **Markdown image syntax** (`![alt](src)`) → handled by `img` override in components map
2. **Explicit JSX import** in post 9 (`<Img src="..." alt="..." />`) → handled by the existing stub at `src/components/ui/img.tsx`

For Phase 3, promote the stub into a proper component. The stub already works (returns `<img>` with `loading="lazy"`). Optionally upgrade to use Astro's `<Image>` component for optimization — but since the images are in `public/` (not `src/`), Astro's `<Image>` has limited benefit. Keep plain `<img>` for simplicity per Phase 2 decision pattern.

### Anti-Patterns to Avoid

- **Using `is:inline` on the copy button script unnecessarily** — without `is:inline`, Astro bundles and deduplicates scripts automatically. Use `is:inline` only if you need the script to execute before DOMContentLoaded or need access to template variables.
- **Using `client:load` SolidJS island for the copy button** — adds framework overhead for a 10-line interaction. Vanilla `<script>` in `.astro` is the right tool.
- **Using `prefers-color-scheme` media query for Shiki dark theme** — the site uses a `.dark` class on `<html>` (set by ThemeToggle in Phase 4). Media query won't respect explicit user theme choice. Always use `.dark .astro-code` class selector.
- **Hardcoding heading IDs manually** — Astro's MDX plugin injects `id` automatically using `github-slugger`. Do NOT calculate IDs manually; read the `id` prop passed by Astro to heading components.
- **Mapping `code` element to the code block component** — the old Next.js site intercepted `code` elements to detect code blocks. In Astro, intercept `pre` instead. Shiki outputs `<pre class="astro-code"><code>...</code></pre>` — overriding `pre` gives you the complete block with language info already applied.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Syntax highlighting | Custom CSS/JS highlighter | Shiki (built into Astro) | 100+ languages, zero runtime JS, dual-theme built-in |
| Heading ID generation | Manual text-to-slug function | Astro's auto-injected `id` prop | Astro uses `github-slugger` — already handles edge cases (numbers, special chars, duplicates) |
| MDX component injection globally | Global mdx-components.tsx file | `components` prop on `<Content />` | Astro does not support a global MDX components file — the prop API is the only supported way |
| Theme detection for code blocks | JS reading `localStorage` theme | CSS variables + `.dark` class selector | Build-time Shiki output + CSS switch = zero JS, no flash |
| Table overflow | Custom scrollable wrapper component | Simple `<div class="overflow-x-auto">` wrapper around `<table>` | Doesn't need a dedicated library |

**Key insight:** Shiki's dual-theme CSS variable system does all the heavy lifting for MDX-02 and MDX-03 with ~10 lines of CSS. Don't fight it with JS theme detection.

---

## Common Pitfalls

### Pitfall 1: Dynamic heading tag in a single Astro component
**What goes wrong:** Writing `<{tag} id={id}>` in a `.astro` file throws a build error because Astro's HTML template does not support dynamic element names.
**Why it happens:** Astro's templating is not JSX; it doesn't support dynamic tag names.
**How to avoid:** Create separate `H1.astro`, `H2.astro`, ..., `H6.astro` files. Each is small. All six share the same styling logic.
**Warning signs:** TypeScript error `JSX element type 'Tag' does not have any construct or call signatures`.

### Pitfall 2: Wrong CSS selector for Shiki dark theme
**What goes wrong:** Using `@media (prefers-color-scheme: dark)` selector instead of `.dark .astro-code`. Code blocks ignore user's explicit theme toggle.
**Why it happens:** Many tutorials use the media query approach (system-preference only).
**How to avoid:** Use `.dark .astro-code` — matches the `.dark` class that ThemeToggle (Phase 4) writes to `<html>`.
**Warning signs:** Dark mode toggle works for site UI but code blocks stay light-themed.

### Pitfall 3: MDX `components` prop loses post-specific component imports
**What goes wrong:** Blog post 9 has `import { Img } from '@/components/ui/img'` in the MDX file. If the `img` override in `components` map conflicts with this named import, one may shadow the other.
**Why it happens:** MDX supports both element overrides via `components` prop AND explicit JSX imports in the file body. The JSX import takes precedence for the named `<Img>` usage; the `img` override handles markdown `![alt](src)` syntax.
**How to avoid:** Keep both: `img` in the components map (handles `![](...)`) and the `@/components/ui/img` stub (handles `<Img />` JSX). They serve different element names.
**Warning signs:** Post 9 renders broken images or TypeScript errors on `Img`.

### Pitfall 4: `shikiConfig` changes not applying to MDX
**What goes wrong:** Shiki config under `markdown.shikiConfig` is documented to apply to both `.md` and `.mdx` files — but `@astrojs/mdx` may need explicit `shikiConfig` passed to it separately.
**Why it happens:** In Astro 6, `@astrojs/mdx` inherits `markdown.shikiConfig` by default. However, if explicitly passed `shikiConfig: {}` in the `mdx()` integration config, it overrides rather than merges.
**How to avoid:** Put `shikiConfig` only in `markdown:` block of `defineConfig()`. Do NOT also pass it to `mdx({...})` unless you intend to override.
**Warning signs:** Code blocks in MDX files use default theme despite config changes.

### Pitfall 5: Copy script fires before DOM is ready on page nav
**What goes wrong:** Vanilla `<script>` runs once on initial load. If using Astro's view transitions (not currently used in this project), scripts need `astro:page-load` event listener.
**Why it happens:** View transitions reinject page content without re-running regular scripts.
**How to avoid:** This project does NOT use `<ViewTransitions />` so standard `<script>` is fine. If view transitions are added in the future, scripts must listen to `document.addEventListener('astro:page-load', ...)`.
**Warning signs:** Copy button stops working after client-side navigation.

### Pitfall 6: `pre` override Astro props forwarding
**What goes wrong:** Shiki sets `style` and `class` attributes on the `<pre>` element (e.g., the background color and `tabindex`). If the `CodeBlock.astro` wrapper doesn't forward these props, the element loses its Shiki-generated styling.
**Why it happens:** The override receives all original `pre` props via `Astro.props`.
**How to avoid:** Forward all props to the inner `<pre>` using spread: `<pre {...Astro.props}>`. But exclude `class` if you're adding custom classes — merge with `clsx` or manual concat.
**Warning signs:** Code block background color is wrong, or Shiki language label (if any) is missing.

---

## Code Examples

### Shiki dual-theme config (`astro.config.mjs`)
```javascript
// Source: https://docs.astro.build/en/guides/syntax-highlighting/
import { defineConfig } from 'astro/config';
import solidJs from '@astrojs/solid-js';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import remarkGfm from 'remark-gfm';

export default defineConfig({
  site: 'https://izharikov.dev',
  output: 'static',
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: false,
    },
  },
  integrations: [
    solidJs(),
    mdx({ remarkPlugins: [remarkGfm] }),
    sitemap(),
  ],
  vite: { plugins: [tailwindcss()] },
});
```

### Shiki dark theme CSS variables (`globals.css`)
```css
/* Source: https://shiki.style/guide/dual-themes (class-based adaptation) */
/* Activate dark code theme when .dark class is on <html> */
/* Astro uses .astro-code instead of .shiki */
.dark .astro-code,
.dark .astro-code span {
  color: var(--shiki-dark) !important;
  background-color: var(--shiki-dark-bg) !important;
  font-style: var(--shiki-dark-font-style) !important;
  font-weight: var(--shiki-dark-font-weight) !important;
  text-decoration: var(--shiki-dark-text-decoration) !important;
}
```

### Content component with MDX overrides (`[slug].astro`)
```astro
---
// Source: https://docs.astro.build/en/guides/integrations-guide/mdx/
import { getCollection, render } from 'astro:content';
import BlogLayout from '@/layouts/BlogLayout.astro';
import H1 from '@/components/mdx/H1.astro';
import H2 from '@/components/mdx/H2.astro';
import H3 from '@/components/mdx/H3.astro';
import H4 from '@/components/mdx/H4.astro';
import H5 from '@/components/mdx/H5.astro';
import H6 from '@/components/mdx/H6.astro';
import CodeBlock from '@/components/mdx/CodeBlock.astro';
import Img from '@/components/mdx/Img.astro';
import Link from '@/components/mdx/Link.astro';
import Table from '@/components/mdx/Table.astro';
import Blockquote from '@/components/mdx/Blockquote.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({ params: { slug: post.id }, props: { post } }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---
<BlogLayout title={post.data.title} ...>
  <Content components={{ h1: H1, h2: H2, h3: H3, h4: H4, h5: H5, h6: H6,
    pre: CodeBlock, img: Img, a: Link, table: Table, blockquote: Blockquote }} />
</BlogLayout>
```

### Heading component with anchor (`H2.astro` — representative)
```astro
---
// id is automatically injected by Astro's MDX rehype plugin (github-slugger)
const { id, ...rest } = Astro.props;
---
<h2
  id={id}
  class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mt-10 mb-4 group flex items-center gap-2"
  {...rest}
>
  <slot />
  {id && (
    <a
      href={`#${id}`}
      class="ms-1 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
      aria-hidden="true"
      data-anchor-id={id}
    >
      <!-- inline SVG: lucide Link icon 16x16 -->
    </a>
  )}
</h2>
<script>
  document.querySelectorAll('[data-anchor-id]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id = link.getAttribute('data-anchor-id');
      const url = `${window.location.origin}${window.location.pathname}#${id}`;
      void navigator.clipboard.writeText(url);
      window.location.hash = id;
    });
  });
</script>
```

### CodeBlock component with copy button (`CodeBlock.astro`)
```astro
---
// Astro passes all <pre> attributes via Astro.props (class, style, tabindex)
const { class: className, ...rest } = Astro.props;
---
<div class="relative mb-4 mt-6 rounded-lg overflow-hidden border group">
  <button
    class="copy-btn absolute right-3 top-3 p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity bg-background/70 hover:bg-background border z-10"
    aria-label="Copy code"
    data-copy-button
  >
    <!-- inline SVG: lucide Copy icon 16x16 -->
  </button>
  <pre class={`astro-code overflow-x-auto p-4 text-sm ${className ?? ''}`} {...rest}>
    <slot />
  </pre>
</div>
<script>
  document.querySelectorAll('[data-copy-button]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const wrapper = btn.closest('div');
      const code = wrapper?.querySelector('code');
      const text = code?.innerText ?? '';
      await navigator.clipboard.writeText(text);
      // brief visual feedback
      btn.setAttribute('data-copied', 'true');
      setTimeout(() => btn.removeAttribute('data-copied'), 2000);
    });
  });
</script>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `react-syntax-highlighter` (Prism runtime) | Shiki (build-time, bundled in Astro) | Astro 1.x | Zero JS for highlighting; better token accuracy |
| `next-themes` + JS theme detection for code | Shiki `themes` + CSS variables | Astro 5+ | No flash; no JS required |
| `mdx-components.tsx` global file (Next.js) | `components` prop on `<Content />` | Astro design | Per-page override; no global file supported |
| React `useRef` + state for copy button | Vanilla `<script>` in `.astro` | — | No hydration cost |
| Dynamic heading component with React state | Separate `.astro` file per heading level | Astro design | No JSX dynamic tags in `.astro`; simpler |
| `github-slugger` called manually in mdx-components | Astro auto-injects heading `id` via rehype | Astro built-in | `id` prop arrives automatically; no manual slug computation |

**Deprecated/outdated:**
- `react-syntax-highlighter`: Removed from project. Never needed again.
- `code` element override for syntax highlighting: In Next.js MDX the old site intercepted the `code` element. In Astro, intercept `pre` instead.
- Global `mdx-components.tsx` pattern: Not supported in Astro — use `components` prop.

---

## Open Questions

1. **Inline code styling**
   - What we know: The `code` element can be overridden via components map for inline code (no `language-*` class)
   - What's unclear: Whether overriding `code` interferes with Shiki-rendered code (which also uses `<code>` inside `<pre>`)
   - Recommendation: Override `pre` (entire block including Shiki output) and handle inline `<code>` by checking if it lacks a `language-*` class. Alternatively: don't override `code` at all and style inline code via global CSS `.prose code` selector.

2. **tsconfig.json exclusion update timing**
   - What we know: `src/components` is excluded from tsconfig to avoid legacy React imports failing type-check. Phase 2 already created `.astro` files there — astro check handles them without tsconfig.
   - What's unclear: Phase 3 adds new `.astro` files and the existing `img.tsx` stub (which is `.tsx`). If `src/components` stays excluded, `tsc` won't type-check `img.tsx` but `astro check` will.
   - Recommendation: Do not change tsconfig in Phase 3; `astro check` is the primary type-check tool. Note the tsconfig exclusion remains from Phase 1 decision — it should be cleaned up in a future phase once all legacy files are gone.

3. **Heading anchor UX: copy URL vs navigate**
   - What we know: Old site's anchor icon used `onClick` to call `navigator.clipboard.writeText()` AND navigated to the fragment via `Link href="#id"`. The click handler prevented default navigation.
   - What's unclear: Whether to navigate AND copy, or just copy.
   - Recommendation: Match old site behavior — both navigate (update URL hash) and copy URL to clipboard. The `<a href="#id">` handles navigation; the click handler adds clipboard copy on top. The URL in clipboard should include origin + pathname + hash.

---

## Environment Availability

All tools needed for Phase 3 are already installed. No new dependencies required.

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Astro | All MDX rendering | Yes | 6.1.1 | — |
| @astrojs/mdx | MDX component injection | Yes | 5.0.3 | — |
| Shiki (via astro) | Syntax highlighting | Yes | 4.0.2 | — |
| tailwindcss | Component styling | Yes | 4.2.2 | — |
| lucide-solid | Icons in components | Yes | 0.577.0 | Inline SVG |
| Node.js | Build | Yes | 24.0.0 | — |

**Missing dependencies with no fallback:** None

---

## Sources

### Primary (HIGH confidence)
- https://docs.astro.build/en/guides/syntax-highlighting/ — Shiki configuration, dual-theme CSS variables, `.astro-code` class
- https://docs.astro.build/en/guides/integrations-guide/mdx/ — `components` prop, `render()` usage with content collections
- https://shiki.style/guide/dual-themes — Class-based `.dark` selector for CSS variable theme switching
- Local codebase: `git show main:mdx-components.tsx` — Complete component mapping from old Next.js site (all styles, elements)
- Local codebase: `git show main:src/components/code-block.tsx` — Old Prism themes (`ghcolors` = light, `vscDarkPlus` = dark)
- Local Shiki installed: `node_modules/shiki@4.0.2` with `bundledThemes` — confirmed `github-light` and `github-dark` available

### Secondary (MEDIUM confidence)
- https://lwkchan.com/blog/2025-05-24-heading-links-in-astro/ — Heading anchor pattern using separate Astro component per level, hover-reveal Tailwind classes, `id` prop auto-injection
- https://hyneks.cz/blog/add-copy-to-clipboard-button-to-code-snippets-in-astro/ — Copy button via `pre` override + `innerText` extraction
- https://timneubauer.dev/blog/copy-code-button-in-astro/ — Vanilla JS `<script>` in layout for copy button (confirmed pattern)
- https://www.kozhuhds.com/blog/assigning-custom-components-to-html-elements-in-astro-collections-image-with-figcaption-example/ — `img` element override pattern for content collections

### Tertiary (LOW confidence — needs validation)
- Multiple community blog posts (2025) confirming `pre` override is the right hook for Shiki output in Astro MDX — consistent across 4+ sources

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages already installed and confirmed working
- Architecture (components prop): HIGH — official Astro docs confirm pattern; used in Phase 2 context
- Shiki dual-theme: HIGH — official Shiki + Astro docs confirm CSS variable approach
- Copy button implementation: MEDIUM — confirmed by multiple community blogs; vanilla JS approach is standard
- Heading anchor ID injection: HIGH — Astro docs confirm github-slugger-based auto-injection
- Dynamic heading tag limitation: HIGH — Astro design constraint, confirmed in community blog

**Research date:** 2026-03-27
**Valid until:** 2026-07-27 (Astro 6.x stable — 120 days; Shiki 4.x stable — 120 days)
