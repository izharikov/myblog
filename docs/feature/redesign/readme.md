# Feature: Redesign

## Goal

Redesign the blog's visual identity with a clean, extensible design system built on Tailwind CSS v4 design tokens. The system should support dark/light themes, be easy to evolve, and keep the site fast (zero JS for static content).

## Scope

### Included
- Design token foundation (colors, typography, spacing, radii)
- Dark/light theme via semantic CSS custom properties
- Prose styles for blog post content
- Core component restyling: Header, Footer, BlogCard, BlogGrid, HeroSection
- MDX component styling: code blocks, headings, links, tables, images
- Responsive layout refinements

### Out of scope
- New pages or routes
- New interactive features (search, comments, etc.)
- Content changes

## Constraints

- Tailwind CSS v4 `@theme` block for all tokens — no `tailwind.config.js`
- Semantic token names (`--color-surface`, not `--color-gray-100`) for easy theme switching
- oklch color space for perceptual uniformity
- `.astro` components for all static UI; SolidJS only for existing islands
- No component libraries (shadcn, Kobalte) — hand-roll the ~10 components needed
- `cn()` helper (clsx + twMerge) for variant composition, no CVA

## Design Approach

Design in code, not Figma. Use AI (Claude Code, v0) to generate and iterate on components directly in Astro + Tailwind. Port ideas from v0 as structural inspiration, not copy-paste.
