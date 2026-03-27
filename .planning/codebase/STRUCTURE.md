# Codebase Structure

**Analysis Date:** 2026-03-27

## Directory Layout

```
project-root/
├── src/                            # TypeScript/React source code
│   ├── app/                        # Next.js App Router pages and layouts
│   │   ├── (seo)/                  # Route group: SEO metadata generation
│   │   │   ├── llms.txt/           # LLM metadata endpoint
│   │   │   └── sitemap.ts          # Dynamic sitemap generation
│   │   ├── about/                  # About page route
│   │   ├── blogs/                  # Blog listing and detail routes
│   │   │   ├── [slug]/             # Dynamic blog post route
│   │   │   └── page.tsx            # Blog listing page
│   │   ├── layout.tsx              # Root layout (fonts, theme, header/footer)
│   │   ├── page.tsx                # Home page
│   │   └── globals.css             # Global Tailwind CSS directives
│   ├── components/                 # React UI components
│   │   ├── blog/                   # Blog-specific components
│   │   │   ├── BlogCard.tsx        # Individual blog post card
│   │   │   └── BlogGrid.tsx        # Grid layout for blog posts
│   │   ├── home/                   # Home page components
│   │   │   ├── HeroSection.tsx     # Hero section with profile
│   │   │   └── CertificationBadge.tsx # Certification display
│   │   ├── layout/                 # Layout components
│   │   │   ├── Header.tsx          # Navigation header with mobile menu
│   │   │   ├── Footer.tsx          # Footer with links
│   │   │   └── ThemeToggle.tsx     # Dark/light mode toggle
│   │   ├── ui/                     # UI primitives (shadcn/ui)
│   │   │   ├── button.tsx          # Button component
│   │   │   ├── card.tsx            # Card component
│   │   │   ├── badge.tsx           # Badge component
│   │   │   ├── heading-with-anchor.tsx # Heading with anchor link
│   │   │   ├── navigation-menu.tsx # Navigation menu from Radix UI
│   │   │   ├── dropdown-menu.tsx   # Dropdown menu from Radix UI
│   │   │   ├── sheet.tsx           # Sheet (drawer) from Radix UI
│   │   │   ├── separator.tsx       # Separator from Radix UI
│   │   │   ├── img.tsx             # Image wrapper component
│   │   │   ├── shadcn-io/          # Components from shadcn.com
│   │   │   │   └── copy-button/    # Copy to clipboard button
│   │   │   └── ...                 # Other UI components
│   │   ├── code-block.tsx          # Syntax-highlighted code block
│   │   ├── theme-provider.tsx      # next-themes ThemeProvider wrapper
│   │   └── icons/                  # Custom SVG icons
│   ├── config/                     # Configuration files
│   │   └── site.ts                 # Site-wide config (name, nav, social)
│   ├── data/                       # Generated data files
│   │   └── blog-manifest.ts        # Auto-generated blog metadata (do not edit)
│   ├── lib/                        # Utility functions and helpers
│   │   ├── blogs.ts                # Blog query functions (getAllBlogs, getLatestBlogs)
│   │   ├── json-ld.ts              # JSON-LD schema generation
│   │   ├── img.ts                  # Image URL transformation (dev vs prod)
│   │   └── utils.ts                # Helper functions (cn for Tailwind merging)
│   ├── hooks/                      # Custom React hooks
│   │   └── use-mobile.ts           # Hook to detect mobile breakpoint
│   └── types/                      # TypeScript type definitions
│       ├── blog.ts                 # BlogPost, BlogMeta types
│       └── certification.ts        # Certification type
├── blogs/                          # MDX blog post files (source content)
│   ├── 1-xp-precompilation.mdx
│   ├── 3-send-mcp.mdx
│   ├── 3-sitecore-ci-cd.mdx
│   ├── 4-sitecore-ch-dam-exam.mdx
│   ├── ...
│   └── 9-sitecore-marketplace-app-server-side-authentication.mdx
├── public/                         # Static assets served as-is
│   ├── blogs/                      # Blog content downloads
│   ├── images/                     # Blog post images
│   │   ├── 2025/                   # 2025 blog post images organized by topic
│   │   │   ├── ch/
│   │   │   ├── cicd/
│   │   │   ├── send-mcp/
│   │   │   └── ...
│   │   └── 2026/                   # 2026 blog post images
│   ├── favicon.svg
│   └── profile.jpg                 # Author profile image
├── scripts/                        # Build and utility scripts
│   └── generate-blog-manifest.mjs  # Extracts MDX metadata and generates manifest
├── .next/                          # Next.js build output (ignore)
├── .open-next/                     # OpenNext build for Cloudflare (ignore)
├── local/                          # Local development files (wrangler bindings)
├── .planning/                      # GSD codebase documentation
├── .vscode/                        # VS Code settings
├── .wrangler/                      # Wrangler CLI cache
├── mdx-components.tsx              # MDX component registry (global overrides)
├── image-loader.ts                 # Next.js custom image loader for Cloudflare
├── next.config.ts                  # Next.js configuration (MDX, images)
├── open-next.config.ts             # OpenNext configuration for Cloudflare
├── tailwind.config.ts              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
├── postcss.config.mjs              # PostCSS configuration for Tailwind
├── eslint.config.mjs               # ESLint configuration
├── components.json                 # shadcn/ui configuration
├── package.json                    # NPM dependencies and scripts
└── README.md                       # Project documentation
```

## Directory Purposes

**src/app:**
- Purpose: Next.js App Router routes and layouts; defines URL structure
- Contains: Page components (.tsx), layout wrappers, route groups, server actions
- Key files: `layout.tsx` (root layout), `page.tsx` (home), `blogs/[slug]/page.tsx` (blog detail)

**src/components:**
- Purpose: Reusable React UI components organized by feature/domain
- Contains: Presentational components (no business logic), composite components, UI primitives
- Key files: `layout/Header.tsx`, `blog/BlogGrid.tsx`, `ui/*.tsx` (shadcn components)

**src/config:**
- Purpose: Centralized configuration as constants
- Contains: Site name, description, navigation structure, social links, author info
- Key files: `site.ts`

**src/data:**
- Purpose: Generated data files (not hand-edited)
- Contains: Blog manifest with metadata, slug mappings
- Key files: `blog-manifest.ts` (auto-generated by build script)

**src/lib:**
- Purpose: Business logic and utility functions
- Contains: Blog querying, date formatting, schema generation, image URL handling
- Key files: `blogs.ts`, `json-ld.ts`, `img.ts`

**src/hooks:**
- Purpose: Custom React hooks for reusable logic
- Contains: Responsive hooks, state hooks
- Key files: `use-mobile.ts`

**src/types:**
- Purpose: TypeScript type definitions
- Contains: BlogPost, BlogMeta, type unions and interfaces
- Key files: `blog.ts`

**blogs/:**
- Purpose: MDX source files for blog content
- Contains: `.mdx` files with frontmatter metadata and markdown content
- Naming: Numeric prefix for ordering, kebab-case slug (e.g., `1-xp-precompilation.mdx`)
- Auto-scanned by build script; must have metadata export

**public/:**
- Purpose: Static assets served as-is (no processing)
- Contains: Images, favicon, downloadable content
- Committed to git: Yes
- Generated: No (images added manually)

**scripts/:**
- Purpose: Node.js build utilities and automation
- Contains: Blog manifest generation script
- Key files: `generate-blog-manifest.mjs` (runs at prebuild, generates blog-manifest.ts)

## Key File Locations

**Entry Points:**
- `src/app/layout.tsx`: Root layout; loaded for all routes
- `src/app/page.tsx`: Home page route (`/`)
- `src/app/blogs/page.tsx`: Blog listing route (`/blogs`)
- `src/app/blogs/[slug]/page.tsx`: Blog detail route (`/blogs/{slug}`)

**Configuration:**
- `next.config.ts`: Next.js build config (MDX loader, image settings)
- `src/config/site.ts`: Site-wide constants (name, nav, social)
- `package.json`: Dependencies, build scripts
- `tailwind.config.ts`: Tailwind CSS theme and plugins

**Core Logic:**
- `src/lib/blogs.ts`: Blog querying (getAllBlogs, getLatestBlogs)
- `src/lib/json-ld.ts`: SEO schema generation
- `src/app/blogs/[slug]/page.tsx`: Blog post rendering logic, static generation

**Testing:**
- No test files in repository (no testing framework configured)

**Build Artifacts:**
- `src/data/blog-manifest.ts`: Auto-generated at build time from blogs/ directory
- `.next/`: Next.js build output
- `.open-next/`: Cloudflare Pages build output

## Naming Conventions

**Files:**

- **Page routes**: `page.tsx` (Next.js convention; becomes route)
- **Layout files**: `layout.tsx` (Next.js convention; wraps child routes)
- **Components**: PascalCase with `.tsx` extension (e.g., `BlogCard.tsx`, `Header.tsx`)
- **Utility functions**: camelCase with `.ts` extension (e.g., `blogs.ts`, `json-ld.ts`)
- **Config files**: camelCase (e.g., `site.ts`, `next.config.ts`)
- **MDX blog files**: Numeric prefix + kebab-case slug (e.g., `1-xp-precompilation.mdx`)

**Directories:**

- **Feature domains**: kebab-case (e.g., `blog/`, `layout/`, `ui/`)
- **Route groups**: Parentheses syntax (e.g., `(seo)/`) to organize without affecting URLs
- **Nested components**: Subdirectories group related components (e.g., `blog/`, `layout/`)

**TypeScript/React:**

- **Component names**: PascalCase (e.g., `BlogGrid`, `Header`)
- **Function names**: camelCase (e.g., `getAllBlogs`, `formatBlogForDisplay`)
- **Variable names**: camelCase (e.g., `isMobile`, `latestPosts`)
- **Type names**: PascalCase (e.g., `BlogPost`, `BlogMeta`)
- **Props interfaces**: `{ComponentName}Props` (e.g., `BlogGridProps`)

## Where to Add New Code

**New Blog Post:**
1. Create MDX file in `blogs/` with numeric prefix and slug: `{number}-{slug}.mdx`
2. Add metadata export in file: `export const meta = { title, date, tags, ... }`
3. Run `npm run generate-manifest` to regenerate `src/data/blog-manifest.ts`
4. Add cover image to `public/images/{year}/{topic}/logo.png`
5. Push to git; Next.js build will auto-render the post

**New Page/Route:**
1. Create directory in `src/app/{route-name}/`
2. Add `page.tsx` with default export component
3. Optional: Add `layout.tsx` to wrap route-specific layout
4. Next.js handles routing automatically

**New Component:**
1. Determine domain/feature (e.g., layout, blog, ui)
2. Create in `src/components/{domain}/ComponentName.tsx`
3. Use PascalCase name matching export
4. If reusable across many features, consider moving to `ui/` instead

**New Utility/Helper:**
1. Determine function's purpose (blog data, SEO, images, etc.)
2. Add to appropriate file in `src/lib/` or create new file
3. Export function with clear, descriptive name
4. Add JSDoc comment if non-obvious

**New Hook:**
1. Create `src/hooks/useFeatureName.ts` with PascalCase component-like name
2. Follow React Hooks conventions (use* prefix)
3. Export hook as default or named export

**New Type:**
1. Add to appropriate file in `src/types/` (e.g., `blog.ts` for blog-related types)
2. Use PascalCase names
3. Export type, not as default

**Theme/Styling:**
- Use Tailwind classes in component JSX; no inline styles
- Define custom styles in `src/app/globals.css` if needed
- Extend Tailwind config in `tailwind.config.ts` for custom colors/sizes
- Use `cn()` utility from `src/lib/utils.ts` to merge Tailwind classes

**Client vs Server Components:**
- Default to server components (faster, no JS sent to client)
- Use `"use client"` directive only when needed (interactivity, hooks, browser APIs)
- Examples: Header with mobile menu state, ThemeToggle, useIsMobile hook

## Special Directories

**src/app/(seo)/:**
- Purpose: Organize SEO metadata generation routes (sitemap, robots, llms.txt) without polluting URL space
- Generated: Yes (sitemap.ts generates content dynamically)
- Committed: Yes
- Note: Parentheses syntax hides these routes from URL structure

**.next/:**
- Purpose: Next.js build output cache
- Generated: Yes (created by `npm run build`)
- Committed: No (in .gitignore)

**.open-next/:**
- Purpose: Cloudflare Pages build artifacts
- Generated: Yes (created by `opennextjs-cloudflare build`)
- Committed: No (in .gitignore)

**local/:**
- Purpose: Local development files (Wrangler bindings for testing)
- Generated: No (committed to git)
- Committed: Yes
- Note: Contains environment setup for local Cloudflare development

**src/data/**
- Purpose: Auto-generated data from build process
- Generated: Yes (blog-manifest.ts generated by `scripts/generate-blog-manifest.mjs`)
- Committed: Yes (include in git for reproducibility)
- Edit: Never manually; regenerate with `npm run generate-manifest`

---

*Structure analysis: 2026-03-27*
