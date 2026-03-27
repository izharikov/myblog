# Technology Stack

**Analysis Date:** 2026-03-27

## Current Stack (being replaced)

- Next.js 16 + React 19 + OpenNext Cloudflare adapter
- See git history for full current dependency list

## Target Stack

### Core

| Package | Version | Role |
|---------|---------|------|
| Astro | 6.1.1 | Static site framework |
| SolidJS | 1.9.12 | Interactive islands only |
| TypeScript | 6.0 | Type checking |
| Node.js | 22+ | Runtime (Astro 6 requirement) |

### Astro Integrations

| Package | Version | Role |
|---------|---------|------|
| @astrojs/solid-js | 6.0.0 | SolidJS island support |
| @astrojs/mdx | 5.0.2 | MDX content support |
| @astrojs/sitemap | 3.7.1 | Auto-generated sitemap |
| @astrojs/cloudflare | 13.x | Cloudflare Pages/Workers deployment |

### Styling

| Package | Version | Role |
|---------|---------|------|
| Tailwind CSS | 4.2.2 | Utility-first CSS |
| @tailwindcss/vite | 4.2.2 | Vite plugin (replaces PostCSS plugin) |
| clsx | 2.x | Conditional CSS classes |
| tailwind-merge | 3.x | Merge Tailwind classes |

### UI Components

| Package | Version | Role |
|---------|---------|------|
| @kobalte/core | 0.13.11 | Accessible SolidJS primitives (Radix equivalent) — evaluate vs hand-rolling |
| lucide-solid | 0.577.0 | Icons (replaces lucide-react) |

### Content & Markdown

| Package | Version | Role |
|---------|---------|------|
| Shiki | built-in (Astro) | Syntax highlighting (replaces react-syntax-highlighter) |
| remark-gfm | 4.x | GitHub Flavored Markdown |

### Animation

| Package | Version | Role |
|---------|---------|------|
| motion (solid) | TBD | Verify `@motionone/solid` or `solid-motionone` — check current package name |

### Dev Tools

| Package | Version | Role |
|---------|---------|------|
| ESLint | 10.1.0 | Code linting |
| Wrangler | 4.x | Cloudflare CLI |
| Vite | 7.x | Bundler (ships with Astro 6) |

### Deployment

| Target | Details |
|--------|---------|
| Cloudflare Pages | Static output via @astrojs/cloudflare 13.x |
| workerd | Runs in dev/preview/prod (Astro 6 first-class support) |
| R2 bucket | No longer needed — pure static site |

## Packages Eliminated by Migration

| Removed | Reason |
|---------|--------|
| next, react, react-dom | Replaced by Astro + SolidJS |
| @next/mdx, @mdx-js/loader, @mdx-js/react, next-mdx-remote | Replaced by @astrojs/mdx |
| react-syntax-highlighter | Replaced by Astro built-in Shiki |
| next-themes | Replaced by inline `<script>` + SolidJS toggle |
| @opennextjs/cloudflare | Replaced by @astrojs/cloudflare |
| @radix-ui/* , shadcn/ui | Replaced by @kobalte/core or hand-rolled |
| lucide-react | Replaced by lucide-solid |
| gray-matter | Replaced by Astro content collections (Zod schema) |
| @tailwindcss/postcss, PostCSS | Replaced by @tailwindcss/vite |
| class-variance-authority | Evaluate if still needed |
| schema-dts | Evaluate if still needed |

---

*Stack analysis: 2026-03-27*
