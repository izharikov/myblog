---
phase: 01-foundation-content-pipeline
plan: "03"
subsystem: content
tags: [astro, content-collections, zod, mdx, glob-loader]

requires:
  - phase: "01-01"
    provides: "9 MDX files with YAML frontmatter in blogs/"
  - phase: "01-02"
    provides: "Astro 6 scaffold with tsconfig, astro.config.mjs, globals.css"
provides:
  - "src/content.config.ts with defineCollection, glob loader, Zod schema"
  - "getCollection('blog') returns 9 entries with title, slug, logo, description, tags, date"
  - "src/config/site.ts confirmed framework-agnostic"
  - "src/pages/test-collections.astro smoke test page"
affects: ["02", "03", "04", "05"]

tech-stack:
  added: []
  patterns:
    - "Astro 6 content collections via src/content.config.ts (not src/content/config.ts)"
    - "glob loader with base relative to project root, not src/"
    - "generateId strips numeric prefix from filename for fallback slug"
    - "z imported from astro:content (Zod 4 bundled by Astro), not bare zod"

key-files:
  created:
    - src/content.config.ts
    - src/pages/test-collections.astro
  modified: []

key-decisions:
  - "generateId strips numeric prefix ('1-xp-precompilation' -> 'xp-precompilation') as fallback; explicit slug in YAML frontmatter takes priority"
  - "test-collections.astro is a temporary smoke test page — to be deleted in Phase 2 when real pages are built"
  - "astro build fails due to legacy src/components importing next/image and react (pre-existing from Plan 02 scope boundary); astro check and content sync both pass cleanly"

patterns-established:
  - "Content config at src/content.config.ts — this is the Astro 5+ location, src/content/config.ts is silently ignored"
  - "Zod schema uses z from astro:content, not from standalone zod package"
  - "glob loader base path is relative to project root"

requirements-completed: [FOUND-04, CONT-01, CONT-04, CONT-05]

duration: 8min
completed: "2026-03-27"
---

# Phase 01 Plan 03: Content Collections Summary

**Astro 6 content collections wired to blogs/ MDX files via glob loader; getCollection('blog') returns all 9 posts with correct slug, title, date, tags metadata.**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-03-27T20:21:00Z
- **Completed:** 2026-03-27T20:25:30Z
- **Tasks:** 2
- **Files modified:** 2 created, 0 modified

## Accomplishments

- Created src/content.config.ts with defineCollection, glob loader pointing at ./blogs, Zod schema (title, slug, logo, description, tags, date), and generateId that strips numeric prefixes
- Confirmed src/config/site.ts is already framework-agnostic (no Next.js/React imports)
- Created test-collections.astro smoke test verifying all 9 posts load with correct metadata
- Verified all 9 expected slugs present in .astro/data-store.json (xp-precompilation, send-mcp, sitecore-ci-cd, sitecore-ch-dam-exam, sitecoreai-mcp-marketplace-symposium2025-recap, sitecore-mcp-server-issue, sitecore-marketplace-updates, sitecore-marketplace-ai-tools, sitecore-marketplace-app-server-side-authentication)
- astro check exits 0 (7 files, 0 errors)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create src/content.config.ts with Zod schema and glob loader** - `cccacc2` (feat)
2. **Task 2: Verify site.ts is framework-agnostic and create smoke-test page** - `5ea4443` (feat)

**Plan metadata:** (docs commit — see below)

## Files Created/Modified

- `src/content.config.ts` - Astro 6 content collections definition; glob loader reads ./blogs/**/*.mdx; Zod schema validates all frontmatter fields; generateId strips numeric filename prefix
- `src/pages/test-collections.astro` - Smoke test page; calls getCollection('blog'), sorts by date, lists all 9 post titles/slugs/dates/tags; temporary — delete in Phase 2

## Decisions Made

- Used `generateId` to strip numeric prefix (`1-xp-precompilation.mdx` -> `xp-precompilation`) as fallback. Explicit `slug` field in YAML frontmatter (set in Plan 01) takes priority so all 9 slugs match originals exactly.
- Imported `z` from `'astro:content'` not from `'zod'` directly — Astro 6 bundles Zod 4 which has breaking API changes vs Zod 3.
- test-collections.astro marked for deletion in Phase 2 per plan guidance.

## Deviations from Plan

None — plan executed exactly as written. The `npx astro build` failure due to legacy `src/components/ui/img.tsx` importing `next/image` is a pre-existing issue from Plan 02's scope boundary (legacy directories excluded from TS check but still picked up by Rollup during full build). This is documented in STATE.md and will be resolved in Phase 3 when legacy components are migrated. astro check (our primary quality gate) passes cleanly.

## Issues Encountered

- `npx astro build` fails with "Failed to resolve import 'next/image' from src/components/ui/img.tsx" — this is a pre-existing issue from legacy src/components directory, not caused by Plan 03 changes. The content collection loads all 9 posts correctly as confirmed by data-store.json inspection. astro check exits 0.

## User Setup Required

None — no external service configuration required.

## Known Stubs

- `src/pages/test-collections.astro` — temporary smoke test with no styling; intentional per plan, to be deleted in Phase 2.

## Next Phase Readiness

- Phase 1 complete: MDX frontmatter converted (Plan 01), Astro scaffold built (Plan 02), content collections wired (Plan 03)
- Phase 2 can immediately use `getCollection('blog')` to build the blog listing and post pages
- All 9 slugs verified — URL parity established
- Legacy src/components migration must happen in Phase 3 before a successful `npx astro build` is possible

---
*Phase: 01-foundation-content-pipeline*
*Completed: 2026-03-27*
