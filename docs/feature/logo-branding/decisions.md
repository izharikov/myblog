# Logo & Branding — Decisions

## 1. Logo mark direction

**Status:** Open

**Options:**

**A — Geometric IZ monogram**
Letters I and Z interlocked or stacked into a single geometric shape. Clean, personal, recognizable at small sizes.

**B — Code bracket mark**
Evolve the `<IZ>` concept but geometric — angular brackets as abstract shapes filled with amber, with negative space forming the letters. Keeps the dev identity.

**C — Abstract geometric**
No letters. A simple shape (hexagon, diamond, overlapping planes) in amber that becomes the brand mark. Wordmark `@izharikov` carries the identity.

**D — Ligature slash**
Stylized `/iz` — the forward slash as a strong diagonal, "iz" as a compact ligature. Feels like a URL path, ties to the web/dev identity.

**Considerations:**
- Must work at 16px favicon — complex shapes won't survive
- A and D carry personal identity in the mark itself
- B and C rely more on the wordmark for recognition
- Amber on dark surface has good contrast; amber on light needs care

## 2. Header wordmark

**Status:** Open

**Options:**
- `@izharikov` (current handle style)
- `izharikov.dev` (domain-as-identity)
- `iz.dev` (shortest, memorable if domain available)
- Just the mark (no text, minimal)

## 3. Favicon format strategy

**Status:** Decided — SVG primary + PNG fallbacks

- `favicon.svg` — scalable, supports dark mode via `prefers-color-scheme`
- `favicon-32.png` + `favicon-16.png` — legacy fallback
- `apple-touch-icon.png` (180x180) — iOS home screen
- `site.webmanifest` — PWA metadata
