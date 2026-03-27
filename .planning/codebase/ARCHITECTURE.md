# Architecture

**Analysis Date:** 2026-03-27

## Pattern Overview

**Overall:** Content-driven static site generation with Next.js App Router, MDX content integration, and Cloudflare Pages deployment.

**Key Characteristics:**
- **Build-time blog rendering**: Blog content is generated at build time from MDX files into a static manifest
- **Static site generation (SSG)**: All routes precompiled and deployed as static assets
- **Content-first architecture**: Blog posts are the primary content model; data flows from MDX → manifest → pages
- **Hybrid deployment**: Optimized for Cloudflare Pages with fallback for Next.js hosting
- **SEO-first design**: Schema markup, sitemap generation, and metadata management baked into all pages

## Layers

**Presentation Layer (Pages & Components):**
- Purpose: Render user-facing content and handle routing
- Location: `src/app/`, `src/components/`
- Contains: Next.js App Router page files, UI components, layout wrappers
- Depends on: Library functions (blogs.ts, json-ld.ts), config, types
- Used by: Next.js router and browser

**Component Library:**
- Purpose: Reusable React components organized by feature
- Location: `src/components/`
- Contains: UI primitives (Radix UI wrapped), blog-specific components, layout components
- Depends on: Tailwind CSS, Radix UI, lucide-react icons
- Used by: Page components and other components

**Business Logic & Data Access Layer:**
- Purpose: Blog retrieval, transformation, and metadata generation
- Location: `src/lib/blogs.ts`, `src/lib/json-ld.ts`, `src/lib/img.ts`
- Contains: Blog query functions, date formatting, SEO markup generation, image URL transformation
- Depends on: Blog manifest, types, site config
- Used by: Page files and components

**Data Layer (Static Manifest):**
- Purpose: Holds all blog metadata; auto-generated at build time
- Location: `src/data/blog-manifest.ts` (auto-generated), `blogs/` directory (MDX sources)
- Contains: Blog manifest (slug, title, date, tags), MDX content files
- Depends on: MDX files in `blogs/` directory
- Used by: Library functions and page generation

**Configuration Layer:**
- Purpose: Centralized site-wide configuration
- Location: `src/config/site.ts`
- Contains: Site name, description, navigation, social links, author info
- Depends on: Nothing
- Used by: Pages, components, and JSON-LD generation

**Type Definitions:**
- Purpose: TypeScript type contracts
- Location: `src/types/`
- Contains: BlogPost, BlogMeta, Certification types
- Depends on: Nothing
- Used by: All layers for type safety

## Data Flow

**Blog Post Rendering Flow:**

1. **Build Time (Pre-rendered)**
   - `scripts/generate-blog-manifest.mjs` scans `blogs/` directory for `.mdx` files
   - Extracts frontmatter metadata (title, date, tags, logo) from each MDX file
   - Generates `src/data/blog-manifest.ts` with mapping of slugs to file paths and metadata
   - Next.js compiles MDX files with `@next/mdx` loader

2. **Static Generation**
   - `src/app/blogs/[slug]/page.tsx` calls `generateStaticParams()` using blog manifest
   - Next.js pre-renders all blog pages at build time
   - Dynamic imports load compiled MDX components: `import('@/blogs/{slug}.mdx')`
   - Metadata extracted from manifest and passed to page component

3. **Request Time (Production)**
   - User requests `/blogs/{slug}`
   - Pre-compiled HTML returned from cache (Cloudflare or static host)
   - No runtime compilation; all content is static

**Blog Listing Flow:**

1. `getAllBlogs()` in `src/lib/blogs.ts` reads blog manifest
2. `formatBlogForDisplay()` transforms BlogMeta to BlogPost (parses date string, formats for display)
3. `BlogGrid` component receives array of BlogPost objects
4. `BlogCard` renders individual blog metadata with image and link

**Image Optimization Flow:**

1. Development: Uses Next.js default image loader (`/_next/image`)
2. Production: Uses Cloudflare Images with custom loader (`/cdn-cgi/image/...`)
3. `image-loader.ts` delegates to `src/lib/img.ts` which routes based on `NODE_ENV`
4. All image refs use `next/image` with responsive `sizes` prop

**SEO Metadata Flow:**

1. Page-level metadata: `generateMetadata()` in page components fetches blog data and returns Metadata object
2. JSON-LD markup: `personJsonLd()` and `generateBlogJsonLd()` generate schema.org markup
3. Sitemap: `src/app/(seo)/sitemap.ts` generates dynamic sitemap from blog manifest

## State Management

**No runtime state management.** All state is:
- **Static**: Blog content and metadata are immutable at request time
- **Configuration-driven**: Site config is a constant object
- **Client state**: Only used in client components for UI (Header mobile menu state, theme toggle)

**Client-side state examples:**
- Header `open` state (Sheet menu) in `src/components/layout/Header.tsx`
- Theme preference in `ThemeProvider` (persisted to localStorage via `next-themes`)
- Mobile breakpoint detection in `useIsMobile()` hook

## Key Abstractions

**BlogPost / BlogMeta Types:**
- Purpose: Separate display-ready (BlogPost) from build-time metadata (BlogMeta)
- Examples: `src/types/blog.ts`
- Pattern: Type composition with Omit<> for variants

**Component as Props Pattern:**
- Purpose: Flexible component composition
- Examples: `BlogGrid` accepts array of posts and renders BlogCard for each
- Pattern: Presentational components receive data and render

**MDX Components Registry:**
- Purpose: Global override of MDX output (headings, links, code blocks)
- Examples: `mdx-components.tsx`
- Pattern: Function returns object mapping HTML elements to React components

**Route Groups:**
- Purpose: Organize routes without affecting URL structure
- Examples: `src/app/(seo)/` contains sitemap and llms.txt that don't appear in routes
- Pattern: Directory names in parentheses are grouped but not included in paths

## Entry Points

**Root Layout:**
- Location: `src/app/layout.tsx`
- Triggers: Every request (HTML/CSS/JS imports)
- Responsibilities: Setup fonts, theme provider, header/footer layout, CSS globals

**Home Page:**
- Location: `src/app/page.tsx`
- Triggers: GET `/`
- Responsibilities: Render hero section, show 3 latest blog posts, add JSON-LD Person schema

**Blogs List Page:**
- Location: `src/app/blogs/page.tsx`
- Triggers: GET `/blogs`
- Responsibilities: Fetch all blogs, render in grid, add appropriate metadata

**Blog Detail Page:**
- Location: `src/app/blogs/[slug]/page.tsx`
- Triggers: GET `/blogs/{slug}`
- Responsibilities: Load MDX component, fetch metadata, render post with metadata, add JSON-LD BlogPosting schema, generate static params

**SEO Routes:**
- Location: `src/app/(seo)/sitemap.ts`, `src/app/(seo)/llms.txt/route.ts`
- Triggers: GET `/sitemap.xml`, GET `/llms.txt`
- Responsibilities: Generate dynamic sitemap, provide LLM metadata

**About Page:**
- Location: `src/app/about/page.tsx`
- Triggers: GET `/about`
- Responsibilities: Render hero section (reuses HeroSection component)

## Error Handling

**Strategy:** Fail fast at build time; serve precompiled content at runtime.

**Patterns:**

- **Build-time validation**: `getBlogMeta()` in `src/app/blogs/[slug]/page.tsx` throws if blog not found during static generation (prevents bad slugs from being built)
- **Metadata parsing**: `parseDate()` in `src/lib/blogs.ts` manually parses date string; throws if malformed
- **Dynamic imports**: MDX files imported dynamically; Next.js handles 404 if file missing
- **No error page**: Architecture assumes all content exists at build time (static site); no need for error boundaries or fallbacks

## Cross-Cutting Concerns

**Logging:** Console-only in components; no centralized logging infrastructure.

**Validation:**
- Type checking via TypeScript at build time
- Date format validation in `parseDate()`
- MDX frontmatter extraction validated in build script

**Authentication:** None. Static site; no protected routes or user state.

**Theme Management:**
- `next-themes` library handles dark/light mode toggle
- `ThemeProvider` component wraps layout
- Theme preference persisted to localStorage
- Applied via CSS class on `<html>` element

**Image Handling:**
- Responsive via `sizes` prop on `next/image`
- Format negotiation: AVIF first, WebP fallback (modern browsers)
- Cloudflare Images for production optimization
- Custom loader in `image-loader.ts`

---

*Architecture analysis: 2026-03-27*
