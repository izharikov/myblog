---
phase: 04-solidjs-islands
plan: 01
subsystem: ui
tags: [solid-js, dark-mode, tailwind, fouc, localStorage, lucide-solid]

# Dependency graph
requires:
  - phase: 02-static-pages-layouts
    provides: BaseLayout.astro and Header.astro with placeholder divs for SolidJS islands
  - phase: 03-mdx-components
    provides: globals.css with @custom-variant dark selector (needed fixing)
provides:
  - FOUC-free dark mode infrastructure via blocking is:inline script in BaseLayout head
  - Fixed Tailwind v4 @custom-variant dark selector using :where() for zero specificity
  - ThemeToggle SolidJS island component ready for client:only="solid-js" wiring in Header
affects:
  - 04-solidjs-islands (plan 02 — wires ThemeToggle and MobileMenu into Header.astro)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - FOUC prevention via is:inline blocking script reading localStorage then system preference
    - SolidJS island reads initial theme state from document.documentElement.classList (not localStorage)
    - createEffect writes back to both DOM class and localStorage on every signal change
    - client:only="solid-js" to avoid build-time SSR errors when component accesses document at init

key-files:
  created:
    - src/components/layout/ThemeToggle.tsx
  modified:
    - src/styles/globals.css
    - src/layouts/BaseLayout.astro

key-decisions:
  - "Used client:only=\"solid-js\" approach for ThemeToggle (not client:load) — component reads document at signal init which fails at build-time SSR"
  - "Fixed @custom-variant dark selector to :where(.dark, .dark *) per official Tailwind v4 docs — :is(.dark *) only matches descendants, not the element itself"
  - "Inline script reads localStorage first, falls back to prefers-color-scheme — dark class set before any HTML body renders"

patterns-established:
  - "Pattern: FOUC-free dark mode — is:inline blocking script in <head> before </head>"
  - "Pattern: SolidJS theme toggle — createSignal reads classList.contains, createEffect toggles classList and writes localStorage"

requirements-completed: [THEME-01, THEME-02, THEME-03]

# Metrics
duration: 8min
completed: 2026-03-27
---

# Phase 04 Plan 01: Dark Mode Infrastructure and ThemeToggle Island Summary

**FOUC-free dark mode via blocking is:inline script in BaseLayout head, fixed Tailwind v4 :where() dark variant, and ThemeToggle SolidJS island using createSignal/createEffect**

## Performance

- **Duration:** 8 min
- **Started:** 2026-03-27T22:30:00Z
- **Completed:** 2026-03-27T22:38:00Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Fixed globals.css dark variant from `&:is(.dark *)` to `&:where(.dark, .dark *)` — now applies on the root element itself, not just descendants
- Added blocking `is:inline` script to BaseLayout head that sets `.dark` class from localStorage/system preference before first paint (eliminates FOUC)
- Created ThemeToggle.tsx SolidJS island using createSignal initialized from DOM classList and createEffect to keep classList/localStorage in sync

## Task Commits

Each task was committed atomically:

1. **Task 1: Fix Tailwind dark variant and add FOUC-prevention script** - `6f247b2` (feat)
2. **Task 2: Create ThemeToggle SolidJS island** - `fdbd700` (feat)

**Plan metadata:** (docs commit — see below)

## Files Created/Modified
- `src/styles/globals.css` - Fixed line 7: @custom-variant dark selector uses :where() for zero-specificity match including root element
- `src/layouts/BaseLayout.astro` - Added is:inline blocking script in head to set .dark class from localStorage/system preference
- `src/components/layout/ThemeToggle.tsx` - New SolidJS island: createSignal reads initial dark state from classList, createEffect toggles class and writes localStorage, Sun/Moon icons from lucide-solid

## Decisions Made
- Used `client:only="solid-js"` (not `client:load`) for ThemeToggle — the signal initializer calls `document.documentElement.classList.contains("dark")` which fails during Astro's build-time SSR render. `client:only` skips SSR entirely.
- Fixed the Tailwind v4 `@custom-variant dark` selector from `&:is(.dark *)` to `&:where(.dark, .dark *)` per official Tailwind v4 docs. The `:is()` selector only matches descendants of `.dark`, not `.dark` itself — so dark utilities on the `<html>` element itself would not fire.
- Inline script reads localStorage first (explicit user preference), falls back to `window.matchMedia("(prefers-color-scheme: dark)")` for first-time visitors.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- None. `npx astro check` passes with 0 errors. Pre-existing z deprecation warnings from Zod 4 in content.config.ts are unrelated to this plan.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- ThemeToggle.tsx is ready to be imported into Header.astro with `client:only="solid-js"` directive (Plan 04-02)
- FOUC prevention is live — dark class is set on `<html>` before any HTML body renders
- Tailwind dark: utilities now work correctly on both the root element and all descendants
- MobileMenu SolidJS island is the remaining task for Phase 04 (Plan 04-02)

## Self-Check: PASSED

- FOUND: src/styles/globals.css
- FOUND: src/layouts/BaseLayout.astro
- FOUND: src/components/layout/ThemeToggle.tsx
- FOUND: .planning/phases/04-solidjs-islands/04-01-SUMMARY.md
- FOUND: commit 6f247b2 (feat: fix Tailwind dark variant and FOUC-prevention script)
- FOUND: commit fdbd700 (feat: create ThemeToggle SolidJS island)

---
*Phase: 04-solidjs-islands*
*Completed: 2026-03-27*
