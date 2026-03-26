# SciSpark Landing Page

## Project

New landing page for SciSpark — an AI-driven clinical evidence assistant for healthcare professionals. Built from scratch (not a retrofit of the old site at `~/Documents/sci-spark-discover-2`).

**Repo:** https://github.com/SciSpark-ai/scispark-landing.git

## Tech Stack

- **Framework:** Next.js 16 (App Router, SSG)
- **Styling:** Tailwind CSS v4 (CSS-based config via `@theme` blocks in globals.css, NOT tailwind.config.ts)
- **Components:** shadcn/ui (Button, Input, Accordion)
- **Animation:** Framer Motion (Bind/Claura-inspired scroll reveals, per-word blur, stat counters)
- **i18n:** next-intl (EN + ZH, cookie-based locale switching, no URL path prefix)
- **Backend:** Supabase (waitlist email collection, reuses project from old site)
- **Fonts:** Halant (Google Fonts, headings) + Geist (body)

## Design References

- `docs/claura-reference-tokens.md` — PRIMARY visual reference (warm cream/brown palette, Halant font, editorial warmth)
- `docs/bind-reference-tokens.md` — Layout/animation reference (scroll reveals, easing curves, browser mockup)
- `docs/specs/2026-03-24-landing-page-design.md` — Full design spec

## Key Architecture Decisions

- **All light backgrounds** — no dark sections. Dark mode deferred to later.
- **Tailwind v4** — colors/fonts/radii defined as CSS custom properties in globals.css `@theme inline` block, not in a JS config file.
- **Interactive product showcase** — Evidence feed uses a stacked card deck with hover-to-surface, drag-swipe, and auto-play. Paper Digest is showcased in a dedicated section with a static browser mockup.
- **AI agent reasoning animation** — ChatMockup auto-plays a 5-phase sequence (search → screen → extract → synthesize → answer) when scrolled into view.
- **Supabase credentials** — stored in `.env.local` (gitignored), copied from `~/Documents/sci-spark-discover-2/.env`.

## Page Sections (scroll order)

1. Navigation (fixed, glassmorphism)
2. Hero (word reveal + browser mockup + email capture)
3. Problem Statement (animated stat cards)
4. Product Showcase: Evidence Feed (card stack) → Paper Digest Showcase → Flywheel Divider → AI Agent → Intelligence Layer
5. How It Works (3 steps)
6. Use Cases (3 personas)
7. FAQ (accordion)
8. Final CTA (email capture)
9. Footer

## Commands

```bash
npm run dev    # Start dev server
npm run build  # Production build (SSG)
```
