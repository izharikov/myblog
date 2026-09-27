# Decisions

## [2026-09-27] Static export instead of Credly embed

**Context:** Credly offers an embed script and a public `badges.json` endpoint.

**Decision:** `scripts/fetch-credly.mjs` saves `badges.json` data to `src/data/credly.json` and images to `src/images/credly/`.

**Rationale:** No third-party JS, no layout shift, images optimized by Astro, build does not depend on Credly availability.

## [2026-09-27] One group on About, MVP-only strip on Home

**Context:** Badges could be split into MVP and certifications.

**Decision:** About shows all badges as one grid, sorted by issue date. Home hero shows only MVP badges.

**Rationale:** Author preference; MVP streak is the strongest signal at a glance.

## [2026-09-27] Home: MVP badges in a right column (supersedes hero strip)

**Context:** 40px icons under the social links were too small to read.

**Decision:** From `lg` the home page is two columns: hero and posts on the left, a sticky "Sitecore MVP" column with 144px badges on the right. Below `lg` a 64px row stays under the social links.

**Rationale:** Badges must be readable; the right column uses free space without pushing posts down.

## [2026-09-27] About: MVP badges first, certifications on a new row

**Decision:** Two grids: MVP badges by year (newest first), then other certifications by issue date.
