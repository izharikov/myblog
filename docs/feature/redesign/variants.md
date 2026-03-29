# Design Variants

Minimal base with 1-2 contrast accents. Pick one from each section.

---

## Font Pairings

### A. Geist (current)
- Headings: **Geist Variable** (500/700)
- Body: **Geist Variable** (400)
- Code: **Geist Mono Variable**
- Vibe: Clean, modern, neutral. Already installed — zero cost.

### B. Inter + JetBrains Mono
- Headings: **Inter Variable** (600/700)
- Body: **Inter Variable** (400)
- Code: **JetBrains Mono Variable**
- Vibe: Industry standard for tech. Excellent readability at small sizes. Wider than Geist.

### C. Bricolage Grotesque + Geist Mono
- Headings: **Bricolage Grotesque Variable** (600/700)
- Body: **Geist Variable** (400)
- Code: **Geist Mono Variable**
- Vibe: Distinctive headings with personality, clean body text. The contrast IS the heading font.

### D. Space Grotesk + IBM Plex Mono
- Headings: **Space Grotesk Variable** (500/700)
- Body: **Space Grotesk Variable** (400)
- Code: **IBM Plex Mono**
- Vibe: Geometric, techy but warm. Slightly quirky letterforms add character.

### E. Outfit + Fira Code
- Headings: **Outfit Variable** (600/700)
- Body: **Outfit Variable** (400)
- Code: **Fira Code Variable**
- Vibe: Soft geometric sans. Fira Code brings ligatures for code blocks.

---

## Color Schemes

All use oklch. Minimal neutral base + 1-2 accent colors.

### 1. Ink & Blue
Neutral grayscale with a single blue accent. Classic tech blog.

```css
/* Light */
--color-surface:        oklch(0.99 0 0);
--color-surface-alt:    oklch(0.96 0 0);
--color-text-primary:   oklch(0.13 0 0);
--color-text-secondary: oklch(0.44 0 0);
--color-accent:         oklch(0.55 0.18 250);
--color-accent-hover:   oklch(0.48 0.18 250);
--color-border:         oklch(0.90 0 0);
--color-code-bg:        oklch(0.96 0.005 250);

/* Dark */
--color-surface:        oklch(0.12 0 0);
--color-surface-alt:    oklch(0.16 0 0);
--color-text-primary:   oklch(0.93 0 0);
--color-text-secondary: oklch(0.63 0 0);
--color-accent:         oklch(0.68 0.16 250);
--color-accent-hover:   oklch(0.75 0.16 250);
--color-border:         oklch(0.24 0 0);
--color-code-bg:        oklch(0.17 0.005 250);
```

### 2. Warm Charcoal & Amber
Warm neutrals with amber/orange accent. Feels editorial.

```css
/* Light */
--color-surface:        oklch(0.98 0.005 80);
--color-surface-alt:    oklch(0.95 0.008 80);
--color-text-primary:   oklch(0.18 0.01 60);
--color-text-secondary: oklch(0.45 0.01 60);
--color-accent:         oklch(0.62 0.18 55);
--color-accent-hover:   oklch(0.55 0.18 55);
--color-border:         oklch(0.88 0.01 80);
--color-code-bg:        oklch(0.95 0.01 80);

/* Dark */
--color-surface:        oklch(0.14 0.01 60);
--color-surface-alt:    oklch(0.18 0.01 60);
--color-text-primary:   oklch(0.92 0.005 80);
--color-text-secondary: oklch(0.62 0.01 60);
--color-accent:         oklch(0.72 0.16 55);
--color-accent-hover:   oklch(0.78 0.16 55);
--color-border:         oklch(0.26 0.01 60);
--color-code-bg:        oklch(0.19 0.01 55);
```

### 3. Stone & Emerald
Cool stone gray base with green accent. Calm, focused.

```css
/* Light */
--color-surface:        oklch(0.98 0.003 150);
--color-surface-alt:    oklch(0.95 0.005 150);
--color-text-primary:   oklch(0.15 0.005 150);
--color-text-secondary: oklch(0.45 0.01 150);
--color-accent:         oklch(0.55 0.15 160);
--color-accent-hover:   oklch(0.48 0.15 160);
--color-border:         oklch(0.89 0.005 150);
--color-code-bg:        oklch(0.95 0.008 160);

/* Dark */
--color-surface:        oklch(0.13 0.005 150);
--color-surface-alt:    oklch(0.17 0.008 150);
--color-text-primary:   oklch(0.92 0.003 150);
--color-text-secondary: oklch(0.62 0.008 150);
--color-accent:         oklch(0.68 0.14 160);
--color-accent-hover:   oklch(0.74 0.14 160);
--color-border:         oklch(0.25 0.005 150);
--color-code-bg:        oklch(0.18 0.008 160);
```

### 4. Pure Mono & Violet
True black/white with a single violet pop. Maximum contrast, minimal.

```css
/* Light */
--color-surface:        oklch(1.0 0 0);
--color-surface-alt:    oklch(0.96 0 0);
--color-text-primary:   oklch(0.0 0 0);
--color-text-secondary: oklch(0.40 0 0);
--color-accent:         oklch(0.55 0.20 290);
--color-accent-hover:   oklch(0.48 0.22 290);
--color-border:         oklch(0.88 0 0);
--color-code-bg:        oklch(0.96 0.008 290);

/* Dark */
--color-surface:        oklch(0.08 0 0);
--color-surface-alt:    oklch(0.13 0 0);
--color-text-primary:   oklch(1.0 0 0);
--color-text-secondary: oklch(0.60 0 0);
--color-accent:         oklch(0.70 0.18 290);
--color-accent-hover:   oklch(0.76 0.18 290);
--color-border:         oklch(0.22 0 0);
--color-code-bg:        oklch(0.13 0.008 290);
```

### 5. Zinc & Coral
Cool zinc neutrals with warm coral dual-accent. Two-tone contrast.

```css
/* Light */
--color-surface:        oklch(0.99 0 0);
--color-surface-alt:    oklch(0.96 0.003 260);
--color-text-primary:   oklch(0.18 0.01 260);
--color-text-secondary: oklch(0.45 0.01 260);
--color-accent:         oklch(0.62 0.19 18);
--color-accent-hover:   oklch(0.55 0.20 18);
--color-accent-2:       oklch(0.55 0.14 260);
--color-border:         oklch(0.89 0.005 260);
--color-code-bg:        oklch(0.96 0.005 260);

/* Dark */
--color-surface:        oklch(0.12 0.008 260);
--color-surface-alt:    oklch(0.16 0.01 260);
--color-text-primary:   oklch(0.93 0.003 260);
--color-text-secondary: oklch(0.62 0.008 260);
--color-accent:         oklch(0.72 0.17 18);
--color-accent-hover:   oklch(0.78 0.17 18);
--color-accent-2:       oklch(0.68 0.12 260);
--color-border:         oklch(0.24 0.008 260);
--color-code-bg:        oklch(0.17 0.008 260);
```

---

## Recommended Combos

| Combo | Fonts | Colors | Character |
|-------|-------|--------|-----------|
| **Safe** | A (Geist) | 1 (Ink & Blue) | Clean, professional, zero risk |
| **Editorial** | C (Bricolage + Geist) | 2 (Warm Charcoal & Amber) | Distinctive, warm personality |
| **Techy** | D (Space Grotesk + IBM Plex) | 3 (Stone & Emerald) | Developer-focused, calm |
| **Bold** | A (Geist) | 4 (Pure Mono & Violet) | High contrast, modern |
| **Expressive** | E (Outfit + Fira) | 5 (Zinc & Coral) | Two-tone, stands out |
