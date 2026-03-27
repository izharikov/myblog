# Phase 5: Deployment & Validation - Research

**Researched:** 2026-03-28
**Domain:** Cloudflare Pages deployment, Astro static build, performance validation
**Confidence:** HIGH

## Summary

Phase 5 takes a working Astro static site and ships it to a separate Cloudflare Pages test project, then validates it against performance targets. The good news: most of the work is already done. The production build succeeds (`npm run build` completes in ~5s, 12 pages, sitemap generated). The wrangler.jsonc already has `pages_build_output_dir: "./dist"`. The package.json already has a working `deploy` script. The raw markdown files are already served at `/blogs/{slug}.md` via the `public/blogs/` static directory.

What remains: (1) configure and fire the wrangler Pages deploy to a **new test project** (not izharikov.dev), (2) add a `llms.txt` endpoint using Astro's static API routes, (3) fix the `robots.txt` sitemap reference (currently points to `/sitemap.xml` but Astro generates `/sitemap-index.xml`), (4) update the `_headers` file for Astro's new asset paths, and (5) measure Lighthouse and bundle size against the Next.js baseline.

The site currently ships ~22KB of JavaScript (SolidJS islands only: `web.js` 13KB, `client.js` 5.6KB, `MobileMenu.js` 2.2KB, `ThemeToggle.js` 1.4KB) plus one 32KB CSS file. Achieving Lighthouse >= 95 on a fully static Astro site with minimal JS is straightforward — the main risks are font loading (CLS from variable fonts), missing `width`/`height` on `<img>` tags, and the HTTPS dev server config breaking the plain `astro build` path.

**Primary recommendation:** Deploy to a separate `blog-astro-preview` Cloudflare Pages project using `wrangler pages deploy dist/ --project-name blog-astro-preview`, add `llms.txt` as a static API endpoint, fix robots.txt, and measure Lighthouse on the deployed URL.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

No CONTEXT.md was produced for this phase — the additional_context block in the prompt is the authoritative constraint source.

### Locked Decisions (from phase brief)
- Deploy to a SEPARATE test/preview Cloudflare Pages project, NOT izharikov.dev (the production Next.js site). User must compare Astro build vs live Next.js before cutting over.
- Must implement/verify: sitemap (already working), llms.txt endpoint, raw markdown access at /blogs/{slug}.md (already working via public/).

### Claude's Discretion
- Plan ordering and task granularity within phase.
- Exact Cloudflare Pages project name for the test deployment.
- Whether to add `wrangler pages project create` as an explicit step or rely on the interactive prompt.

### Deferred Ideas (OUT OF SCOPE)
- Cutting over the production domain (izharikov.dev) from Next.js to Astro — this is NOT part of Phase 5.
- Adding new blog posts or redesigning pages.
- Server-side rendering / @astrojs/cloudflare adapter — the site stays output: static throughout.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| DEPLOY-01 | Builds and deploys to Cloudflare Pages via wrangler | wrangler.jsonc is ready; `wrangler pages deploy dist/ --project-name <name>` is the command; adapter NOT needed for static output |
| DEPLOY-02 | All pages render correctly in production | Build produces correct HTML for all 9 blog slugs + 3 static pages; URL parity verified against public/blogs/ |
| DEPLOY-03 | Image optimization works in both dev and production | All images use plain `<img>` tags (not Astro `<Image>`); they resolve as static assets from public/ — no image service config needed |
| PERF-01 | Smaller total bundle size than current Next.js build | Current Astro build: ~22KB JS total (4 files); Next.js React baseline is 100-300KB JS minimum; win is structural |
| PERF-02 | Lighthouse performance score >= 95 | Static Astro sites routinely score 95-100; risks are font CLS, missing img dimensions, and the HTTPS vite.server config |
</phase_requirements>

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| wrangler | 4.78.0 (installed) | Cloudflare CLI for Pages deploy | Already in devDependencies; `wrangler pages deploy` is the canonical deploy command |
| @astrojs/sitemap | 3.7.2 (installed) | Sitemap generation | Already integrated and working — generates sitemap-index.xml + sitemap-0.xml |
| rollup-plugin-visualizer | latest | Bundle size analysis | Official Astro recipe for bundle analysis; integrates via vite.plugins in astro.config.mjs |

### Astro Static API Routes (for llms.txt)
Astro supports static API endpoints at `src/pages/llms.txt.ts` — a `.ts` file that exports a `GET` function and `export const prerender = true`. This produces a static `/llms.txt` file at build time with zero runtime overhead.

```typescript
// src/pages/llms.txt.ts
export const prerender = true;

export async function GET({ site }: { site: URL }) { ... }
```

**Installation (bundle visualizer only):**
```bash
npm install rollup-plugin-visualizer --save-dev
```

All other dependencies already installed.

**Version verification:** wrangler 4.78.0 confirmed via `node_modules/.bin/wrangler --version`. @astrojs/sitemap 3.7.2 via package.json.

---

## Architecture Patterns

### Current Build Output (verified)
```
dist/
├── _astro/
│   ├── BaseLayout.y0c4GZLt.css   (32KB — Tailwind output)
│   ├── web.DIwTfOlG.js           (13KB — SolidJS runtime)
│   ├── client.BAD8FbRb.js        (5.6KB — island hydration)
│   ├── MobileMenu.DwczzX6Q.js    (2.2KB — island)
│   └── ThemeToggle.CAWrmpyo.js   (1.4KB — island)
├── blogs/
│   ├── {slug}/index.html         (9 blog post pages)
│   ├── {slug}.md                 (raw markdown, copied from public/blogs/)
│   └── index.html
├── sitemap-index.xml             (working)
├── sitemap-0.xml                 (working, 12 URLs)
├── robots.txt                    (NEEDS FIX: points to /sitemap.xml not /sitemap-index.xml)
├── _headers                      (NEEDS UPDATE: references /_next/static/* not /_astro/*)
├── index.html
├── about/index.html
└── ...
```

### Pattern 1: Cloudflare Pages Deployment (Static, No Adapter)
**What:** For fully static Astro (`output: 'static'`), the `@astrojs/cloudflare` adapter is NOT used. Deploy via `wrangler pages deploy`. The adapter causes build failures on Windows for static output (confirmed in STATE.md decisions — "Removed cloudflare adapter from astro.config.mjs").

**Wrangler config already correct:**
```jsonc
// wrangler.jsonc
{
  "name": "blog",
  "compatibility_date": "2025-03-01",
  "compatibility_flags": ["nodejs_compat"],
  "pages_build_output_dir": "./dist"
}
```

**Deploy to a test project (not production):**
```bash
# Step 1: Authenticate (if not already)
npx wrangler login

# Step 2: Create the preview project (interactive — will prompt for name)
npx wrangler pages project create blog-astro-preview

# Step 3: Build and deploy
npm run build
npx wrangler pages deploy dist/ --project-name blog-astro-preview
```

The `--project-name` flag overrides the `name` in wrangler.jsonc for the deploy target. This allows deploying to `blog-astro-preview` without changing the wrangler.jsonc `name` field.

**Confidence:** HIGH — verified via Cloudflare Pages direct upload docs.

### Pattern 2: Static API Route for llms.txt
**What:** Astro generates plain text files from `.ts` endpoint files. Use `export const prerender = true` to generate at build time.

```typescript
// src/pages/llms.txt.ts
import { getCollection } from 'astro:content';
import { siteConfig } from '@/config/site';

export const prerender = true;

export async function GET() {
  const posts = await getCollection('blog');
  const sorted = posts.sort((a, b) => b.data.date.localeCompare(a.data.date));

  const body = `# ${siteConfig.name}

${siteConfig.description}

## Blogs
${sorted.map(post => `- [${post.data.title}](${siteConfig.site}/blogs/${post.id}.md)`).join('\n')}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
```

This mirrors the old Next.js `llms.txt/route.ts` exactly. Outputs `/llms.txt` as a static file.

**Confidence:** HIGH — verified via Astro endpoints docs and community llms.txt example.

### Pattern 3: Bundle Size Measurement
```javascript
// astro.config.mjs (temporary, remove after analysis)
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  vite: {
    plugins: [
      tailwindcss(),
      visualizer({ emitFile: true, filename: 'stats.html' })
    ]
  }
});
```
Generates `dist/stats.html` — interactive treemap of all JS dependencies.

### Anti-Patterns to Avoid
- **Using `@astrojs/cloudflare` adapter with `output: 'static'`:** Causes build failures (GitHub issue #15650 confirmed). The adapter is for SSR/hybrid output only.
- **Deploying to production `blog` project during testing:** Use `--project-name blog-astro-preview` to target the preview project.
- **Keeping the HTTPS Vite dev server config for production builds:** The `vite.server.https` config in astro.config.mjs reads `.certs/` files. This is fine for `astro build` (server config ignored at build time) but may fail in CI. If needed, guard with a `process.env.NODE_ENV` check.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Sitemap generation | Custom sitemap.xml page | @astrojs/sitemap (already installed) | Already working and tested — generates proper sitemap-index.xml + paged sitemap-0.xml |
| Raw markdown serving | Dynamic API route to read MDX files | Static files in `public/blogs/` (already in place) | 9 `.md` files already in public/blogs/, copied to dist/blogs/*.md automatically |
| Bundle analysis | Manual file size counting | rollup-plugin-visualizer | Official Astro recipe; produces interactive HTML treemap |
| llms.txt | Complex content generation | Simple static API route (20 lines) | Astro static endpoints are purpose-built for this |

**Key insight:** The raw markdown files (`/blogs/{slug}.md`) are already served correctly via `public/blogs/`. The public/ directory is copied verbatim to dist/ — no code needed. Just verify the URLs match what the live site serves.

---

## Common Pitfalls

### Pitfall 1: robots.txt Points to Wrong Sitemap URL
**What goes wrong:** The current `public/robots.txt` contains `Sitemap: https://izharikov.dev/sitemap.xml`. Astro's `@astrojs/sitemap` generates `sitemap-index.xml` (not `sitemap.xml`). Search engines following robots.txt will get a 404.
**Why it happens:** The old Next.js sitemap was served at `/sitemap.xml` (Next.js convention). Astro uses `sitemap-index.xml`.
**How to avoid:** Update `public/robots.txt` to `Sitemap: https://izharikov.dev/sitemap-index.xml`.
**Warning signs:** 404 on /sitemap.xml in production.

### Pitfall 2: _headers File References /_next/static/* Paths
**What goes wrong:** The current `public/_headers` file sets aggressive cache headers for `/_next/static/*`. This path no longer exists in the Astro build — Astro uses `/_astro/*` instead.
**Why it happens:** The `_headers` file was written for the Next.js site and not updated during migration.
**How to avoid:** Update `public/_headers` to cache `/_astro/*` instead of `/_next/static/*`.
**Warning signs:** Assets not cached in production; repeated full fetches of CSS/JS on each page load hurting performance scores.

### Pitfall 3: wrangler.jsonc `name` Field Matches Production Project
**What goes wrong:** Running `wrangler pages deploy dist/` without `--project-name` will deploy to the project matching `"name": "blog"` in wrangler.jsonc — which is the live production site.
**Why it happens:** The `name` field was set to "blog" during Phase 1 scaffolding. Without `--project-name`, wrangler uses this as the Pages project target.
**How to avoid:** Always use `--project-name blog-astro-preview` (or chosen test name) in the deploy command for Phase 5. Do NOT remove or change the `name` field in wrangler.jsonc (it may be needed for future production deployment).
**Warning signs:** Deployment succeeds but goes to the wrong project; live site changes unexpectedly.

### Pitfall 4: llms.txt References Wrong Markdown URLs
**What goes wrong:** The old llms.txt linked to `/blogs/{slug}.md` using the blog slug. But some `public/blogs/*.md` filenames don't match the blog slugs (e.g., `sitecore-marketers-mcp-server-resource-parameter-required.md` vs slug `sitecore-mcp-server-issue`).
**Why it happens:** The raw markdown files were added to `public/blogs/` with different names than the eventual MDX slugs. There are also 4 raw markdown files in `public/blogs/` that have no corresponding MDX blog post (e.g., `sitecore-marketplace-december-updates.md`).
**How to avoid:** The llms.txt endpoint should generate links pointing to `{siteConfig.site}/blogs/{post.id}.md`. For these links to actually resolve, the corresponding `.md` files must exist in `public/blogs/`. Currently 5 of 9 match. The other 4 may need to be renamed or the llms.txt should only link posts with confirmed matching `.md` files.
**Recommended approach:** Keep llms.txt simple — link to the rendered HTML blog pages (`/blogs/{slug}`) instead of `.md` files, since the markdown filenames are inconsistent. Or confirm/rename the public markdown files to match slugs.
**Warning signs:** llms.txt links resolve to 404s.

### Pitfall 5: Font Loading Causes CLS/LCP Issues
**What goes wrong:** The site uses `@fontsource-variable/geist` and `@fontsource-variable/geist-mono` loaded via CSS `@import`. Variable fonts without explicit `font-display: swap` or `preload` link hints can cause CLS (layout shift) or slow LCP, dropping Lighthouse below 95.
**Why it happens:** Fontsource imports in globals.css don't automatically generate `<link rel="preload">` tags.
**How to avoid:** Add `<link rel="preload">` for the primary woff2 font variant in `BaseLayout.astro` head. The built woff2 files are in `dist/_astro/` — their hashed names change each build. Use Astro's `<link rel="preconnect">` or load fonts inline.
**Warning signs:** Lighthouse reports "Ensure text remains visible during webfont load" or CLS > 0.1.

### Pitfall 6: Image Tags Missing width/height Attributes
**What goes wrong:** `<img>` tags without explicit `width` and `height` cause layout shift (CLS) until images load, reducing Lighthouse score.
**Why it happens:** HeroSection.astro has `width="100" height="100"` (correct). BlogCard.astro and MDX Img.astro do NOT set dimensions. Lighthouse will flag these.
**How to avoid:** Add `width` and `height` to the profile image (already has them). For blog card logos (external URLs) and MDX images, either add explicit dimensions or accept the CLS hit on blog post pages (not the page under test for Lighthouse).
**Warning signs:** Lighthouse CLS warning; LCP delay on images.

---

## Code Examples

### llms.txt Static Endpoint
```typescript
// Source: Astro Endpoints docs + community pattern
// src/pages/llms.txt.ts
import { getCollection } from 'astro:content';
import { siteConfig } from '@/config/site';

export const prerender = true;

export async function GET() {
  const posts = await getCollection('blog');
  const sorted = [...posts].sort((a, b) =>
    b.data.date.localeCompare(a.data.date)
  );

  const body = `# ${siteConfig.name}\n\n${siteConfig.description}\n\n## Blogs\n${
    sorted.map(p => `- [${p.data.title}](${siteConfig.site}/blogs/${p.id})`).join('\n')
  }\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
```

### Updated robots.txt
```
User-Agent: *

Sitemap: https://izharikov.dev/sitemap-index.xml
```

### Updated _headers (Cloudflare Pages)
```
# Cache Astro's hashed assets forever
/_astro/*
  Cache-Control: public, max-age=31536000, immutable

# HTML pages: no cache (always fresh)
/*.html
  Cache-Control: public, max-age=0, must-revalidate
```

### Bundle Visualizer (temporary, dev only)
```javascript
// astro.config.mjs additions for analysis
import { visualizer } from 'rollup-plugin-visualizer';
// In vite.plugins array:
visualizer({ emitFile: true, filename: 'stats.html' })
// Remove after analysis
```

### Deploy Commands
```bash
# First-time: create preview project (interactive)
npx wrangler pages project create blog-astro-preview

# Build + deploy to preview project
npm run build
npx wrangler pages deploy dist/ --project-name blog-astro-preview

# Or add a script to package.json:
# "deploy:preview": "astro build && wrangler pages deploy dist/ --project-name blog-astro-preview"
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `wrangler pages deploy` for Pages | `wrangler deploy` for Workers (static assets via `assets.directory`) | Cloudflare 2024-2025 migration push | Cloudflare is migrating users toward Workers; for pure static sites, **Pages still works** via `wrangler pages deploy` — no migration needed for this phase |
| `@astrojs/cloudflare` adapter for all CF deployments | Adapter only needed for SSR/hybrid output | Astro 6 / adapter v13 | Static-only sites deploy without adapter |
| `sitemap.xml` (Next.js convention) | `sitemap-index.xml` + `sitemap-0.xml` (Astro convention) | @astrojs/sitemap integration | Must update robots.txt reference |

**Deprecated/outdated:**
- `/_next/static/*` cache headers: No longer valid path — replaced by `/_astro/*` in Astro build output.
- `@astrojs/tailwind` integration: Replaced by `@tailwindcss/vite` plugin (v4 requirement — already done).

---

## Open Questions

1. **Does wrangler.jsonc `name: "blog"` conflict with the production Pages project?**
   - What we know: `wrangler pages deploy dist/ --project-name blog-astro-preview` uses the `--project-name` flag to override. The `name` field in wrangler.jsonc is used by `wrangler deploy` (Workers), not necessarily by `wrangler pages deploy` when `--project-name` is specified.
   - What's unclear: Whether `wrangler pages deploy` without `--project-name` falls back to `name` in wrangler.jsonc or requires a separate `pages_project_name` field.
   - Recommendation: Always pass `--project-name` explicitly in the deploy command. Optionally add `"pages_project_name": "blog-astro-preview"` to wrangler.jsonc for the preview deployment.

2. **Raw markdown URL parity: do the 4 unmatched public/blogs files matter?**
   - What we know: `public/blogs/` has 9 `.md` files. 5 match blog slugs exactly. 4 do not (`sitecore-marketers-mcp-server-resource-parameter-required.md`, `sitecore-marketplace-app-custom-authorization-setup.md`, `sitecore-marketplace-december-updates.md`, `sitecore-marketplace-vercel-ai-tools.md`). These 4 are served at the URLs Cloudflare currently serves them — they exist on the live site.
   - What's unclear: Whether the live Next.js site serves these 4 at these exact paths (they're in public/ so yes, they were served). They don't have matching HTML pages — these might be older/renamed posts.
   - Recommendation: Keep all 9 `public/blogs/*.md` files as-is (they're already in dist/). The llms.txt should only link to posts that have both HTML pages and matching `.md` files, OR link to HTML pages only to avoid broken links.

3. **wrangler login / account authentication**
   - What we know: `wrangler pages project create` and `wrangler pages deploy` both require Cloudflare authentication.
   - What's unclear: Whether the developer machine is already authenticated from previous wrangler usage.
   - Recommendation: Include `wrangler whoami` as a verification step before attempting deploy. If not authenticated, `wrangler login` opens a browser OAuth flow.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Astro build | ✓ | v24.0.0 | — |
| wrangler | Cloudflare Pages deploy | ✓ | 4.78.0 (node_modules) | — |
| Cloudflare account authentication | wrangler pages deploy | Unknown | — | Run `wrangler login` |
| Cloudflare Pages project "blog-astro-preview" | Phase 5 deploy target | Unknown (new) | — | `wrangler pages project create blog-astro-preview` |
| Lighthouse CLI or PageSpeed Insights | PERF-02 validation | Unknown locally | — | Use https://pagespeed.web.dev/ (free, no install) |
| rollup-plugin-visualizer | Bundle analysis | ✗ (not installed) | — | `npm install rollup-plugin-visualizer --save-dev` |

**Missing dependencies with no fallback:**
- Cloudflare account auth: must `wrangler login` before deploy.

**Missing dependencies with fallback:**
- rollup-plugin-visualizer: manual `ls -la dist/_astro/*.js` gives total JS size without visualization.
- Lighthouse CLI: PageSpeed Insights web UI works for deployed URL validation.

---

## Sources

### Primary (HIGH confidence)
- Cloudflare Pages direct upload docs (https://developers.cloudflare.com/pages/get-started/direct-upload/) — `wrangler pages deploy` flags, `--project-name`
- Cloudflare Wrangler pages commands (https://developers.cloudflare.com/workers/wrangler/commands/pages/) — full flag reference
- Astro endpoints docs (https://docs.astro.build/en/guides/endpoints/) — static API route pattern for llms.txt
- Astro bundle size recipe (https://docs.astro.build/en/recipes/analyze-bundle-size/) — rollup-plugin-visualizer configuration
- GitHub issue #15650 (https://github.com/withastro/astro/issues/15650) — confirmed adapter + static output failure and workaround
- Project source code inspection — confirmed build output, file sizes, existing wrangler config, existing public/blogs/ raw markdown files

### Secondary (MEDIUM confidence)
- Astro Cloudflare integration docs (https://docs.astro.build/en/guides/integrations-guide/cloudflare/) — adapter not needed for static output
- Community llms.txt Astro pattern (https://blog.redlinesoft.net/posts/add-llm-txt-to-astro-blog/) — confirmed `prerender = true` + `GET` export pattern

### Tertiary (LOW confidence)
- Performance claims (Lighthouse 95+ for static Astro): multiple community blog posts, not measured on this specific site yet — validate post-deploy.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all tools already installed and verified
- Architecture: HIGH — build output inspected, deploy commands verified against official docs
- Pitfalls: HIGH for known issues (adapter conflict, robots.txt, _headers); MEDIUM for performance (Lighthouse not yet measured on this specific build)

**Research date:** 2026-03-28
**Valid until:** 2026-06-28 (wrangler and Astro release cadence; review if either releases major version)
