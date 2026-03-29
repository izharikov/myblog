# Decisions

## 2026-03-29 — Design tokens via Tailwind v4 @theme block

**Context:** Need a token system that's extensible, supports dark mode, and doesn't add build complexity.

**Decision:** Use CSS custom properties inside Tailwind v4's `@theme` block in `global.css`. Dark mode via `.dark` class swapping token values.

**Rationale:** Tailwind v4 is natively built on CSS custom properties — no config file needed. Tokens defined in CSS are framework-agnostic and work in both `.astro` and `.tsx` files. Class-based dark mode (vs `prefers-color-scheme`) allows user override via toggle.

## 2026-03-29 — Semantic color naming over palette naming

**Context:** Colors need to be referenceable across components and swappable between themes.

**Decision:** Use semantic names (`--color-surface`, `--color-text-primary`, `--color-accent`) instead of palette names (`--color-blue-500`, `--color-gray-200`).

**Rationale:** Semantic tokens decouple intent from value. Adding a new theme (sepia, high-contrast) means only redefining token values, not searching every component. oklch color space chosen for perceptual uniformity across themes.

## 2026-03-29 — Design in code, not Figma

**Context:** Solo developer project — overhead of maintaining a Figma file alongside code is not worth it.

**Decision:** Design directly in Astro components using AI-assisted iteration (Claude Code for SolidJS/Astro output, v0 for layout exploration).

**Rationale:** For a ~10-component blog, the feedback loop of editing code + hot reload is faster than Figma → export → implement. AI tools can generate production-ready Tailwind components directly.

## 2026-03-29 — Variant comparison via dev preview page

**Context:** Need a way to compare design variants locally.

**Decision:** Create a `/dev/preview` page that renders component variants side-by-side. Iterate with hot reload, pick the winner, delete the rest.

**Rationale:** Quick local feedback loop. No deployment overhead. Works well with AI-generated variants — paste multiple options into the preview page and compare visually.

## 2026-03-29 — Design quality via audit checklist

**Context:** Need to ensure the redesign meets quality standards.

**Decision:** Run a manual audit checklist at each milestone. Automated checks limited to Lighthouse.

**Rationale:** Visual quality is hard to automate. A checklist catches what matters for a blog: contrast, spacing consistency, responsive behavior, dark mode. Lighthouse covers performance and basic accessibility.

## 2026-03-29 — Custom prose styles over @tailwindcss/typography

**Context:** Blog post content styling needs to be consistent and controllable.

**Decision:** Evaluate both during implementation. Lean toward custom `.prose` styles for full control, fall back to typography plugin if scope grows.

**Rationale:** Custom prose styles keep the dependency count low and give exact control over heading spacing, code block styling, and dark mode.

## 2026-03-29 — No component library

**Context:** The blog needs ~10 UI components. Full libraries (shadcn, Kobalte) bring overhead.

**Decision:** Hand-roll all components with Tailwind. Use `cn()` (clsx + twMerge) for variant composition.

**Rationale:** Blog components (cards, buttons, tags, grids) are simple enough for Tailwind directly. Eliminates dependency churn and bundle overhead.

## 2026-03-29 — Font D + Color Scheme 2

**Context:** Reviewed 5 font pairings and 5 color schemes on the live preview page.

**Decision:**
- Fonts: **Space Grotesk** (headings + body) + **IBM Plex Mono** (code)
- Colors: **Warm Charcoal & Amber** — warm neutral base with amber/orange accent

**Rationale:** Space Grotesk has geometric character without being sterile. IBM Plex Mono is highly readable at small sizes. Warm Charcoal & Amber gives the minimal base a distinctive editorial warmth with a single strong contrast point.
