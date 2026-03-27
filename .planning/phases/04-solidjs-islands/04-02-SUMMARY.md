---
phase: 04-solidjs-islands
plan: 02
subsystem: ui
tags: [solid-js, mobile-menu, portal, header]

# Key files
key-files:
  created:
    - src/components/layout/MobileMenu.tsx
  modified:
    - src/components/layout/Header.astro
---

## What was built

MobileMenu SolidJS island — slide-in drawer with dark overlay, Escape key handler, body scroll lock, and navigation links from siteConfig. Uses SolidJS Portal to render overlay/drawer at body level (escaping header's backdrop-filter containing block). Both ThemeToggle and MobileMenu wired into Header.astro with client:load.

## Deviations

- Switched from `client:only="solid-js"` to `client:load` for faster dev experience (inline SVGs instead of lucide-solid, SSR placeholder renders instantly)
- Used SolidJS Portal instead of direct rendering to fix backdrop-filter stacking context issue
- Inlined SVG icons instead of importing from lucide-solid (avoids SSR crash + reduces dev compile time)

## Self-Check: PASSED
