# Blog

Personal tech blog built with Astro + SolidJS. Deployed to Cloudflare Pages.

## Setup

```bash
npm install
```

Requires local certs for HTTPS dev server:
```
.certs/
  cert.pem
  key.pem
```

Add to hosts file (`C:\Windows\System32\drivers\etc\hosts`):
```
127.0.0.1 blog.local
::1 blog.local
```

## Development

```bash
npm run dev       # https://blog.local:4321
npm run build     # Build to dist/
npm run preview   # Preview build locally
npm run check     # Type checking
```

## Deploy

```bash
npm run deploy           # Production
npm run deploy:preview   # Preview environment
```

## Docs

See [docs/README.md](docs/README.md) for architecture, project structure, and tech details.
