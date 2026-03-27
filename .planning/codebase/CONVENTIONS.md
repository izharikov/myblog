# Coding Conventions

**Analysis Date:** 2026-03-27

## Naming Patterns

**Files:**
- Components: PascalCase with `.tsx` extension: `BlogCard.tsx`, `HeroSection.tsx`
- Utilities/functions: camelCase with `.ts` extension: `use-mobile.ts`, `blogs.ts`
- UI components: lowercase with hyphens for compound names: `code-block.tsx`, `heading-with-anchor.tsx`
- Type definitions: camelCase with `.ts` extension: `blog.ts`, `certification.ts`
- Config files: camelCase with `.ts` extension: `site.ts`

**Functions:**
- React components: PascalCase: `BlogCard`, `HeroSection`, `CodeBlock`
- Custom hooks: camelCase with `use` prefix: `useIsMobile`, `useTheme`
- Utility functions: camelCase: `getAllBlogs`, `getLatestBlogs`, `parseDate`, `formatDate`
- Exported function names: Use `export function` or named exports for clarity
- Private/internal functions: camelCase, no special prefix

**Variables:**
- Constants: PascalCase if exported (e.g., `MOBILE_BREAKPOINT`), camelCase if local
- React state: camelCase: `isMobile`, `mounted`, `theme`, `systemTheme`
- Component props: PascalCase for interface names: `BlogCardProps`, `CodeBlockProps`
- Config objects: camelCase: `siteConfig`, `buttonVariants`

**Types:**
- Interfaces: PascalCase: `BlogPost`, `BlogMeta`, `CodeBlockProps`, `BlogCardProps`
- Type aliases: PascalCase: `ClassValue`
- Generic parameters: Single uppercase letter or descriptive: `T`, `P`
- Omit/utility types: Standard TypeScript naming: `Omit<BlogPost, 'dateDisplay' | 'date'>`

## Code Style

**Formatting:**
- No explicit formatter configured (uses Next.js defaults)
- Line length: No strict limit observed, pragmatic wrapping
- Indentation: 2 spaces (observed in all files)
- Semicolons: Inconsistent - some files use, some don't (common in modern TypeScript)
- Quotes: Mix of single and double quotes observed

**Linting:**
- Tool: ESLint with `next/core-web-vitals` and `next/typescript` configurations
- Config file: `eslint.config.mjs`
- Run command: `npm run lint` (maps to `next lint`)
- No custom rules defined beyond Next.js defaults
- Focus on performance and TypeScript best practices

## Import Organization

**Order:**
1. React and Node.js built-ins: `import * as React from "react"`
2. Third-party packages: `import Link from 'next/link'`, `import { useTheme } from "next-themes"`
3. Internal components/modules: `import { Card } from "@/components/ui/card"`
4. Type imports: `import { BlogPost } from '@/types/blog'` (mixed with regular imports, not separated)
5. Styles and side effects: `import styles from...` (if used)

**Path Aliases:**
- `@/*`: Maps to `./src/*` - used for all internal imports
- `@/blogs/*`: Maps to `./blogs/*` - used for blog content
- These are defined in `tsconfig.json` and enabled via `moduleResolution: "bundler"`

**Example from codebase:**
```typescript
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BlogPost } from '@/types/blog';
```

## Error Handling

**Patterns:**
- Try-catch blocks: Not extensively used in component code
- Error boundaries: Not implemented (no error handling visible)
- Input validation: Limited - mostly relies on TypeScript types
- Graceful degradation: Example in `code-block.tsx` - renders fallback before hydration:
  ```typescript
  if (!mounted) {
      return (
          <pre className="bg-muted text-primary mb-4 mt-6 overflow-x-auto rounded-lg border p-4">
              <code className={className}>{children}</code>
          </pre>
      )
  }
  ```
- API errors: Not visible in codebase (static site)
- Warnings: JSDoc comments used for developer clarity (e.g., `// Do not edit manually`)

## Logging

**Framework:** `console` (standard JavaScript)

**Patterns:**
- Minimal logging observed in production code
- Comments used instead of debug logs
- No structured logging or logging library detected
- Build-time logging only: seen in generation scripts

## Comments

**When to Comment:**
- JSDoc blocks: Used for exported functions with clear purpose and parameters
- Inline comments: Sparingly used, only for non-obvious logic
- File-level comments: Used to mark auto-generated files: `// This file is auto-generated at build time`
- Commented-out code: Present in some files (e.g., `heading-with-anchor.tsx` has commented sections)

**JSDoc/TSDoc:**
- Applied to utility functions: `/** Get all blog posts from the static manifest */`
- Applied to exports: `export function getAllBlogs(): BlogPost[]`
- Not consistently used across all functions
- Parameters sometimes documented in comments
- Return types documented in JSDoc blocks

**Example from `src/lib/blogs.ts`:**
```typescript
/**
 * Transform blog post for display in BlogCard
 */
function formatBlogForDisplay(blog: BlogMeta): BlogPost {
    ...
}

/**
 * Get all blog posts from the static manifest
 * This is build-time safe and works in Cloudflare Pages
 */
export function getAllBlogs(): BlogPost[] {
    ...
}
```

## Function Design

**Size:**
- Small to medium functions preferred
- Largest observed: ~50 lines (`src/lib/blogs.ts` functions are 5-15 lines each)
- Complex UI components: 70-140 lines (e.g., `code-block.tsx`, `navigation-menu.tsx`)

**Parameters:**
- Single object parameter for complex functions: `{ post }: BlogCardProps`
- Destructuring used in function signatures: `({ post }: BlogCardProps) => ...`
- Props interface always defined separately: `interface BlogCardProps { post: BlogPost; }`

**Return Values:**
- Explicit return types: `getAllBlogs(): BlogPost[]`
- JSX components return React elements implicitly
- Utility functions have clear return types in signatures
- Arrow functions: Used frequently for components and simple utilities
- Named functions: `export function` pattern used for major exports

## Module Design

**Exports:**
- Named exports preferred: `export function getAllBlogs()`, `export const siteConfig`
- Named exports used in barrel files (e.g., `components/ui/card.tsx` exports multiple component functions)
- Mixed: Some files use both default and named exports (uncommon, prefer named)
- Component files export single component (with variants like `buttonVariants`)

**Example from `src/components/ui/card.tsx`:**
```typescript
function Card({ className, ...props }: React.ComponentProps<"div">) {
  // ...
}

// ... other CardX functions

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
```

**Barrel Files:**
- Used in `src/components/ui/` for component aggregation
- `src/components/icons/index.tsx` likely exports multiple icon components
- Reduces import depth and improves organizational clarity

## TypeScript Patterns

**Strict Mode:** Enabled
- All TypeScript strict compiler options active
- `noEmit: true` - Type checking only, no output files
- `isolatedModules: true` - Each file is independently compilable

**React-Specific:**
- Functional components with TypeScript: `React.ComponentProps<"div">` for HTML element props
- Type-safe component props: Always define interfaces
- Use of generics: `VariantProps<typeof buttonVariants>` from CVA (class-variance-authority)

**Data Transformation:**
- Map/filter/reduce used for collections: `blogManifest.map(formatBlogForDisplay)`
- Immutable patterns: No mutation observed, functional transformations preferred

---

*Convention analysis: 2026-03-27*
