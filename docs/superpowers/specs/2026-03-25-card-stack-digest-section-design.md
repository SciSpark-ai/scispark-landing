# Card Stack + Paper Digest Section — Design Spec

**Date:** 2026-03-25
**Status:** Approved for implementation

---

## 1. Overview

Two changes to the Product Showcase area:

1. **Evidence Feed** — Replace the horizontal scrollable row of PaperCards with an interactive stacked card deck
2. **New Paper Digest Showcase section** — A dedicated section after Evidence Feed showcasing the digest feature via a browser-window mockup

---

## 2. Evidence Feed — Card Stack Replacement

### Visual Design

- Cards stacked with slight rotation and positional offset
- 3–4 cards visible at once: top card centered (rotation 0°), back cards peek on left/right with slight rotation (roughly -8° to +5°)
- Warm beige card surfaces, `rounded-card` corners, consistent with existing PaperCard styling
- Nav arrow buttons centered below the stack — circular, subtle border, `‹` / `›` icons

### Interaction

| Trigger | Behavior |
|---------|----------|
| **Hover** | Moving cursor over a partially-visible back card animates it to the top of the stack (spring transition) |
| **Arrow buttons** | `‹` / `›` buttons below the stack cycle through cards |
| **Drag-swipe** | Touch/mouse drag to swipe the top card away, revealing the next (mobile-friendly) |
| **Auto-play** | Stack auto-rotates every ~4s when idle. Pauses on hover/touch. Resumes after ~3s of inactivity |
| **Click** | No click-to-digest — clicking a card does nothing (digest is showcased in its own section now) |

### Layout

Stays 2-column: text + bullet points on left, card stack on right. No changes to the left column content.

### Animation Details

- Use Framer Motion `animate` with spring physics for card transitions
- Cards transition position, rotation, z-index, and box-shadow simultaneously
- Easing: `[0.22, 1, 0.36, 1]` for consistency with existing site animations
- Duration: ~400ms for card-to-top transitions

---

## 3. New Paper Digest Showcase Section

### Position in Page

Between Evidence Feed and Flywheel Divider:

```
Evidence Feed (card stack)
  ↓
Paper Digest Showcase (NEW)
  ↓
Flywheel Divider
```

### Layout

Two-column, matching Evidence Feed pattern:

- **Left column:** Headline + feature bullet points
- **Right column:** Browser-window mockup of the Paper Digest UI

### Left Column Content

- **Headline:** e.g. "Open any paper. Get the full picture in seconds."
- **Bullets:**
  - AI-generated lay summary and original abstract toggle
  - Structured key breakpoints: research question, data & sample, key results
  - "Ask AI about this paper" — follow-up questions answered in context
  - Figure digest with key charts and tables (coming soon)

### Right Column — Browser Mockup

A static browser-window frame (macOS traffic lights, like the hero's BrowserMockup) containing a styled representation of the Paper Digest UI:

- Specialty color header bar
- Paper title + journal/date
- AI Summary block with Lay Summary / Original Abstract tab pills
- Key Breakpoints numbered list (1, 2, 3)
- Floating "Ask AI about this paper" button at the bottom

This is a **static mockup**, not interactive. Uses hardcoded content from one of the sample papers (e.g., the Stanford TMS paper).

### Component Architecture

- New file: `src/components/sections/product-showcase/DigestShowcase.tsx`
- Reuses the BrowserMockup frame pattern from `src/components/sections/BrowserMockup.tsx`
- Does NOT reuse the PaperDigest modal component (that's an overlay with close/back buttons — wrong context)
- Renders digest-like content inline within the browser frame
- Added to `ProductShowcase` index between `EvidenceFeed` and `FlyWheelDivider`

---

## 4. Cleanup

- Remove `selectedPaper` state and `AnimatePresence` / `PaperDigest` modal overlay from `EvidenceFeed.tsx`
- Remove `onCardClick` prop from PaperCard usage in the card stack
- `PaperDigest.tsx` can remain in the codebase (may be useful later) but is no longer imported by EvidenceFeed

---

## 5. Files Changed

| File | Action |
|------|--------|
| `src/components/sections/product-showcase/EvidenceFeed.tsx` | Major rewrite — replace horizontal scroll with card stack, remove digest modal |
| `src/components/sections/product-showcase/PaperCard.tsx` | Minor — remove `onCardClick` prop, adjust sizing for stack context |
| `src/components/sections/product-showcase/DigestShowcase.tsx` | **New** — Paper Digest showcase section |
| `src/components/sections/product-showcase/index.tsx` | Add DigestShowcase between EvidenceFeed and FlyWheelDivider |
| `messages/en.json` | Add i18n keys for DigestShowcase section |
| `messages/zh.json` | Add i18n keys for DigestShowcase section (Chinese) |

---

## 6. Data

Uses existing `samplePapers` from `paper-data.ts`. No new data needed. The digest mockup uses hardcoded content from one sample paper.
