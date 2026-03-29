# Feature: Logo & Branding

## Goal

Replace the mismatched VS Code-themed favicon and plain-text header with a cohesive brand identity using the warm charcoal & amber design tokens.

## Current state

- **Favicon**: SVG `<IZ>` in VS Code blue (#569CD6) on dark (#1E1E1E) — clashes with amber palette
- **Header**: plain text `@izharikov`, no icon
- **Apple touch icon / web manifest**: missing
- **Footer socials**: different SVG sizes than hero socials (inconsistent)

## Scope

- Favicon (SVG + PNG fallback + apple-touch-icon)
- Logo mark (geometric, simple, brand-colored)
- Header: icon + wordmark
- Footer: normalize social icon sizes to match hero
- Web manifest (name, icons, theme-color)

Out of scope: OG image, about page, full brand guidelines.

## Constraints

- SVG favicon for modern browsers, PNG fallback for legacy
- Must read well at 16x16, 32x32, and 180x180 (apple-touch)
- Use accent color from design tokens (amber oklch(0.50 0.18 55) light / oklch(0.72 0.16 55) dark)
- Geometric mark should be simple enough to work as monochrome
