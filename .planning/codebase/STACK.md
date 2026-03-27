# Technology Stack

**Analysis Date:** 2026-03-27

## Languages

**Primary:**
- TypeScript ^5 - Application code, components, utilities
- JavaScript (ES2024) - Build scripts and configuration
- JSX/TSX - React components and pages

**Secondary:**
- MDX 3.x - Blog content files with embedded React components
- CSS - Styling (via PostCSS and Tailwind)

## Runtime

**Environment:**
- Node.js (maintained versions as per browserslist)

**Package Manager:**
- npm
- Lockfile: Present (`package-lock.json`)

## Frameworks

**Core:**
- Next.js ^16.0.7 - Full-stack React framework
  - App Router (file-based routing)
  - Server-side rendering and static generation
  - MDX page support via `@next/mdx`
  - Image optimization with custom loader for Cloudflare

**UI & Components:**
- React 19.1.2 - UI library
- React DOM 19.1.2 - DOM rendering
- Radix UI components:
  - `@radix-ui/react-dialog` ^1.1.15
  - `@radix-ui/react-dropdown-menu` ^2.1.16
  - `@radix-ui/react-navigation-menu` ^1.2.14
  - `@radix-ui/react-separator` ^1.1.8
  - `@radix-ui/react-slot` ^1.2.4
- shadcn/ui - Component library built on Radix UI

**Styling:**
- Tailwind CSS ^4 - Utility-first CSS framework
- @tailwindcss/postcss ^4 - PostCSS plugin for Tailwind
- PostCSS - CSS transformation
- class-variance-authority ^0.7.1 - Component style composition
- clsx ^2.1.1 - Conditional CSS class utility
- tailwind-merge ^3.4.0 - Merge Tailwind CSS classes

**Animation:**
- motion ^12.23.26 - Motion library for animations

**Icons:**
- lucide-react ^0.555.0 - Icon library

**Markdown:**
- @mdx-js/loader ^3.1.1 - MDX loader for webpack
- @mdx-js/react ^3.1.1 - MDX React components
- @next/mdx ^16.0.7 - Next.js MDX plugin
- next-mdx-remote ^6.0.0 - MDX serialization and rendering
- gray-matter ^4.0.3 - Parse YAML/TOML front matter from markdown
- remark-gfm ^4.0.1 - GitHub Flavored Markdown plugin
- react-syntax-highlighter ^16.1.0 - Syntax highlighting for code blocks

**SEO & Structured Data:**
- schema-dts ^1.1.5 - TypeScript definitions for Schema.org
- next-themes ^0.4.6 - Theme provider for dark mode support

**Theme Management:**
- next-themes ^0.4.6 - Light/dark mode management via class attribute

**Dev Tools:**
- TypeScript ^5 - Type checking
- ESLint ^9 - Code linting
- @eslint/eslintrc ^3 - ESLint configuration utilities
- eslint-config-next 15.4.6 - Next.js ESLint rules
- Wrangler ^4.53.0 - Cloudflare Workers CLI

**Build/Dev:**
- Turbopack - Used in dev server (`next dev --turbopack`)
- Cloudflare Workers tooling - Deployment target

## Key Dependencies

**Critical:**
- Next.js ^16.0.7 - Core framework handling routing, SSR, static generation, image optimization
- React 19.1.2 - Component library and rendering
- Tailwind CSS ^4 - Styling system
- MDX (via @mdx-js and @next/mdx) - Blog content transformation and rendering

**Infrastructure:**
- @opennextjs/cloudflare ^1.14.2 - OpenNext adapter for Cloudflare Workers deployment
  - Enables running Next.js on Cloudflare Workers and Pages
- Wrangler ^4.53.0 - Cloudflare development and deployment CLI

**Content Processing:**
- gray-matter ^4.0.3 - Extracts metadata (frontmatter) from MDX files
- remark-gfm ^4.0.1 - Markdown processing with GitHub extensions
- react-syntax-highlighter ^16.1.0 - Code block syntax highlighting

## Configuration

**Environment:**
- Development and production configurations in `next.config.ts`
- No explicit .env file required for basic functionality (Cloudflare bindings configured in wrangler.jsonc)
- Image loader configured for development vs production (custom Cloudflare loader in production)

**Build:**
- TypeScript config: `tsconfig.json`
  - Target: ES2024
  - Module: esnext with bundler resolution
  - Path aliases: `@/*` → `./src/*`, `@/blogs/*` → `./blogs/*`
- PostCSS config: `postcss.config.mjs`
  - Tailwind CSS plugin enabled
- ESLint config: `eslint.config.mjs`
  - Extends: next/core-web-vitals, next/typescript
- MDX config in `next.config.ts`
  - remark plugins: GitHub Flavored Markdown with strict mode and error throwing
  - Page extensions: js, jsx, md, mdx, ts, tsx

**Cloudflare:**
- Wrangler config: `wrangler.jsonc`
  - Compatibility date: 2025-03-01
  - Compatibility flags: nodejs_compat, global_fetch_strictly_public
  - Observability: enabled
  - R2 bucket binding: NEXT_INC_CACHE_R2_BUCKET for incremental cache

## Platform Requirements

**Development:**
- Node.js (maintained versions)
- npm package manager
- Optional: Cloudflare account for preview/deploy

**Production:**
- Cloudflare Workers (via Wrangler and OpenNext adapter)
- Cloudflare R2 bucket for incremental cache storage
- Custom image loader: `image-loader.ts` for Cloudflare image optimization

---

*Stack analysis: 2026-03-27*
