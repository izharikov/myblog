<!-- GSD:project-start source:PROJECT.md -->
## Project

**Blog Migration: Next.js → Astro + SolidJS**

A full rewrite of an existing personal tech blog from Next.js + React to Astro + SolidJS. The blog serves MDX-based articles with syntax highlighting, SEO metadata, dark mode, and is deployed on Cloudflare. The migration aims to reduce bundle size and improve site performance by leveraging Astro's static-first architecture with SolidJS only for interactive components.

**Core Value:** Ship a faster, leaner blog that preserves all existing content and features while moving to a modern Astro + SolidJS stack.

### Constraints

- **Content preservation**: All existing MDX blog posts must work without content file modifications
- **URL parity**: All existing routes must be preserved (no broken links)
- **Deployment target**: Must remain on Cloudflare (Pages or Workers)
- **Styling**: Keep Tailwind CSS v4 — no style framework change
- **SolidJS scope**: Only for interactive components; static content rendered by Astro
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

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
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Naming Patterns
- Components: PascalCase with `.tsx` extension: `BlogCard.tsx`, `HeroSection.tsx`
- Utilities/functions: camelCase with `.ts` extension: `use-mobile.ts`, `blogs.ts`
- UI components: lowercase with hyphens for compound names: `code-block.tsx`, `heading-with-anchor.tsx`
- Type definitions: camelCase with `.ts` extension: `blog.ts`, `certification.ts`
- Config files: camelCase with `.ts` extension: `site.ts`
- React components: PascalCase: `BlogCard`, `HeroSection`, `CodeBlock`
- Custom hooks: camelCase with `use` prefix: `useIsMobile`, `useTheme`
- Utility functions: camelCase: `getAllBlogs`, `getLatestBlogs`, `parseDate`, `formatDate`
- Exported function names: Use `export function` or named exports for clarity
- Private/internal functions: camelCase, no special prefix
- Constants: PascalCase if exported (e.g., `MOBILE_BREAKPOINT`), camelCase if local
- React state: camelCase: `isMobile`, `mounted`, `theme`, `systemTheme`
- Component props: PascalCase for interface names: `BlogCardProps`, `CodeBlockProps`
- Config objects: camelCase: `siteConfig`, `buttonVariants`
- Interfaces: PascalCase: `BlogPost`, `BlogMeta`, `CodeBlockProps`, `BlogCardProps`
- Type aliases: PascalCase: `ClassValue`
- Generic parameters: Single uppercase letter or descriptive: `T`, `P`
- Omit/utility types: Standard TypeScript naming: `Omit<BlogPost, 'dateDisplay' | 'date'>`
## Code Style
- No explicit formatter configured (uses Next.js defaults)
- Line length: No strict limit observed, pragmatic wrapping
- Indentation: 2 spaces (observed in all files)
- Semicolons: Inconsistent - some files use, some don't (common in modern TypeScript)
- Quotes: Mix of single and double quotes observed
- Tool: ESLint with `next/core-web-vitals` and `next/typescript` configurations
- Config file: `eslint.config.mjs`
- Run command: `npm run lint` (maps to `next lint`)
- No custom rules defined beyond Next.js defaults
- Focus on performance and TypeScript best practices
## Import Organization
- `@/*`: Maps to `./src/*` - used for all internal imports
- `@/blogs/*`: Maps to `./blogs/*` - used for blog content
- These are defined in `tsconfig.json` and enabled via `moduleResolution: "bundler"`
## Error Handling
- Try-catch blocks: Not extensively used in component code
- Error boundaries: Not implemented (no error handling visible)
- Input validation: Limited - mostly relies on TypeScript types
- Graceful degradation: Example in `code-block.tsx` - renders fallback before hydration:
- API errors: Not visible in codebase (static site)
- Warnings: JSDoc comments used for developer clarity (e.g., `// Do not edit manually`)
## Logging
- Minimal logging observed in production code
- Comments used instead of debug logs
- No structured logging or logging library detected
- Build-time logging only: seen in generation scripts
## Comments
- JSDoc blocks: Used for exported functions with clear purpose and parameters
- Inline comments: Sparingly used, only for non-obvious logic
- File-level comments: Used to mark auto-generated files: `// This file is auto-generated at build time`
- Commented-out code: Present in some files (e.g., `heading-with-anchor.tsx` has commented sections)
- Applied to utility functions: `/** Get all blog posts from the static manifest */`
- Applied to exports: `export function getAllBlogs(): BlogPost[]`
- Not consistently used across all functions
- Parameters sometimes documented in comments
- Return types documented in JSDoc blocks
## Function Design
- Small to medium functions preferred
- Largest observed: ~50 lines (`src/lib/blogs.ts` functions are 5-15 lines each)
- Complex UI components: 70-140 lines (e.g., `code-block.tsx`, `navigation-menu.tsx`)
- Single object parameter for complex functions: `{ post }: BlogCardProps`
- Destructuring used in function signatures: `({ post }: BlogCardProps) => ...`
- Props interface always defined separately: `interface BlogCardProps { post: BlogPost; }`
- Explicit return types: `getAllBlogs(): BlogPost[]`
- JSX components return React elements implicitly
- Utility functions have clear return types in signatures
- Arrow functions: Used frequently for components and simple utilities
- Named functions: `export function` pattern used for major exports
## Module Design
- Named exports preferred: `export function getAllBlogs()`, `export const siteConfig`
- Named exports used in barrel files (e.g., `components/ui/card.tsx` exports multiple component functions)
- Mixed: Some files use both default and named exports (uncommon, prefer named)
- Component files export single component (with variants like `buttonVariants`)
- Used in `src/components/ui/` for component aggregation
- `src/components/icons/index.tsx` likely exports multiple icon components
- Reduces import depth and improves organizational clarity
## TypeScript Patterns
- All TypeScript strict compiler options active
- `noEmit: true` - Type checking only, no output files
- `isolatedModules: true` - Each file is independently compilable
- Functional components with TypeScript: `React.ComponentProps<"div">` for HTML element props
- Type-safe component props: Always define interfaces
- Use of generics: `VariantProps<typeof buttonVariants>` from CVA (class-variance-authority)
- Map/filter/reduce used for collections: `blogManifest.map(formatBlogForDisplay)`
- Immutable patterns: No mutation observed, functional transformations preferred
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## Pattern Overview
- **Build-time blog rendering**: Blog content is generated at build time from MDX files into a static manifest
- **Static site generation (SSG)**: All routes precompiled and deployed as static assets
- **Content-first architecture**: Blog posts are the primary content model; data flows from MDX → manifest → pages
- **Hybrid deployment**: Optimized for Cloudflare Pages with fallback for Next.js hosting
- **SEO-first design**: Schema markup, sitemap generation, and metadata management baked into all pages
## Layers
- Purpose: Render user-facing content and handle routing
- Location: `src/app/`, `src/components/`
- Contains: Next.js App Router page files, UI components, layout wrappers
- Depends on: Library functions (blogs.ts, json-ld.ts), config, types
- Used by: Next.js router and browser
- Purpose: Reusable React components organized by feature
- Location: `src/components/`
- Contains: UI primitives (Radix UI wrapped), blog-specific components, layout components
- Depends on: Tailwind CSS, Radix UI, lucide-react icons
- Used by: Page components and other components
- Purpose: Blog retrieval, transformation, and metadata generation
- Location: `src/lib/blogs.ts`, `src/lib/json-ld.ts`, `src/lib/img.ts`
- Contains: Blog query functions, date formatting, SEO markup generation, image URL transformation
- Depends on: Blog manifest, types, site config
- Used by: Page files and components
- Purpose: Holds all blog metadata; auto-generated at build time
- Location: `src/data/blog-manifest.ts` (auto-generated), `blogs/` directory (MDX sources)
- Contains: Blog manifest (slug, title, date, tags), MDX content files
- Depends on: MDX files in `blogs/` directory
- Used by: Library functions and page generation
- Purpose: Centralized site-wide configuration
- Location: `src/config/site.ts`
- Contains: Site name, description, navigation, social links, author info
- Depends on: Nothing
- Used by: Pages, components, and JSON-LD generation
- Purpose: TypeScript type contracts
- Location: `src/types/`
- Contains: BlogPost, BlogMeta, Certification types
- Depends on: Nothing
- Used by: All layers for type safety
## Data Flow
## State Management
- **Static**: Blog content and metadata are immutable at request time
- **Configuration-driven**: Site config is a constant object
- **Client state**: Only used in client components for UI (Header mobile menu state, theme toggle)
- Header `open` state (Sheet menu) in `src/components/layout/Header.tsx`
- Theme preference in `ThemeProvider` (persisted to localStorage via `next-themes`)
- Mobile breakpoint detection in `useIsMobile()` hook
## Key Abstractions
- Purpose: Separate display-ready (BlogPost) from build-time metadata (BlogMeta)
- Examples: `src/types/blog.ts`
- Pattern: Type composition with Omit<> for variants
- Purpose: Flexible component composition
- Examples: `BlogGrid` accepts array of posts and renders BlogCard for each
- Pattern: Presentational components receive data and render
- Purpose: Global override of MDX output (headings, links, code blocks)
- Examples: `mdx-components.tsx`
- Pattern: Function returns object mapping HTML elements to React components
- Purpose: Organize routes without affecting URL structure
- Examples: `src/app/(seo)/` contains sitemap and llms.txt that don't appear in routes
- Pattern: Directory names in parentheses are grouped but not included in paths
## Entry Points
- Location: `src/app/layout.tsx`
- Triggers: Every request (HTML/CSS/JS imports)
- Responsibilities: Setup fonts, theme provider, header/footer layout, CSS globals
- Location: `src/app/page.tsx`
- Triggers: GET `/`
- Responsibilities: Render hero section, show 3 latest blog posts, add JSON-LD Person schema
- Location: `src/app/blogs/page.tsx`
- Triggers: GET `/blogs`
- Responsibilities: Fetch all blogs, render in grid, add appropriate metadata
- Location: `src/app/blogs/[slug]/page.tsx`
- Triggers: GET `/blogs/{slug}`
- Responsibilities: Load MDX component, fetch metadata, render post with metadata, add JSON-LD BlogPosting schema, generate static params
- Location: `src/app/(seo)/sitemap.ts`, `src/app/(seo)/llms.txt/route.ts`
- Triggers: GET `/sitemap.xml`, GET `/llms.txt`
- Responsibilities: Generate dynamic sitemap, provide LLM metadata
- Location: `src/app/about/page.tsx`
- Triggers: GET `/about`
- Responsibilities: Render hero section (reuses HeroSection component)
## Error Handling
- **Build-time validation**: `getBlogMeta()` in `src/app/blogs/[slug]/page.tsx` throws if blog not found during static generation (prevents bad slugs from being built)
- **Metadata parsing**: `parseDate()` in `src/lib/blogs.ts` manually parses date string; throws if malformed
- **Dynamic imports**: MDX files imported dynamically; Next.js handles 404 if file missing
- **No error page**: Architecture assumes all content exists at build time (static site); no need for error boundaries or fallbacks
## Cross-Cutting Concerns
- Type checking via TypeScript at build time
- Date format validation in `parseDate()`
- MDX frontmatter extraction validated in build script
- `next-themes` library handles dark/light mode toggle
- `ThemeProvider` component wraps layout
- Theme preference persisted to localStorage
- Applied via CSS class on `<html>` element
- Responsive via `sizes` prop on `next/image`
- Format negotiation: AVIF first, WebP fallback (modern browsers)
- Cloudflare Images for production optimization
- Custom loader in `image-loader.ts`
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
