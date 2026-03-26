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
- Nav arrow buttons centered below the stack — circular, subtle border, `‹` / `›` icons with `aria-label="Previous card"` / `aria-label="Next card"` and visible focus rings
- Stack container: min-height ~400px, card width stays at 320px. Container must account for rotated cards extending beyond card width (~380px effective width with rotation offsets)

### Interaction

| Trigger | Behavior |
|---------|----------|
| **Hover** | Moving cursor over a partially-visible back card animates it to the top of the stack |
| **Arrow buttons** | `‹` / `›` buttons below the stack cycle through cards. Keyboard-focusable with visible focus rings |
| **Drag-swipe** | Touch/mouse drag to swipe the top card away, revealing the next (mobile-friendly) |
| **Auto-play** | Stack auto-rotates every ~4s when idle. Pauses on hover/touch. Resumes after ~3s of inactivity. **Disabled when `prefers-reduced-motion` is set.** |
| **Keyboard** | Arrow buttons are focusable via Tab. Left/Right arrow keys also cycle when the stack container has focus |
| **Click** | No click-to-digest — top card is not clickable |

### Layout

Stays 2-column: text + bullet points on left, card stack on right.

**Left column i18n updates:** `showcase.feed.desc3` currently says "Click any card for a full paper digest" — update to describe the card stack interaction instead. Remove the `showcase.feed.digestTooltip` key (dead code).

### Animation Details

- **Card-to-top transitions (hover, arrow cycle):** Use Framer Motion spring physics — `type: "spring", stiffness: 300, damping: 30`
- **Scroll-reveal entrance:** Use tween with existing `EASE_CARD` (`[0.22, 1, 0.36, 1]`), 500ms, matching site conventions
- Cards transition `x`, `y`, `rotate`, and `boxShadow` simultaneously
- `zIndex` is set discretely (not animated) — update immediately when a card moves to a new stack position, before the positional animation begins

### Mobile / Responsive

- On mobile (`< lg` breakpoint, single column), the stack renders full-width centered below the text
- Card width shrinks to `w-[280px]` on mobile, rotation offsets decrease to ~60% of desktop values
- Stack container min-height: ~340px on mobile
- Drag-swipe is the primary interaction on touch devices; hover behavior is naturally absent
- Arrow buttons remain visible on mobile

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

### Scroll-Reveal Animation

Uses the same entrance pattern as EvidenceFeed: left column slides in from left (`x: -148`), right column from right (`x: 148`), both with `EASE_CARD` easing and `whileInView` trigger.

### Right Column — Browser Mockup

A static browser-window frame (macOS traffic lights, like the hero's BrowserMockup) containing a styled representation of the Paper Digest UI:

- Specialty color header bar
- Paper title + journal/date
- AI Summary block with Lay Summary / Original Abstract tab pills
- Key Breakpoints numbered list (1, 2, 3)
- Floating "Ask AI about this paper" button at the bottom

This is a **static mockup**, not interactive. Uses hardcoded content from the Stanford TMS paper (samplePapers[0]).

### Component Architecture

- New file: `src/components/sections/product-showcase/DigestShowcase.tsx`
- Reuses the BrowserMockup frame pattern from `src/components/sections/BrowserMockup.tsx`
- Does NOT reuse the PaperDigest modal component (that's an overlay with close/back buttons — wrong context)
- Renders digest-like content inline within the browser frame
- Added to `ProductShowcase` index between `EvidenceFeed` and `FlyWheelDivider`

### i18n Keys

```json
{
  "showcase": {
    "digest": {
      "headline": "Open any paper. Get the full picture in seconds.",
      "desc1": "AI-generated lay summary and original abstract toggle",
      "desc2": "Structured key breakpoints: research question, data, and results",
      "desc3": "Ask AI follow-up questions — answered in context with citations",
      "desc4": "Figure digest with key charts and tables from the paper"
    }
  }
}
```

Chinese translations (`zh.json`) to be added with equivalent keys under `showcase.digest`.

---

## 4. Cleanup

- Remove `selectedPaper` state and `AnimatePresence` / `PaperDigest` modal overlay from `EvidenceFeed.tsx`
- Remove `onCardClick` prop from PaperCard; remove `cursor-pointer` class; remove `showTooltip` prop and tooltip markup; remove the existing `whileHover={{ y: -4 }}` (the stack manages its own hover behavior)
- `PaperDigest.tsx` can remain in the codebase (may be useful later) but is no longer imported by EvidenceFeed
- Update `showcase.feed.desc3` in `en.json` and `zh.json` — no longer references clicking cards
- Remove `showcase.feed.digestTooltip` key from both locale files
- Update `CLAUDE.md`: remove "Paper cards in the feed are clickable; they expand into a digest view" from Key Architecture Decisions; add Paper Digest Showcase to Page Sections list

---

## 5. Files Changed

| File | Action |
|------|--------|
| `src/components/sections/product-showcase/EvidenceFeed.tsx` | Major rewrite — replace horizontal scroll with card stack, remove digest modal |
| `src/components/sections/product-showcase/PaperCard.tsx` | Remove `onCardClick`, `showTooltip`, `cursor-pointer`, tooltip markup, `whileHover` lift |
| `src/components/sections/product-showcase/DigestShowcase.tsx` | **New** — Paper Digest showcase section |
| `src/components/sections/product-showcase/index.tsx` | Add DigestShowcase between EvidenceFeed and FlyWheelDivider |
| `messages/en.json` | Add `showcase.digest.*` keys, update `showcase.feed.desc3`, remove `showcase.feed.digestTooltip` |
| `messages/zh.json` | Same i18n changes as en.json |
| `CLAUDE.md` | Update Key Architecture Decisions and Page Sections |

---

## 6. Data

Uses existing `samplePapers` from `paper-data.ts`. No new data needed. The digest mockup uses hardcoded content from one sample paper.
