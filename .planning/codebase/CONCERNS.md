# Codebase Concerns

**Analysis Date:** 2026-03-27

## Tech Debt

**Dynamic MDX Import Without Validation:**
- Issue: Blog posts are loaded via dynamic import based on user-provided slug without comprehensive validation
- Files: `src/app/blogs/[slug]/page.tsx` (line 12)
- Impact: If a blog slug doesn't exist in the manifest, the import fails and Next.js will raise an error. No graceful error page or fallback. Users see default Next.js error page instead of custom 404.
- Fix approach: Implement a custom error boundary or error.tsx file. Pre-validate slug against blogSlugToPath before attempting import. Consider implementing getStaticProps-style validation during build time with fallback for mismatches.

**Unhandled Error in Blog Lookup:**
- Issue: `getBlogMeta()` throws raw Error with minimal context if slug not found
- Files: `src/app/blogs/[slug]/page.tsx` (lines 15-21)
- Impact: Error is thrown but not caught. User sees error page without structured error handling. Error message could expose internal file paths.
- Fix approach: Wrap in try-catch or use Next.js error.tsx file. Return structured error response. Consider using notFound() from next/navigation to trigger proper 404 handling.

**Missing Error Boundary for Blog Page:**
- Issue: No error.tsx file exists for dynamic blog routes
- Files: `src/app/blogs/[slug]/` missing error.tsx
- Impact: Unhandled errors in getBlogPost() or getBlogMeta() will show generic Next.js error page rather than custom error UI
- Fix approach: Create `src/app/blogs/[slug]/error.tsx` component to handle and display errors gracefully

## Security Considerations

**dangerouslySetInnerHTML Usage in JSON-LD:**
- Risk: JSON-LD is injected via dangerouslySetInnerHTML, but this is safe since it's generated from trusted config/types only, not user input
- Files: `src/app/page.tsx` (line 24), `src/app/blogs/[slug]/page.tsx` (line 70)
- Current mitigation: JSON.stringify ensures valid JSON structure; values come from controlled metadata (siteConfig, blogManifest) not external input
- Recommendations: Continue this pattern but document that JSON-LD sources must remain under dev control. Consider adding a comment explaining why dangerouslySetInnerHTML is safe here.

**Link Target Blank Without Security Headers:**
- Risk: All MDX links open in new tabs without rel="noopener noreferrer"
- Files: `mdx-components.tsx` (lines 56-63)
- Current mitigation: None
- Recommendations: Add `rel="noopener noreferrer"` to external links in MDX components to prevent window.opener access from opened page

**Clipboard Write Error Silently Logged:**
- Risk: Copy-to-clipboard errors are only logged to console, not shown to user
- Files: `src/components/ui/shadcn-io/copy-button/index.tsx` (lines 94-96)
- Current mitigation: Error caught and logged
- Recommendations: Show user-facing toast/notification on copy failure. HTTPS requirement for clipboard.writeText means it fails silently in mixed-content scenarios.

## Performance Bottlenecks

**Blog Manifest Regenerated on Every Build:**
- Problem: The entire blog manifest is regenerated from MDX files during `npm run build` via prebuild script
- Files: `scripts/generate-blog-manifest.mjs`, `package.json` (line 7)
- Cause: blogSlugToPath is hard-coded in TypeScript and must be updated when blogs change
- Improvement path: Consider incremental manifest updates. For large blogs (100+ posts), this becomes slow. Current approach requires full regeneration even for one blog addition.

**Image Loading in Development vs Production:**
- Problem: Two different image optimization paths (Next.js built-in vs Cloudflare Images) may cause different behavior
- Files: `next.config.ts` (lines 14-33), `image-loader.ts`
- Cause: Development uses Next.js default optimization; production uses Cloudflare CDN
- Improvement path: Test image loading parity between environments. Ensure Cloudflare Image transformation format matches expected output dimensions.

**Blog Page Re-renders on Route Change:**
- Problem: Each blog page dynamically imports MDX which isn't cached across navigation
- Files: `src/app/blogs/[slug]/page.tsx` (line 12)
- Cause: Dynamic import happens on every page render, no caching strategy
- Improvement path: Consider static generation where possible. For dynamic blogs, implement ISR (Incremental Static Regeneration) or edge caching.

## Fragile Areas

**Blog Manifest Out of Sync Risk:**
- Files: `src/data/blog-manifest.ts`, `blogs/` directory
- Why fragile: Manifest is auto-generated but hand-edited MDX files have no validation. If a blog is added without running `npm run generate-manifest`, it won't appear. If manifest is manually edited, it can reference non-existent blogs.
- Safe modification: Always run `npm run generate-manifest` after adding/removing blog files. Never manually edit blog-manifest.ts. Add pre-commit hook to validate manifest matches filesystem.
- Test coverage: No tests verify that all blog files are included in manifest, or that all manifest entries exist on disk.

**Date Parsing Fragile Format:**
- Files: `src/lib/blogs.ts` (lines 4-6)
- Why fragile: Date format is hardcoded as "DD.MM.YYYY" (line 5). If any blog uses different format, parseDate silently produces wrong date. No validation that date is valid.
- Safe modification: Add date validation after parsing. Document date format requirement in blog template/guide. Consider using a date library like date-fns for robust parsing.
- Test coverage: No tests for parseDate with edge cases (invalid day/month, mismatched formats)

**Hard-Coded Anchor Generation:**
- Files: `mdx-components.tsx` (line 7)
- Why fragile: Anchor IDs generated by simple toLowerCase + replace(/\s/g, '-'). Doesn't handle special characters, unicode, or duplicate headings. Can produce invalid HTML IDs or broken anchor links.
- Safe modification: Use slug library or HTML sanitization to generate valid IDs. Handle duplicate headings by appending -2, -3, etc. Test with non-ASCII content.
- Test coverage: No tests for heading anchor generation with edge cases

**Blog Loading Assumes Valid Slug Mapping:**
- Files: `src/app/blogs/[slug]/page.tsx` (line 4)
- Why fragile: blogSlugToPath is imported as fact but if manifest generation failed, it could be empty or stale. No runtime validation that import path exists before attempting import.
- Safe modification: Add try-catch around import. Fall back to notFound() if import fails. Validate blogSlugToPath is not empty at build time.
- Test coverage: No test for missing blog files

**Component Width Not Constrained in Code Block:**
- Files: `src/components/code-block.tsx` (line 42)
- Why fragile: Code block doesn't set max-width, can overflow on small screens. Long lines force horizontal scroll but SyntaxHighlighter might not handle word-break correctly.
- Safe modification: Add CSS to limit code block width and handle overflow. Test with 80+ character lines on mobile.
- Test coverage: No visual regression tests for code blocks on mobile

## Scaling Limits

**Blog Manifest Linear Search:**
- Current capacity: Works fine for <100 blogs
- Limit: At 1000+ blogs, the getAllBlogs() -> array.find() pattern becomes O(n)
- Scaling path: For large blog counts, consider indexing by slug in a Map structure. Current: `blogManifest.find(b => b.slug === slug)` in `src/lib/blogs.ts` line 17

**Single TypeScript Compilation:**
- Current capacity: ~500 lines of TypeScript currently
- Limit: As codebase grows, single tsconfig.json may not support modular compilation strategies
- Scaling path: Consider splitting into app, lib, components layers with separate tsconfigs if exceeding 5000 lines

## Dependencies at Risk

**next-themes Not Actively Maintained:**
- Risk: Package at v0.4.6 (released 2024). Upstream theme detection might lag Next.js updates
- Impact: System theme detection could break with Next.js major version updates
- Migration plan: Monitor theme provider compatibility. Have fallback to default theme if detection fails. Consider lighter alternative like next-light-dark if issues arise.

**react-syntax-highlighter Large Bundle:**
- Risk: Popular but bulky syntax highlighting library. Used for code block rendering.
- Impact: Increases client-side bundle size. Check if alternative like shiki is lighter.
- Migration plan: If bundle size becomes concern, evaluate shiki or prism-light alternatives. Currently acceptable for content site.

**MDX Compilation in Build Script:**
- Risk: @mdx-js/mdx is used in generate-blog-manifest.mjs but if MDX spec changes, script could break
- Impact: Blog generation pipeline breaks, site can't build
- Migration plan: Keep MDX version pinned. Test on major version updates before upgrading. Consider pre-compiled blog HTML as fallback.

## Test Coverage Gaps

**No Tests for Blog Loading:**
- What's not tested: Dynamic import of MDX files, slug validation, 404 cases
- Files: `src/app/blogs/[slug]/page.tsx`
- Risk: Broken blog links go unnoticed until user reports. New blog format could break silently.
- Priority: High - blog content is core feature

**No Tests for Blog Manifest Generation:**
- What's not tested: Script that parses MDX, extracts metadata, generates manifest
- Files: `scripts/generate-blog-manifest.mjs`
- Risk: Manifest generation errors not caught until build time. Malformed MDX breaks build.
- Priority: High - blocks deployment

**No Tests for Date Parsing:**
- What's not tested: parseDate() with invalid formats, edge dates, timezone handling
- Files: `src/lib/blogs.ts` (lines 4-6)
- Risk: Invalid dates silently become wrong dates in blog list (Jan 1 1970 if parsing fails)
- Priority: Medium

**No Tests for Component Rendering:**
- What's not tested: MDX components (code blocks, headings, tables) with edge cases
- Files: `mdx-components.tsx`, `src/components/code-block.tsx`
- Risk: Malformed markdown could break page layout or not render properly
- Priority: Medium

**No Integration Tests:**
- What's not tested: Full blog page rendering with real MDX file
- Files: `src/app/blogs/[slug]/page.tsx`
- Risk: Component integration issues not caught (e.g., image optimization failing, theme switching)
- Priority: Medium

## Missing Critical Features

**No 404 Page for Missing Blogs:**
- Problem: User navigates to /blogs/invalid-slug gets Next.js error page instead of custom 404
- Blocks: Custom error handling, proper HTTP status codes
- Recommendation: Create `src/app/blogs/[slug]/error.tsx` or use notFound() middleware

**No Blog Search:**
- Problem: Users can't search blog content or filter by tags
- Blocks: Content discoverability on large blog lists
- Recommendation: Add search feature (client-side or full-text index) if blog count exceeds 20

**No Sitemap Generation:**
- Problem: While /sitemap.ts exists, it may not include all dynamic routes properly
- Blocks: SEO optimization, search engine crawling of all blogs
- Recommendation: Verify sitemap includes all blog slugs from manifest

**No Build-Time Validation:**
- Problem: Invalid blog metadata isn't caught until runtime
- Blocks: Type safety for blog frontmatter
- Recommendation: Add Zod/runtime schema validation in generate-blog-manifest.mjs

---

*Concerns audit: 2026-03-27*
