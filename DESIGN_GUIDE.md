# Orchia — Design & Style Guide

*Derived from the Orchia Studio website. A portable system for building sibling products (apps, dashboards, marketing, decks) that feel unmistakably "Orchia."*

## 1. Design philosophy

**"Editorial print meets technical spec sheet."** Every surface should read like a well-set magazine page that an engineer annotated. Three forces are always in tension and balance:

| Force | Expression |
|---|---|
| **Editorial / warm** | Serif display type, linen-paper background, italic emphasis, drop caps, generous whitespace |
| **Technical / precise** | Monospace labels, architectural corner ticks, dashed gutters, numbered lists, crisp 3–4px rectangles |
| **Premium / tactile** | Frosted glass, film-grain texture, layered warm shadows, deceleration motion |

Voice keywords from the site: *disciplined execution, operational depth, long-term scalability, carefully applied advanced technology.* The design should feel **calm, confident, and crafted — never loud, neon, or "techy-default."**

## 2. Color

Warm, paper-based light theme with a deep "ink" counterpart for contrast moments. Gold is the only chromatic accent; coral/violet appear **only** as tiny pops in the brand mark.

```css
/* Base — warm linen */
--bg:              #F5F0E8;   /* page background, never pure white */
--surface:         rgba(253, 250, 244, 0.86);  /* glass cards */
--surface-solid:   #FDFAF4;   /* inputs, opaque cards */
--surface-variant: #EDE8DF;   /* recessed/inset fills */
--border:          rgba(30, 24, 18, 0.09);  /* hairline */
--border-strong:   rgba(30, 24, 18, 0.16);

/* Ink — inverted / "proof" sections */
--ink:             #1A140C;
--ink-soft:        #221A10;
--ink-surface:     #2A2015;
--ink-text:        #EDE1CA;
--ink-text-muted:  #9F927B;

/* Text */
--text-strong:     #1A1612;
--text:            #3D3730;
--text-muted:      #7A736B;

/* Accent — warm gold spectrum (the ONLY accent) */
--accent:          #8B6914;   /* labels, rules, links */
--accent-bright:   #C49A3C;   /* on dark, glows */
--accent-container:#F5E9C8;   /* focus rings, active chips */

/* Brand-mark pops only — do not use in UI chrome */
--pop-coral:  #E85D75;
--pop-violet: #A78BFA;
```

**Rules**
- Background is **linen `#F5F0E8`, never `#FFF`**. White only appears inside device mockups.
- Gold is for accents, emphasis, and rules — **not** large fills. Italic serif emphasis is always `--accent`.
- Use the **ink palette for one or two "interlude" sections** (proof, stats, CTA) to create rhythm — dark blocks with gold radial glows and a dotted grid.

## 3. Typography

Four families, each with one job. Always size display type with `clamp()` for fluid scaling.

| Role | Family | Weight | Treatment |
|---|---|---|---|
| **Wordmark** | Josefin Sans | 100 (thin) | Near-normal case, `letter-spacing: 0.02em` |
| **Display / headings** | Cormorant Garamond | 300 | Tight tracking `-0.015→-0.03em`, line-height `~1.0`; *italic in gold* for emphasis |
| **Body** | DM Sans | 400–600 | line-height `1.55–1.72`, max ~36–62ch measure |
| **Labels / meta** | IBM Plex Mono | 500 | UPPERCASE, tracking `0.08–0.2em`, `0.66–0.72rem`, muted color |

```
H1   clamp(2.4rem, 8vw, 7rem)      H2  clamp(1.85rem, 5vw, 4.2rem)
Lede 1.08rem / 1.65                Mono label 0.68rem / 0.14em / uppercase
```

**Signature type moves**
- **Italic gold emphasis** inside serif headings (`<em>` → italic, `--accent`, weight 400).
- **Drop cap** on opening body paragraphs: italic gold Cormorant, floated, ~2.4rem.
- **Mono carets** prefix labels: `◊` `→` `·` `—` in gold.

```css
--heading: 'Cormorant Garamond', serif;
--body:    'DM Sans', sans-serif;
--mono:    'IBM Plex Mono', ui-monospace, monospace;
/* Wordmark: 'Josefin Sans', sans-serif; weight 100 */
```

## 4. Spacing, layout & grid

- **Content max-width: `1120px`**, centered; shell padding `130px 32px 100px`.
- **Section rhythm: `~96px`** vertical gap between major blocks. Don't crowd.
- **Card padding: `44–64px`** on desktop.
- Favor **editorial asymmetry** — e.g. `7fr / 3fr` text-vs-specimen spreads with a 1px gradient "gutter" hairline between columns.
- Breakpoints: `900 / 768 / 720 / 640 / 540`. Collapse multi-column to single, drop gutters, switch to bottom nav on mobile.

## 5. Shape & elevation

**Radius is bimodal** — soft for containers, crisp for "technical" elements. This contrast is intentional; keep it.

| Token | Use |
|---|---|
| `999px` | Buttons, pills, chips, topbar |
| `28–32px` | Hero/large panels, CTA |
| `20–24px` | Standard cards, metric cards |
| `14–18px` | Inputs, inset stages |
| `3–4px` | Spec links, tags, "blueprint" rectangles, mock UI |

```css
--shadow-card:  0 1px 3px rgba(26,22,18,.04);
--shadow-float: 0 2px 8px rgba(26,22,18,.04), 0 12px 40px rgba(26,22,18,.07);
--shadow-deep:  0 32px 80px rgba(12,8,4,.45), 0 8px 24px rgba(12,8,4,.22); /* dark sections */
```

Glass surfaces: `background: var(--surface); backdrop-filter: blur(20–32px) saturate(1.4); border: 1px solid var(--border);`

## 6. Signature motifs — the "Orchia DNA"

These are what make it recognizable. Use them deliberately; one or two per view, not all at once.

1. **Architectural corner ticks** — 1px L-shaped marks (gold, ~0.55 opacity, ~14–18px) at panel corners, like crop/registration marks.
2. **Dashed hairline dividers** — `1px dashed var(--border)` for meta rows and section breaks.
3. **Mono metadata rows** — uppercase mono label left, value/index right, separated by a dashed rule.
4. **Frosted glass + film grain** — translucent panels over a fixed `feTurbulence` noise overlay (`opacity 0.035`, `mix-blend-mode: multiply`).
5. **Numbered/indexed everything** — mono numerals (`01`, `S/04`) on cards, steps, list items.
6. **Dark "ink" interludes** — dotted-grid background + gold radial glows for proof/stat sections.
7. **Kinetic marquee** — slow italic-serif scrolling band with gold dot separators, edge-faded.
8. **Hover rules that grow** — a 1px gold line that animates from 0 → full width on card/row hover.

## 7. Motion

- **Signature easing: `cubic-bezier(0.2, 0, 0, 1)`** (sharp decelerate). Use it for nearly everything.
- **Entrance:** `emerge` = fade in + rise `translateY(14px → 0)`, staggered 0.05–0.4s.
- **Hover:** lift `translateY(-2px)`, grow underline rules, button shimmer sweep, icon nudge `translateX(3px)`.
- Durations: micro `0.2s`, standard `0.3–0.6s`, ambient `0.8s+`. Respect `prefers-reduced-motion`.

```css
@keyframes emerge {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

## 8. Core components

**Primary button** — dark ink gradient pill, cream-gold text, light shimmer sweep on hover, lifts `-2px`:
```css
background: linear-gradient(150deg, #1A140C 0%, #2E2014 100%);
color: #F5E9C8; border-radius: 999px; padding: 15px 22px 15px 26px;
```
**Text link** — `--text-muted` → `--text-strong` on hover, trailing arrow.
**Spec/download link** — mono uppercase, 1px bordered 4px rectangle, gold text, fills `--accent-container` on hover.
**Pills / chips** — `999px`, `--surface-variant` fill (tech) or hairline-bordered translucent (tags).
**Inputs** — `--surface-solid`, 14px radius, gold focus ring `box-shadow: 0 0 0 3px var(--accent-container)`.
**Footer colophon** — oversized thin Josefin wordmark (up to `14rem`, ~0.88 opacity) over a dashed meta row.

## 9. Brand mark

A circular emblem: concentric/rotated ellipses forming an **orchid bloom rendered as orbital line-work**, in gold (`#C9971F` / `#9B6A09`) on white, with a few tiny coral/violet/white "stamen" dots. Wordmark set in **Josefin Sans Thin (100)** with a smaller, wide-tracked suffix. Keep the mark airy (~0.9 opacity), never recolor the gold core.

## 10. Quick do / don't

| ✅ Do | ❌ Don't |
|---|---|
| Linen background, gold accents | Pure-white pages, neon/multi-color accents |
| Serif display + mono labels pairing | All-sans, generic system-font UI |
| Corner ticks, dashed rules, numbering | Heavy drop shadows, glossy gradients |
| One gold accent + ink for contrast | Coral/violet in UI chrome |
| Decelerate easing, subtle rise-in | Bouncy/springy or linear motion |
| Crisp 3–4px on technical bits | Rounding everything uniformly |
