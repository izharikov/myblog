# Blog — Architecture & Setup

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Astro 6 (static output) |
| Islands | SolidJS 1.9 (interactive components only) |
| Styling | Tailwind CSS 4 via `@tailwindcss/vite` |
| Content | MDX with Astro content collections + Zod schema |
| Syntax | Shiki (built-in, dual theme: github-light / github-dark) |
| Deploy | Cloudflare Pages (static) |

## Project Structure

```
src/
  pages/            # File-based routing (.astro)
    index.astro     # Home — hero + latest posts
    about.astro     # About page
    blogs/          # Blog listing + [slug] dynamic route
    llms.txt.ts     # LLM metadata endpoint
  layouts/
    BaseLayout.astro   # Root HTML, fonts, theme script, header/footer
    BlogLayout.astro   # Blog post wrapper with metadata
  components/
    blog/           # BlogCard, BlogGrid
    home/           # HeroSection
    layout/         # Header, Footer, MobileMenu(.tsx), ThemeToggle(.tsx)
    mdx/            # MDX overrides: headings, code blocks, links, images, tables
    icons/          # Icon components
    ui/             # Shared UI primitives
  lib/              # Blog queries, JSON-LD generation, image utils
  config/site.ts    # Site name, description, nav links, social links
  content.config.ts # Content collection schema (blog)
  types/            # BlogPost, BlogMeta, Certification
  styles/           # Global CSS
  images/           # Blog post images (organized by year/slug)
blogs/              # MDX source files (frontmatter: title, slug, logo, description, tags, date)
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (https://blog.local with local certs) |
| `npm run build` | Build static site to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run check` | Run Astro type checking |
| `npm run deploy` | Build + deploy to Cloudflare Pages (production) |
| `npm run deploy:preview` | Build + deploy to preview environment |

## Content Pipeline

1. MDX files live in `blogs/` with YAML frontmatter (`title`, `slug`, `logo`, `description`, `tags`, `date`)
2. Astro content collections load them via glob loader (`src/content.config.ts`)
3. Slug is derived from filename (strip numeric prefix) or explicit `slug` field
4. Pages generated statically at build time

## Interactive Islands

Only two SolidJS components hydrate client-side:

- **ThemeToggle** — dark/light mode toggle, persists to localStorage
- **MobileMenu** — responsive hamburger navigation

Everything else is static Astro — zero JS shipped for non-interactive content.

## Deployment

Static output to `dist/`, deployed to Cloudflare Pages via wrangler.

| Command | Target |
|---------|--------|
| `npm run deploy` | Production (`blog` project) |
| `npm run deploy:preview` | Preview (`blog-astro-preview` project) |

Dev server runs at `https://blog.local:4321` (requires `::1 blog.local` in hosts file + local certs in `.certs/`).

## Feature Tracking

New features are planned in `docs/feature/[feature-name]/`. See [feature/README.md](feature/README.md).
