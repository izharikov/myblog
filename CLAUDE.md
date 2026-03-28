## Project

Personal tech blog. Astro 6 + SolidJS 1.9 + Tailwind CSS 4. Static output deployed to Cloudflare Pages.

MDX blog posts in `blogs/`, loaded via Astro content collections. SolidJS used only for interactive islands.

## Commands

- `npm run dev` — dev server (https://blog.local)
- `npm run build` — build to `dist/`

## Conventions

- `.astro` for static components, `.tsx` for SolidJS islands
- PascalCase components, camelCase utilities, 2-space indent
- Named exports, TypeScript strict mode
- See `docs/README.md` for full architecture and project structure

## Feature Tracking

New features planned in `docs/feature/[feature-name]/` with `readme.md`, `decisions.md`, `tasks.md`.
