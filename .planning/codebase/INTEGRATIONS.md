# External Integrations

**Analysis Date:** 2026-03-27

## APIs & External Services

**Font Delivery:**
- Google Fonts - Geist and Geist Mono fonts
  - Integration: `src/app/layout.tsx` uses `next/font/google`
  - No authentication required

**Schema & Structured Data:**
- Schema.org - Structured data for SEO
  - SDK/Client: `schema-dts` ^1.1.5 package
  - Used in: `src/lib/json-ld.ts` for Person and BlogPosting schemas
  - No authentication required

## Data Storage

**Databases:**
- Not used - Static site with no backend database

**File Storage:**
- Local filesystem - Blog content
  - Location: `/blogs` directory
  - Format: MDX files with YAML front matter
  - Processing: `scripts/generate-blog-manifest.mjs` extracts metadata into `src/data/blog-manifest.ts`
- Cloudflare R2 - Incremental build cache
  - Binding: NEXT_INC_CACHE_R2_BUCKET
  - Configured in: `wrangler.jsonc`
  - Adapter: `@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache`
  - Used in: `open-next.config.ts`

**Image Storage:**
- Static public assets - Favicon and images
  - Location: `/public` directory
  - Custom image optimization: `image-loader.ts` for production (Cloudflare)
  - Dev mode: Default Next.js image optimization

**Caching:**
- Incremental Static Regeneration (ISR) via R2 bucket - Build-time cache for static assets
- No external caching service (Redis, Memcached, etc.)

## Authentication & Identity

**Auth Provider:**
- None - Static blog site with no user authentication

**Social Integration:**
- Links only (no OAuth/SSO)
  - GitHub: `https://github.com/izharikov`
  - LinkedIn: `https://www.linkedin.com/in/ihar-zharykau/`
  - Twitter/X: `https://x.com/i_zharikov`
  - Configured in: `src/config/site.ts`

## Monitoring & Observability

**Error Tracking:**
- Not configured

**Logs:**
- Cloudflare Workers observability
  - Enabled in: `wrangler.jsonc` with `"observability": { "enabled": true }`
  - Platform: Cloudflare analytics/logs

**Analytics:**
- None detected - No analytics SDK integrated

## CI/CD & Deployment

**Hosting:**
- Cloudflare Workers / Pages
  - Deployed via Wrangler CLI
  - Adapter: @opennextjs/cloudflare ^1.14.2
  - Build output: `.open-next` directory

**CI Pipeline:**
- Not configured in repository
- Manual deployment commands available:
  ```bash
  npm run deploy     # Build and deploy to Cloudflare
  npm run upload     # Build and upload to Cloudflare
  npm run preview    # Build and preview locally
  ```

**Build Process:**
- Prebuild: `npm run generate-manifest` - Generates blog metadata from MDX files
- Build: `next build` - Next.js build process
- Output handling: Cloudflare deployment via OpenNext adapter

## Environment Configuration

**Required env vars:**
- None for basic development
- Production (Cloudflare):
  - Managed via Wrangler secrets/vars (not in code)
  - Cloudflare bindings configured in `wrangler.jsonc`:
    - ASSETS: Static asset binding
    - NEXT_INC_CACHE_R2_BUCKET: R2 bucket for incremental cache

**Secrets location:**
- Not committed to repository
- Cloudflare: Managed via Wrangler (`wrangler secret put`)
- Development: Local environment (if needed)

## Webhooks & Callbacks

**Incoming:**
- Not configured - Static site with no backend

**Outgoing:**
- LLM context endpoint: `src/app/(seo)/llms.txt/route.ts`
  - Generates plain text manifest of blog content for LLM indexing
  - Returns all blog posts with links
  - No external webhooks, content-only response

---

*Integration audit: 2026-03-27*
