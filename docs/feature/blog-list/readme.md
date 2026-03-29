# Feature: Blog List Redesign

## Goal

Replace the uniform 3-column card grid with a layout that creates visual hierarchy, improves scannability, and works well at the current scale (9 posts) while scaling to 30+.

## Problem with current approach

- Equal-weight 3-col grid treats every post identically — no emphasis on recent/important content
- Large image thumbnails dominate each card, pushing title and description below the fold on smaller screens
- At 9 posts, the grid looks sparse (3 rows); at 30+ it becomes a wall of sameness
- No way to quickly scan titles — the eye jumps between images instead of reading

## Layout options to evaluate

### A — Featured + compact list
Top 1-2 posts get a large hero-style card (image + full description). Remaining posts render as a compact horizontal list: title, date, tags — no images. Clean, scannable, content-first.

### B — Featured + 2-col grid
First post gets a full-width featured card. Rest in a 2-col grid with smaller cards (image left, text right — horizontal layout). Balances visual interest with density.

### C — Timeline / grouped by year
Posts grouped under year headings. Each post is a single row: date, title, tags. Minimal, dev-blog style. No images on the list page (image shows on the post page).

### D — Mixed density
First row: 1 large featured card spanning full width. Second row: 2 medium cards. Remaining rows: 3-col compact cards (smaller images or no images). Creates natural visual hierarchy through diminishing card sizes.

## Scope

- Blog list page (`/blogs`)
- Home page blog section (reuses same components or a subset)
- BlogCard / BlogGrid components

Out of scope: search, filtering, pagination (can be separate features later).

## Constraints

- Static Astro — no client JS for layout switching
- Must work with current data shape (title, description, slug, logo, date, tags)
- Responsive: single column on mobile, target layout on desktop
- Use existing design tokens from globals.css
