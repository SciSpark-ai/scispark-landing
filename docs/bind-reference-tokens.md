# Bind Framer Template — Extracted Design Tokens & Animation Reference

Extracted from bind.framer.ai source code on 2026-03-24.
Use as reference for SciSpark landing page implementation. Adapt to our warm palette.

## Color Tokens

| Token | Bind Value | SciSpark Equivalent |
|-------|-----------|-------------------|
| Page background | `#f0f0f0` | `#fffbf5` (warm ivory) |
| Card surface | `#fff` | `#fff` |
| Card border | `0 0 0 1px rgba(0,0,0,0.04)` | Same |
| Input/badge bg | `#e8e8e8` | `#f5ebe0` (warm) |
| Light surface | `#f7f7f5` | `#fffbf5` |
| Primary text | `#000` | `#292524` (warm black) |
| Muted text | `rgba(0,0,0,0.7)` | `#78716c` (warm gray) |
| Accent color | `#007cff` (blue) | `#f97316` (orange) |
| Primary button bg | `#000` | `#f97316` |

## Typography

| Element | Bind | SciSpark |
|---------|------|----------|
| Font family | Inter | DM Serif Display (headings) + DM Sans (body) |
| H1 size | 64px | 64px |
| H1 weight | 500 | 700 |
| H1 letter-spacing | -0.06em | -0.04em |
| H1 line-height | 1.1em | 1.1em |
| H2 size | 48px | 48px |
| H2 weight | 500 | 700 |
| H2 letter-spacing | -0.06em | -0.04em |
| H4 size | 22px | 22px |
| Body size | 16px | 16px |
| Body weight | 500 | 400 |
| Body letter-spacing | -0.03em | -0.02em |
| Body line-height | 150% | 150% |
| Small text | 14px | 14px |
| Tiny labels | 10-12px | 10-12px |

## Spacing & Layout

| Element | Value |
|---------|-------|
| Container max-width | 1075px |
| Outer width | 1200px |
| Section padding (desktop) | 80px 64px |
| Section padding (tablet) | 80px 32px |
| Section padding (mobile) | 64px 24px |
| Hero padding top | 140px |
| Section gap | 48px |
| Card grid gap | 24px |
| Card padding | 24px-32px |
| Card border-radius | 12px |
| Badge border-radius | 40px |
| Button border-radius | 125px |
| Input border-radius | 4-8px |

## Breakpoints

| Name | Query |
|------|-------|
| Desktop | min-width: 1200px |
| Tablet | min-width: 810px, max-width: 1199.98px |
| Mobile | max-width: 809.98px |

## Animation — Hero Sequence

### Badge, headline, subhead, buttons
```
initial: { opacity: 0.001, y: 40, scale: 0.9 }
animate: { opacity: 1, y: 0, scale: 1 }
transition: { delay: 1.0, duration: 1.5, ease: [0.55, 0, 0, 1] }
```

### Per-word text reveal (headline & subhead)
```
Each word wrapped in inline-block span:
initial: { opacity: 0.001, filter: blur(6px), y: 50 }
animate: { opacity: 1, filter: blur(0), y: 0 }
Staggered per word
```

### Browser mockup (chat window)
```
initial: { opacity: 1, y: 95, scale: 1.4 }
animate: { opacity: 1, y: 0, scale: 1 }
transition: { delay: 0.95, duration: 1.3, ease: [0.68, 0, 0, 0.99] }
```

## Animation — Scroll Reveals

### Standard section content
```
initial: { opacity: 0, y: 148 }
animate: { opacity: 1, y: 0 }
(triggered on scroll into viewport)
```

### Side-by-side layouts (left content)
```
initial: { opacity: 0, x: -148 }
animate: { opacity: 1, x: 0 }
```

### Side-by-side layouts (right content)
```
initial: { opacity: 0, x: 148 }
animate: { opacity: 1, x: 0 }
```

### FAQ items
```
initial: { opacity: 0, y: 80 }
animate: { opacity: 1, y: 0 }
(shorter distance for smaller elements)
```

## Navigation
- Sticky/fixed position at top
- `backdrop-filter: blur(5px)`
- Background: `rgba(242, 242, 242, 0.16)` (nearly transparent)
- Height: 65px
- Hamburger menu on mobile (<810px)

## Button Hover Effect
Bind uses a clever double-label technique:
- Two copies of the button label stacked
- On hover, the visible label slides up/out, the hidden one slides in from below
- Creates a smooth text-swap animation
- Both labels wrapped in overflow:hidden containers

## Card Shadows
- Default: `0 0 0 1px rgba(0,0,0,0.04)` (almost invisible border)
- No heavy box-shadows — very flat, clean
- Hover: slight lift with increased shadow (via CSS/Framer Motion)

## Marquee / Logo Ticker
- Uses CSS mask for edge fade: `linear-gradient(to right, transparent 0%, black 12.5%, black 87.5%, transparent 100%)`
- Items scroll via `translateX` transform
- Gap between items: 68px

## Chat Mockup Component
- macOS traffic lights: red `#fd5754`, yellow `#febb40`, green `#34c848`
- Each with 1px darker border
- 14px circles with 4px gap
- Chat bubble (AI): blue `#007cff`, pill shape with one squared corner
- Chat bubble (user): light gray `#f7f7f5`, same shape reversed
- Input bar: gray bg `#f7f7f5`, 8px border-radius, blinking cursor animation
- Send button: blue circle `#007cff` with white arrow icon
