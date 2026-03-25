# Claura (claura.framer.ai) — Extracted Design Tokens

Extracted from source code on 2026-03-24. PRIMARY visual reference for SciSpark.

## Fonts (Exact)

| Role | Font | Source | Weights |
|------|------|--------|---------|
| **Headings** | **Halant** | FontShare (free) | 400 (regular), 700 (bold) |
| **Body** | **Geist** | Google Fonts | 400, 500, 700 |
| **Utility** | Inter | Framer default | 400, 700, 900 |

## Typography Scale

| Element | Font | Size (Desktop) | Size (Tablet) | Size (Mobile) | Weight | Letter-spacing | Line-height |
|---------|------|----------------|---------------|----------------|--------|----------------|-------------|
| H1 hero | Halant | 70px | 56px | 48px | 400 | -0.07em | 110% |
| H2 section | Halant | 56px | 56px | 48px | 400 | -0.06em | 110% |
| H3 card | Halant | 32px | — | — | 400 | -0.05em | 110% |
| H2 testimonial | Halant | 48px | 36px | 32px | 400 | -0.06em | 110% |
| Body large | Geist | 20px | 18px | 16px | 400 | -0.05em | 150% |
| Body | Geist | 16px | 16px | 16px | 400 | -0.04em | 150% |
| Body medium | Geist | 20px | 16px | 18px | 500 | -0.05em | 150% |
| Small | Geist | 14px | — | — | 500 | -0.04em | 150% |
| Tiny | Geist | 12px | — | — | 500 | -0.04em | 150% |

**Note:** Bold text in headings uses Inter 900 (not Halant bold). Italic heading text uses Inter 700 italic.

## Color Tokens (Exact)

| Token Name | Hex | RGB | Usage |
|-----------|-----|-----|-------|
| Page background | `#fcf6ef` | rgb(252, 246, 239) | Root body background |
| Section warm bg | `#f6f0e9` | rgb(246, 240, 233) | Hero, How We Work, FAQ sections |
| Card surface | `#efe7dd` | rgb(239, 231, 221) | Cards, stat cards, input backgrounds |
| Light surface | `#faf6f2` | rgb(250, 246, 242) | Badges, light elements, number circles |
| CTA page bg | `#fcf6ef` | rgb(252, 246, 239) | Same as page bg |
| Primary dark (espresso) | `#2b180a` | rgb(43, 24, 10) | Headings, button bg, primary text |
| Secondary dark | `#3e2407` | rgb(62, 36, 7) | Alt dark text |
| Muted text | `#94877c` | rgb(148, 135, 124) | Body text, descriptions, de-emphasized heading words |
| Warm tan accent | `#dab697` | rgb(218, 182, 151) | Stars, decorative accents |
| Border warm | `#e8d3c0` | rgb(232, 211, 192) | Selection highlight color |
| White | `#fff` | rgb(255, 255, 255) | Text on dark backgrounds |
| White 90% | `#ffffffe6` | rgba(255,255,255,0.9) | Testimonial body text |
| White 80% | `#fffc` | rgba(255,255,255,0.8) | Team role text overlay |
| White 48% | `#ffffff52` | rgba(255,255,255,0.32) | Stat card glassmorphism bg |

## Spacing & Layout

| Element | Value |
|---------|-------|
| Container width | 1200px |
| Max content width | 1072px |
| Section padding (desktop) | 80px 64px |
| Section padding (tablet) | 80px 32px |
| Section padding (mobile) | 80px 24px |
| Hero padding top | 160px (desktop), 120px (tablet/mobile) |
| Section gap | 64px |
| Card border-radius | 28px |
| Badge border-radius | 8px |
| Button border-radius | 12px |
| Submit button radius | 50px (full pill) |
| Number circle radius | 50px |
| FAQ card radius | 16px |
| Image border-radius | 28px |
| Input border-radius | 12px |

## Animation (from appear data)

### Preloader (logo reveal)
```
initial: { opacity: 0.001, y: 560 }
animate: { opacity: 1, y: 0 }
transition: { delay: 0, duration: 2.1, ease: [0.56, 0.22, 0.05, 0.99] }
Per-letter: blur(10px), y: 80 → blur(0), y: 0
```

### Hero elements (staggered)
```
initial: { opacity: 0.001, y: 170 }
animate: { opacity: 1, y: 0 }
transition: { type: "spring", damping: 27, mass: 0.3, stiffness: 121 }
Delays: star rating 2.2s, headline 2.3s, subhead 2.4s, buttons 2.5s
```

### Hero per-word blur reveal
```
Each word: initial blur(10px), y: 10 → blur(0), y: 0
```

### Hero image (saturated flower)
```
initial: { opacity: 0.001, scale: 1.5 }
animate: { opacity: 1, scale: 1 }
transition: { delay: 2.6, duration: 1.1, ease: [0.44, 0, 0.56, 1] }
```

### Scroll reveals
```
Standard: { opacity: 0, y: 80 } → { opacity: 1, y: 0 }
Side slides: { opacity: 0, x: ±30 } → { opacity: 1, x: 0 }
```

## Key Design Patterns

- **Keyword de-emphasis:** Headings have select words colored `#94877c` (muted) while key words stay `#2b180a` (dark). Example: "The AI agency built for *you.*" where "you." is muted.
- **Dark brown buttons:** `#2b180a` (NOT black) — warm espresso tone
- **Button hover:** Double-label blur/slide technique (same as Bind but with blur: 5px)
- **Glassmorphism stat cards:** `backdrop-filter: blur(24px)` with `rgba(255,255,255,0.32)` bg over dreamy imagery
- **Image treatment:** `filter: saturate(1.75)` on hero/CTA images for rich, warm color
- **Vertical timeline:** SVG stroke-dasharray animated line connecting numbered steps
- **Section badges:** `backdrop-filter: blur(32px)` on `#efe7dd` background, 8px radius
- **FAQ items:** 16px border-radius cards on `#f6f0e9` background
- **Selection color:** Custom selection with `#e8d3c0` background, `#2b180a` text
