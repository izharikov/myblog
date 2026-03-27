---
phase: 03-mdx-components
plan: 01
subsystem: ui
tags: [astro, mdx, shiki, syntax-highlighting, tailwind, clipboard]

# Dependency graph
requires:
  - phase: 02-static-pages-layouts
    provides: BlogLayout.astro wrapping MDX content in prose div; globals.css with Tailwind theme variables
provides:
  - Shiki dual-theme (github-light / github-dark) configured in astro.config.mjs
  - H2-H6 Astro components with hover-reveal anchor link and clipboard copy
  - CodeBlock.astro with copy-to-clipboard button and icon swap feedback
  - InlineCode.astro standalone component
  - Inline code global CSS via :not(pre) > code selector
  - Dark mode Shiki CSS variables in globals.css
affects: [03-mdx-components plan 02, BlogLayout, blog slug pages]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Astro component per MDX heading element (H2-H6) with slot-based content and id forwarding"
    - "Shiki dual-theme via markdown.shikiConfig — mdx() integration inherits automatically"
    - "Dark mode code block colors via CSS variables (.dark .astro-code) — no JS needed"
    - "Inline code styled via :not(pre) > code to avoid interfering with Shiki's pre>code output"
    - "Astro deduplicates identical <script> blocks — same anchor script in all heading files runs once"

key-files:
  created:
    - src/components/mdx/H2.astro
    - src/components/mdx/H3.astro
    - src/components/mdx/H4.astro
    - src/components/mdx/H5.astro
    - src/components/mdx/H6.astro
    - src/components/mdx/CodeBlock.astro
    - src/components/mdx/InlineCode.astro
  modified:
    - astro.config.mjs
    - src/styles/globals.css

key-decisions:
  - "InlineCode.astro is NOT mapped in the components prop — global CSS :not(pre) > code handles inline code to avoid interfering with Shiki's pre>code rendering"
  - "Shiki dual-theme configured at markdown level, not mdx() integration level — mdx() inherits automatically per Astro docs"
  - "Identical <script> blocks in H2-H6 deduplicated by Astro at build time — intentional pattern"

patterns-established:
  - "MDX component overrides: Astro component files in src/components/mdx/ mapped in components prop"
  - "Copy-to-clipboard with visual feedback: data-copy-button attribute + data-copied toggle + CSS attribute selectors"
  - "Anchor links: data-anchor-id attribute drives clipboard URL construction from window.location"

requirements-completed: [MDX-01, MDX-02, MDX-03, MDX-04, MDX-07]

# Metrics
duration: 2min
completed: 2026-03-27
---

# Phase 03 Plan 01: MDX Components (Headings + CodeBlock) Summary

**Shiki dual-theme (github-light/github-dark) configured in astro.config.mjs with 7 MDX Astro components: H2-H6 headings with hover-reveal anchor links, CodeBlock with copy button, and InlineCode**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-27T21:29:17Z
- **Completed:** 2026-03-27T21:31:18Z
- **Tasks:** 1
- **Files modified:** 9

## Accomplishments

- Added `markdown.shikiConfig` with `github-light`/`github-dark` themes and `defaultColor: false` to astro.config.mjs — enables build-time syntax highlighting with zero runtime JS
- Added `.dark .astro-code` CSS variable rules to globals.css for dark mode code block theming without JavaScript
- Created H2-H6 heading components with exact Tailwind classes matching old Next.js site, hover-reveal anchor icon (lucide Link SVG inline), and clipboard copy via `navigator.clipboard.writeText`
- Created CodeBlock.astro wrapping Shiki `<pre>` output with copy button, icon swap (copy/check SVGs toggled via `data-copied` attribute), and `group-hover` opacity reveal
- Created InlineCode.astro as standalone component; inline code styling delivered via `:not(pre) > code` global CSS to avoid interfering with Shiki's `pre > code` output

## Task Commits

1. **Task 1: Configure Shiki dual-theme and create heading + code components** - `a7c3fe0` (feat)

## Files Created/Modified

- `astro.config.mjs` - Added markdown.shikiConfig with github-light/github-dark themes and defaultColor: false
- `src/styles/globals.css` - Added .dark .astro-code Shiki dark mode CSS and :not(pre) > code inline code styling
- `src/components/mdx/H2.astro` - h2 with scroll-m-20 border-b styling, hover-reveal anchor link, clipboard copy script
- `src/components/mdx/H3.astro` - h3 with text-2xl styling, same anchor pattern
- `src/components/mdx/H4.astro` - h4 with text-xl styling, same anchor pattern
- `src/components/mdx/H5.astro` - h5 with text-lg styling, same anchor pattern
- `src/components/mdx/H6.astro` - h6 with text-base styling, same anchor pattern
- `src/components/mdx/CodeBlock.astro` - pre wrapper with copy button, SVG icon swap, and copy script
- `src/components/mdx/InlineCode.astro` - standalone inline code component (bg-muted, font-mono)

## Decisions Made

- InlineCode.astro is NOT mapped in the MDX components prop — `@astrojs/mdx` passes Shiki's rendered `<pre><code>` output which would conflict if `code` element is overridden. Instead, `:not(pre) > code` global CSS rule handles inline backtick code.
- Shiki configured at `markdown` level (not inside `mdx()` integration call) — `mdx()` inherits `shikiConfig` from `markdown` automatically in Astro 6.
- Identical `<script>` blocks across H2-H6 are intentional — Astro deduplicates them, so the anchor click handler runs exactly once per page.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None — `npx astro check` returned 0 errors. Pre-existing deprecation hints from `z` in `content.config.ts` are out of scope for this plan.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- H2-H6, CodeBlock, and InlineCode components are ready to be wired in the MDX components map (Plan 03-02)
- Shiki dual-theme is active; dark mode CSS variables will take effect once `.dark` class is applied to `<html>` (theme toggle wired in Phase 04)
- No blockers for Plan 03-02

---
*Phase: 03-mdx-components*
*Completed: 2026-03-27*
