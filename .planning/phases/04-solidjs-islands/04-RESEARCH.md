# Phase 4: SolidJS Islands - Research

**Researched:** 2026-03-27
**Domain:** SolidJS islands in Astro 6 — theme toggle, FOUC-free dark mode, mobile menu
**Confidence:** HIGH

## Summary

Phase 4 adds two SolidJS islands to the existing Astro site: a theme toggle (dark/light) and a mobile navigation menu. Both are small, self-contained interactive components that replace placeholder divs currently in `Header.astro`. The static pages, layouts, and MDX components from Phases 1–3 are already complete and fully functional.

The critical FOUC (Flash Of Unstyled Content) requirement means the dark class must be set on `<html>` via a blocking inline script in `<head>` — before any HTML renders. This is a pure Astro concern, not a SolidJS concern. The SolidJS ThemeToggle island only needs to read the initial state and handle clicks; it does not manage the initial paint.

For the mobile menu, `@kobalte/core` Dialog is the right primitive — it handles focus trapping, Escape key, and ARIA automatically. The package is not yet installed (not in package.json). An alternative is a hand-rolled approach using native `<dialog>` or plain `<div>` with SolidJS signals, which avoids a dependency for a simple show/hide panel.

**Primary recommendation:** Use an `is:inline` blocking script in BaseLayout `<head>` for FOUC prevention; SolidJS `client:load` for ThemeToggle; `client:load` for MobileMenu using @kobalte/core Dialog or a hand-rolled approach.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| THEME-01 | Dark/light theme toggle as SolidJS island | SolidJS `createSignal` reads initial state from `document.documentElement.classList`; toggle adds/removes `.dark` class and writes to localStorage |
| THEME-02 | Theme preference persisted to localStorage | `createEffect` in ThemeToggle writes `localStorage.setItem('theme', ...)` on every change |
| THEME-03 | No FOUC — inline blocking script sets theme before first paint | Blocking `is:inline` script in `<head>` reads localStorage + system preference and sets `.dark` class before HTML body renders |
| NAV-02 | Mobile menu/drawer as SolidJS island (replaces Radix Sheet) | @kobalte/core Dialog or hand-rolled panel using `createSignal(false)` for open state; Escape key handled by Kobalte or manually |
</phase_requirements>

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| solid-js | 1.9.12 (installed) | Signals and reactivity for islands | Already in package.json, @astrojs/solid-js configured |
| @astrojs/solid-js | 6.0.0 (installed) | SSR + hydration of SolidJS components | Official Astro integration, already wired in astro.config.mjs |
| lucide-solid | 0.577.0 (installed) | Sun/Moon icons for toggle, Menu/X icons for mobile nav | Already in package.json; replaces lucide-react |
| tailwindcss | 4.2.2 (installed) | Dark mode via `.dark` class on `<html>` | Already configured with `@custom-variant dark` |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @kobalte/core | 0.13.11 (NOT installed) | Dialog primitive for mobile menu (focus trap, Escape, ARIA) | Install if accessible modal behavior is needed; skip if hand-rolling |
| clsx | 2.x (installed) | Conditional class merging in SolidJS components | Use for toggle button active state classes |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| @kobalte/core Dialog | Hand-rolled `<div>` with SolidJS signals | Kobalte adds ~20KB but provides full ARIA/focus trap; hand-rolled is simpler for a basic slide-in menu and avoids new dependency |
| @kobalte/core Dialog | Native HTML `<dialog>` element | Native dialog has good browser support but animation/styling is harder; no SolidJS integration overhead |
| localStorage only | Cookie-based storage | Cookies work with SSR; localStorage is fine here because Astro is static output — no SSR flash risk beyond initial page paint (handled by inline script) |

**Installation (if using @kobalte/core):**
```bash
npm install @kobalte/core
```

**Version verification (confirmed 2026-03-27):**
- @kobalte/core: 0.13.11 (latest on npm)
- lucide-solid: 1.7.0 is latest, but 0.577.0 already installed — check if API changed before upgrading

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   ├── layout/
│   │   ├── Header.astro          # Updated to include islands
│   │   ├── ThemeToggle.tsx       # SolidJS island — client:load
│   │   └── MobileMenu.tsx        # SolidJS island — client:load
│   └── ...
├── layouts/
│   └── BaseLayout.astro          # Add blocking <script is:inline> in <head>
└── styles/
    └── globals.css               # Fix @custom-variant dark selector (see Pitfall 3)
```

### Pattern 1: FOUC-Free Dark Mode (Blocking Inline Script)

**What:** A `<script is:inline>` placed in `<head>` before any CSS or body content. It runs synchronously, blocking the render until the `.dark` class is set.

**When to use:** Always — for any site where dark mode is class-based. This is the canonical Astro pattern.

**Example:**
```astro
<!-- In BaseLayout.astro <head>, before </head> -->
<script is:inline>
  document.documentElement.classList.toggle(
    "dark",
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
  );
</script>
```

Source: [danielnewton.dev dark-mode-astro-tailwind-fouc](https://www.danielnewton.dev/blog/dark-mode-astro-tailwind-fouc/) — verified against official Astro tutorial pattern.

**Critical:** Do NOT use `<script>` without `is:inline` — Astro bundles and defers regular scripts, which causes FOUC. The `is:inline` attribute emits the script verbatim into the HTML, making it render-blocking.

### Pattern 2: ThemeToggle SolidJS Island

**What:** A SolidJS component that reads the initial theme from `document.documentElement.classList`, provides a button to toggle, writes to localStorage, and updates the DOM class.

**When to use:** The toggle needs to read state that was set by the inline script (which ran before SolidJS hydrated). Reading from `document.documentElement.classList` (not localStorage) avoids hydration mismatch — the HTML element already has the correct class.

**Example:**
```tsx
// src/components/layout/ThemeToggle.tsx
import { createSignal, createEffect } from "solid-js";
import { Moon, Sun } from "lucide-solid";

export default function ThemeToggle() {
  const [isDark, setIsDark] = createSignal(
    document.documentElement.classList.contains("dark")
  );

  createEffect(() => {
    if (isDark()) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  });

  return (
    <button
      onClick={() => setIsDark(d => !d)}
      aria-label="Toggle theme"
      class="w-9 h-9 flex items-center justify-center rounded-md hover:bg-muted transition-colors"
    >
      {isDark() ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
```

Usage in Header.astro:
```astro
---
import ThemeToggle from '@/components/layout/ThemeToggle';
---
<ThemeToggle client:load />
```

**Key:** `client:load` is correct here — the toggle is in the header (above the fold, immediately visible) and must be interactive without delay.

**SSR note:** Because `document` is not available during server-side render, initializing `createSignal` with `document.documentElement.classList.contains("dark")` would throw on the server. Two safe approaches:
1. Use `client:only="solid-js"` — skips SSR entirely; renders a placeholder on server, island on client
2. Guard with `typeof document !== 'undefined'` and provide a default

For a static Astro site with `output: 'static'`, the component IS server-rendered to HTML (no live SSR). The SSR happens at BUILD time, where `document` is not available. Use `client:only="solid-js"` or initialize signal lazily.

**Recommended:** Use `client:only="solid-js"` for ThemeToggle to avoid build-time SSR issues. The static fallback placeholder `<div class="w-9 h-9" aria-hidden="true"></div>` already exists in Header.astro.

### Pattern 3: Mobile Menu (Hand-rolled vs Kobalte)

**Option A: @kobalte/core Dialog (install required)**
```tsx
import { Dialog } from "@kobalte/core/dialog";
import { Menu, X } from "lucide-solid";

export default function MobileMenu() {
  return (
    <Dialog modal>
      <Dialog.Trigger class="md:hidden w-9 h-9 flex items-center justify-center">
        <Menu size={20} />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay class="fixed inset-0 bg-black/50 z-40" />
        <Dialog.Content class="fixed top-0 right-0 h-full w-72 bg-background z-50 p-6">
          <Dialog.CloseButton class="absolute top-4 right-4">
            <X size={20} />
          </Dialog.CloseButton>
          {/* nav links */}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
```

**Option B: Hand-rolled with createSignal (no new dependency)**
```tsx
import { createSignal, onCleanup } from "solid-js";
import { Menu, X } from "lucide-solid";

export default function MobileMenu() {
  const [open, setOpen] = createSignal(false);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
  };

  // Add/remove event listener based on open state
  const toggle = () => {
    setOpen(o => !o);
  };

  return (
    <>
      <button
        class="md:hidden w-9 h-9 flex items-center justify-center"
        onClick={toggle}
        aria-label="Toggle menu"
        aria-expanded={open()}
      >
        {open() ? <X size={20} /> : <Menu size={20} />}
      </button>
      {open() && (
        <>
          <div
            class="fixed inset-0 bg-black/50 z-40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            class="fixed top-0 right-0 h-full w-72 bg-background z-50 p-6"
            onKeyDown={handleKeyDown}
          >
            {/* nav links */}
          </div>
        </>
      )}
    </>
  );
}
```

**Recommendation:** Use Option B (hand-rolled) for this use case. The mobile menu is simple enough that Kobalte's overhead (new dependency, bundle cost, v0.x API stability risk) is not justified. The STATE.md concern about Kobalte pre-1.0 stability was explicitly raised.

### Pattern 4: Astro Client Directives — Decision Guide

| Directive | When | Use For |
|-----------|------|---------|
| `client:load` | Immediately on page load | ThemeToggle (visible, interactive immediately) |
| `client:idle` | After page load, during idle | Lower-priority components (not applicable here) |
| `client:visible` | When enters viewport | Below-fold components (not applicable here) |
| `client:only="solid-js"` | Never server-render | Components that read `window`/`document` at init time (ThemeToggle init, to avoid SSR build errors) |

### Anti-Patterns to Avoid
- **Regular `<script>` for theme init:** Astro bundles and defers regular scripts. Use `is:inline` for the blocking theme script.
- **Reading localStorage in SolidJS createSignal initial value with client:load:** Build-time SSR runs the component on Node.js where `localStorage` is undefined. Either use `client:only` or guard with `typeof window !== 'undefined'`.
- **Using createSignal(localStorage.getItem('theme')):** The inline script has already set the DOM class; read from `document.documentElement.classList.contains("dark")` instead to stay in sync with what was actually painted.
- **Multiple sources of truth:** The `.dark` class on `<html>` is the single source of truth. The inline script sets it; the toggle reads and updates it. localStorage is a persistence mechanism only.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| FOUC prevention | Custom service worker / CSS hack | Blocking `<script is:inline>` | Two-line pattern that is canonical and battle-tested across all Astro sites |
| Focus trap in modal | Manual tabIndex management | @kobalte/core Dialog (if installing) | Focus trap logic is surprisingly complex; Kobalte handles forwards/backwards tab, initial focus, restore-on-close |
| Escape key dismiss | Manual keydown listener | @kobalte/core Dialog (if installing) | Provided automatically; hand-rolling requires cleanup to avoid memory leaks |

**Key insight:** The FOUC problem has one correct solution in Astro — the blocking inline script. Everything else (signals, effects, localStorage writes) is standard SolidJS reactivity.

## Common Pitfalls

### Pitfall 1: FOUC from Deferred Script
**What goes wrong:** Dark mode flashes light on page load.
**Why it happens:** `<script>` tags in Astro are automatically bundled and deferred. The dark class is applied after the browser has already painted the page in light mode.
**How to avoid:** Always use `<script is:inline>` for the theme-init script so it runs synchronously in the HTML stream before the `<body>` renders.
**Warning signs:** Brief white flash visible when reloading in dark mode.

### Pitfall 2: `document` Undefined at Build Time
**What goes wrong:** `astro build` fails with "document is not defined" or "localStorage is not defined".
**Why it happens:** Astro server-renders all components (even SolidJS ones) to HTML at build time. Node.js does not have `window` or `document`. A `createSignal(document.documentElement.classList.contains("dark"))` call runs during this build-time render.
**How to avoid:** Use `client:only="solid-js"` on ThemeToggle. This tells Astro to skip server-rendering the component entirely; it will render on the client only.
**Warning signs:** Build error mentioning `document`, `window`, or `localStorage` is not defined.

### Pitfall 3: `@custom-variant dark` Selector Mismatch
**What goes wrong:** `dark:` utilities don't apply correctly on the element that has the `.dark` class itself (e.g., `<html class="dark">`).
**Why it happens:** The current `globals.css` uses `@custom-variant dark (&:is(.dark *))` — the `:is(.dark *)` selector only matches descendants OF `.dark`, not the element itself. The official Tailwind v4 recommendation is `@custom-variant dark (&:where(.dark, .dark *))`.
**How to avoid:** Update globals.css line 7 from `@custom-variant dark (&:is(.dark *));` to `@custom-variant dark (&:where(.dark, .dark *));`. The `:where()` selector also has zero specificity (preferred over `:is()`).
**Warning signs:** Dark mode applies to most elements but not to one specific element; or `dark:` doesn't trigger on the root element.

### Pitfall 4: ThemeToggle Icon Mismatch on Load
**What goes wrong:** The toggle shows "Moon" icon (implying light mode) but the page is already in dark mode.
**Why it happens:** The SolidJS signal is initialized before the component mounts, possibly with a default of `false` (light mode), while the inline script has already set `.dark` on `<html>`.
**How to avoid:** Initialize the signal by reading `document.documentElement.classList.contains("dark")` at mount time (safe because `client:only` ensures this runs in the browser).
**Warning signs:** Icon and actual mode are inverted after a dark-mode page reload.

### Pitfall 5: Multiple `createEffect` Writes on First Render
**What goes wrong:** The `createEffect` that writes to localStorage fires on initial render, overwriting a value the user didn't change.
**Why it happens:** SolidJS `createEffect` runs immediately on mount as well as on signal changes.
**How to avoid:** For the initial render, the write is harmless (it writes the same value that localStorage already had). This is acceptable behavior. Alternatively use `createRenderEffect` only for DOM mutations and a separate `on` to skip initial run, but for a simple toggle this is not necessary.

### Pitfall 6: `lucide-solid` API vs `lucide-react`
**What goes wrong:** Import paths from lucide-react don't work for lucide-solid; icon props may differ.
**Why it happens:** Different package — `import { Sun } from "lucide-solid"` not `from "lucide-react"`. Also note installed version is 0.577.0 but latest is 1.7.0 — API may differ.
**How to avoid:** Always import from `lucide-solid`. The `size` and `class` props are the same. No migration needed; just use the correct package.

## Code Examples

### Blocking Theme Script (BaseLayout.astro `<head>`)
```astro
<!-- Source: Astro official dark mode tutorial + danielnewton.dev -->
<script is:inline>
  document.documentElement.classList.toggle(
    "dark",
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
  );
</script>
```

### ThemeToggle Island (client:only, reads DOM state)
```tsx
// Source: SolidJS docs createSignal + createEffect pattern
import { createSignal, createEffect } from "solid-js";
import { Moon, Sun } from "lucide-solid";

export default function ThemeToggle() {
  const [isDark, setIsDark] = createSignal(
    document.documentElement.classList.contains("dark")
  );

  createEffect(() => {
    document.documentElement.classList.toggle("dark", isDark());
    localStorage.setItem("theme", isDark() ? "dark" : "light");
  });

  return (
    <button
      onClick={() => setIsDark(d => !d)}
      aria-label={isDark() ? "Switch to light mode" : "Switch to dark mode"}
      class="w-9 h-9 flex items-center justify-center rounded-md hover:bg-muted transition-colors"
    >
      {isDark() ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
```

Usage in Header.astro:
```astro
<ThemeToggle client:only="solid-js" />
```

### Updated globals.css dark variant (line 7 fix)
```css
/* BEFORE (current — incorrect for root element) */
@custom-variant dark (&:is(.dark *));

/* AFTER (official Tailwind v4 recommendation) */
@custom-variant dark (&:where(.dark, .dark *));
```
Source: [tailwindcss.com/docs/dark-mode](https://tailwindcss.com/docs/dark-mode) — official documentation.

### MobileMenu Island (hand-rolled)
```tsx
// Source: SolidJS docs createSignal + conditional rendering pattern
import { createSignal, createEffect } from "solid-js";
import { Menu, X } from "lucide-solid";
import { siteConfig } from "@/config/site";

export default function MobileMenu() {
  const [open, setOpen] = createSignal(false);

  // Lock body scroll when open
  createEffect(() => {
    document.body.style.overflow = open() ? "hidden" : "";
  });

  return (
    <>
      <button
        class="md:hidden w-9 h-9 flex items-center justify-center rounded-md hover:bg-muted transition-colors"
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle navigation menu"
        aria-expanded={open()}
      >
        {open() ? <X size={20} /> : <Menu size={20} />}
      </button>
      {open() && (
        <>
          {/* Overlay */}
          <div
            class="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          {/* Drawer panel */}
          <nav
            class="fixed top-0 right-0 h-full w-64 bg-background border-l border-border z-50 p-6 flex flex-col gap-4"
            onKeyDown={(e: KeyboardEvent) => e.key === "Escape" && setOpen(false)}
          >
            <div class="flex justify-end">
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                class="w-9 h-9 flex items-center justify-center rounded-md hover:bg-muted transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            {siteConfig.navigation.map(item => (
              <a
                href={item.href}
                class="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setOpen(false)}
              >
                {item.name}
              </a>
            ))}
          </nav>
        </>
      )}
    </>
  );
}
```

Usage in Header.astro:
```astro
<MobileMenu client:only="solid-js" />
```

### Updated Header.astro structure
```astro
---
import { siteConfig } from '@/config/site';
import ThemeToggle from '@/components/layout/ThemeToggle';
import MobileMenu from '@/components/layout/MobileMenu';
---
<header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div class="container max-w-screen-xl mx-auto px-4 flex h-16 items-center justify-between">
    <a href="/" class="font-bold text-lg">{siteConfig.logo}</a>
    <nav class="hidden md:flex items-center gap-6">
      {siteConfig.navigation.map(item => (
        <a href={item.href} class="text-sm font-medium hover:text-primary transition-colors">
          {item.name}
        </a>
      ))}
      <ThemeToggle client:only="solid-js" />
    </nav>
    <MobileMenu client:only="solid-js" />
  </div>
</header>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `darkMode: "class"` in tailwind.config.js | `@custom-variant dark` in CSS | Tailwind v4 (2024) | No config file; CSS-first configuration |
| `next-themes` ThemeProvider wrapper | Inline blocking script + SolidJS signal | This migration | Eliminates React context, reduces bundle; SSR-safe without a provider |
| Radix UI Sheet (React) | @kobalte/core Dialog or hand-rolled | This migration | Removes React dependency; SolidJS signals replace React state |
| `requestIdleCallback` hydration timing | `client:load` for header islands | Astro 6 (stable) | Header islands need immediate interactivity; `client:load` is correct |

**Deprecated/outdated:**
- `darkMode: "class"` config key: Does not exist in Tailwind v4. Use `@custom-variant` in CSS.
- `client:only` without framework specifier: Requires `client:only="solid-js"` — framework must be named.
- `@astrojs/tailwind`: Tailwind v4 integration; do not use — use `@tailwindcss/vite` (already in project).

## Open Questions

1. **@kobalte/core for mobile menu: install or hand-roll?**
   - What we know: Kobalte 0.13.11 is latest, pre-1.0, adds dependency; hand-rolling works for simple case
   - What's unclear: STATE.md explicitly flagged this as a decision for Phase 4 planning — "evaluate whether mobile drawer primitive is stable enough or should be hand-rolled with native `<dialog>`"
   - Recommendation: Hand-roll with SolidJS signals. The mobile menu is a simple show/hide drawer with overlay; no complex ARIA beyond `aria-expanded` and Escape key handling. Avoids dependency risk and new package install.

2. **`client:load` vs `client:only` for ThemeToggle**
   - What we know: `client:load` hydrates on load but still SSR-renders; `client:only="solid-js"` skips SSR. The ThemeToggle reads `document.documentElement` at init — not safe during build-time SSR.
   - Recommendation: Use `client:only="solid-js"`. The static HTML fallback placeholder div already exists in Header.astro. This avoids build-time failures entirely and is the canonical pattern for components that need browser APIs at init.

3. **Does the `@custom-variant dark (&:is(.dark *))` bug actually affect the site?**
   - What we know: `:is(.dark *)` only matches descendants of `.dark`, not `.dark` itself. If no element directly on `<html>` uses `dark:` utilities (most utilities are on child elements), it may work fine in practice.
   - What's unclear: Whether any element directly on `<html>` or `<body>` uses `dark:` prefixed utilities.
   - Recommendation: Fix it anyway during Phase 4. Changing `&:is(.dark *)` to `&:where(.dark, .dark *)` is a one-line fix that aligns with official Tailwind v4 docs and avoids future bugs.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js 22+ | Astro 6 dev server | ✓ | 24.0.0 | — |
| solid-js | SolidJS islands | ✓ (installed) | 1.9.12 | — |
| @astrojs/solid-js | Island hydration | ✓ (installed) | 6.0.1 | — |
| lucide-solid | Toggle/menu icons | ✓ (installed) | 0.577.0 | Inline SVG |
| @kobalte/core | Mobile menu (optional) | ✗ (not installed) | 0.13.11 latest | Hand-rolled SolidJS |
| Tailwind CSS v4 | Dark mode class variant | ✓ (installed) | 4.2.2 | — |

**Missing dependencies with no fallback:** None — @kobalte/core has a viable hand-rolled fallback.

**Missing dependencies with fallback:**
- @kobalte/core: Not installed. Viable fallback is hand-rolled MobileMenu with `createSignal`. No install needed if hand-rolled approach is chosen (recommended).

## Sources

### Primary (HIGH confidence)
- [Astro Template Directives Reference](https://docs.astro.build/en/reference/directives-reference/) — all client: directive semantics verified
- [Astro @astrojs/solid-js integration](https://docs.astro.build/en/guides/integrations-guide/solid-js/) — SSR behavior, client:only notes
- [Tailwind CSS v4 Dark Mode](https://tailwindcss.com/docs/dark-mode) — `@custom-variant dark` syntax confirmed as `(&:where(.dark, .dark *))`
- [Kobalte Dialog API](https://kobalte.dev/docs/core/components/dialog/) — Dialog.Root/Trigger/Portal/Overlay/Content/CloseButton API
- npm registry: @kobalte/core 0.13.11 (confirmed latest)

### Secondary (MEDIUM confidence)
- [danielnewton.dev FOUC prevention](https://www.danielnewton.dev/blog/dark-mode-astro-tailwind-fouc/) — inline script pattern verified against Astro tutorial
- [sujalvanjare.com Tailwind v4 dark class fix](https://www.sujalvanjare.com/blog/fix-dark-class-not-applying-tailwind-css-v4) — corroborates `:where()` vs `:is()` distinction
- [SolidJS isServer discussion](https://github.com/solidjs/solid/discussions/1158) — SSR guard patterns for localStorage

### Tertiary (LOW confidence)
- [corvu.dev Drawer primitive](https://corvu.dev/docs/primitives/drawer/) — alternative SolidJS drawer library (not recommended for this use case)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages already installed except @kobalte/core; versions confirmed
- Architecture: HIGH — Astro client: directives, FOUC inline script, and SolidJS signal patterns verified with official docs
- Pitfalls: HIGH — FOUC pitfall, SSR build-time pitfall, and @custom-variant mismatch all verified with official sources

**Research date:** 2026-03-27
**Valid until:** 2026-09-27 (stable APIs; re-check if @kobalte/core reaches 1.0 or Tailwind v5 is released)
