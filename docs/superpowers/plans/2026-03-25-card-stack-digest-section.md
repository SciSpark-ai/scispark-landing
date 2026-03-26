# Card Stack + Paper Digest Showcase — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the horizontal scrollable paper card feed with an interactive stacked card deck, and add a new Paper Digest showcase section between Evidence Feed and Flywheel Divider.

**Architecture:** The card stack is a new `CardStack` component managing card order state, auto-play timer, hover-to-surface, and drag-swipe interactions via Framer Motion. PaperCard is simplified (remove click/tooltip). A new `DigestShowcase` section renders a static browser-mockup of the digest UI. Both are wired into the existing `ProductShowcase` composition.

**Tech Stack:** Next.js 16 (App Router), Framer Motion, Tailwind CSS v4, next-intl, TypeScript

**Spec:** `docs/superpowers/specs/2026-03-25-card-stack-digest-section-design.md`

---

### Task 1: Clean up PaperCard — remove click, tooltip, and hover lift

**Files:**
- Modify: `src/components/sections/product-showcase/PaperCard.tsx`

- [ ] **Step 1: Remove `onCardClick` and `showTooltip` props, tooltip markup, `cursor-pointer`, `whileHover`, and `onClick`**

Replace the entire file content with:

```tsx
"use client";
import { Star, Heart, Bookmark, Clock, MoreHorizontal } from "lucide-react";
import { GrainOverlay } from "@/components/GrainOverlay";
import type { PaperCardData } from "./paper-data";

interface PaperCardProps {
  paper: PaperCardData;
}

export function PaperCard({ paper }: PaperCardProps) {
  return (
    <div className="relative w-[320px] lg:w-[320px] bg-white rounded-card overflow-hidden border border-[#e8d3c0]/30">
      {/* Colored header bar */}
      <div
        className="h-12 relative flex items-center px-4"
        style={{ backgroundColor: paper.specialtyColor }}
      >
        <GrainOverlay intensity="heavy" />
        <span className="relative text-white/90 text-xs font-medium uppercase tracking-wider">
          {paper.specialty}
        </span>
      </div>

      {/* Card body */}
      <div className="p-5">
        {/* Badges row */}
        {paper.badges.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {paper.badges.map((badge) => (
              <span
                key={badge}
                className="text-[10px] font-medium px-2 py-0.5 rounded-badge bg-[#faf6f2] text-[#94877c] border border-[#e8d3c0]"
              >
                {badge}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="font-heading text-lg font-normal leading-[130%] text-[#2b180a] line-clamp-2 mb-2">
          {paper.title}
        </h3>

        {/* Journal + date */}
        <p className="text-xs text-[#94877c] mb-3">
          {paper.journal} &middot; {paper.date}
        </p>

        {/* TL;DR summary */}
        <p className="text-sm text-[#94877c] leading-[160%] line-clamp-3 mb-4">
          {paper.summary}
        </p>

        {/* Tag pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {paper.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2.5 py-0.5 rounded-pill bg-[#efe7dd] text-[#94877c]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Evidence stars + action icons */}
        <div className="flex items-center justify-between">
          {/* Stars */}
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < paper.evidenceRating ? "fill-[#dab697] text-[#dab697]" : "text-[#e8d3c0]"}
              />
            ))}
          </div>

          {/* Action icons */}
          <div className="flex items-center gap-2 text-[#94877c]">
            <button aria-label="Like" className="hover:text-[#f97316] transition-colors" onClick={(e) => e.stopPropagation()}>
              <Heart size={15} />
            </button>
            <button aria-label="Save" className="hover:text-[#f97316] transition-colors" onClick={(e) => e.stopPropagation()}>
              <Bookmark size={15} />
            </button>
            <button aria-label="Read later" className="hover:text-[#f97316] transition-colors" onClick={(e) => e.stopPropagation()}>
              <Clock size={15} />
            </button>
            <button aria-label="More" className="hover:text-[#f97316] transition-colors" onClick={(e) => e.stopPropagation()}>
              <MoreHorizontal size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

Key changes: removed `motion.div` wrapper (stack manages animation externally), removed `onCardClick`/`showTooltip` props, removed tooltip markup, removed `cursor-pointer`, removed `whileHover`/`onClick`, removed `flex-shrink-0` (stack positions absolutely), removed `group` class. Kept `stopPropagation` on action buttons to prevent interference with the CardStack's drag handlers.

- [ ] **Step 2: Verify the dev server still compiles**

Run: `npm run dev` — check terminal for TypeScript errors. Existing `EvidenceFeed.tsx` will show errors because it still passes `onCardClick` and `showTooltip` — that's expected and will be fixed in Task 3.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/product-showcase/PaperCard.tsx
git commit -m "refactor: simplify PaperCard — remove click, tooltip, hover lift"
```

---

### Task 2: Build the CardStack component

**Files:**
- Create: `src/components/sections/product-showcase/CardStack.tsx`

This is the core interactive component. It manages card order, positions cards with rotation/offset/blur/dim, handles hover-to-surface, arrow cycling, drag-swipe, auto-play, keyboard nav, and `prefers-reduced-motion`.

- [ ] **Step 1: Create `CardStack.tsx`**

```tsx
"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  PanInfo,
} from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaperCard } from "./PaperCard";
import { samplePapers } from "./paper-data";

// Stack positions: index 0 = top (centered), 1+ = back cards
// Back cards fan left/right alternately with rotation
const STACK_POSITIONS = [
  { x: 0, y: 0, rotate: 0, blur: 0, opacity: 1 },        // top
  { x: 35, y: 8, rotate: 5, blur: 2, opacity: 0.7 },      // back-right
  { x: -45, y: 12, rotate: -8, blur: 2, opacity: 0.7 },    // back-left
  { x: 60, y: 18, rotate: 10, blur: 3, opacity: 0.55 },    // far-right
  { x: -70, y: 22, rotate: -12, blur: 3, opacity: 0.55 },   // far-left
];

// Smaller offsets for mobile
const STACK_POSITIONS_MOBILE = [
  { x: 0, y: 0, rotate: 0, blur: 0, opacity: 1 },
  { x: 20, y: 6, rotate: 3, blur: 2, opacity: 0.7 },
  { x: -28, y: 10, rotate: -5, blur: 2, opacity: 0.7 },
  { x: 36, y: 14, rotate: 6, blur: 3, opacity: 0.55 },
  { x: -42, y: 18, rotate: -7, blur: 3, opacity: 0.55 },
];

const SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };
const AUTO_PLAY_INTERVAL = 4000;
const AUTO_PLAY_RESUME_DELAY = 3000;
const SWIPE_THRESHOLD = 50;

export function CardStack() {
  // cardOrder[i] = the index into samplePapers for stack position i
  // cardOrder[0] is the top card
  const [cardOrder, setCardOrder] = useState(() =>
    samplePapers.map((_, i) => i)
  );
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const autoPlayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect mobile
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 1023px)");
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // Cleanup resume timer on unmount
  useEffect(() => {
    return () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };
  }, []);

  // Cycle to next card
  const cycleNext = useCallback(() => {
    setCardOrder((prev) => {
      const next = [...prev];
      const top = next.shift()!;
      next.push(top);
      return next;
    });
  }, []);

  // Cycle to previous card
  const cyclePrev = useCallback(() => {
    setCardOrder((prev) => {
      const next = [...prev];
      const bottom = next.pop()!;
      next.unshift(bottom);
      return next;
    });
  }, []);

  // Bring a specific card to top (for hover)
  const bringToTop = useCallback((paperIndex: number) => {
    setCardOrder((prev) => {
      const posInOrder = prev.indexOf(paperIndex);
      if (posInOrder <= 0) return prev; // already top
      const next = [...prev];
      next.splice(posInOrder, 1);
      next.unshift(paperIndex);
      return next;
    });
  }, []);

  // Auto-play
  useEffect(() => {
    if (isPaused || prefersReducedMotion) {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
      return;
    }

    autoPlayTimer.current = setInterval(cycleNext, AUTO_PLAY_INTERVAL);
    return () => {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
    };
  }, [isPaused, prefersReducedMotion, cycleNext]);

  const pauseAutoPlay = useCallback(() => {
    setIsPaused(true);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  }, []);

  const scheduleResume = useCallback(() => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      setIsPaused(false);
    }, AUTO_PLAY_RESUME_DELAY);
  }, []);

  // Keyboard nav
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        cycleNext();
        pauseAutoPlay();
        scheduleResume();
      } else if (e.key === "ArrowLeft") {
        cyclePrev();
        pauseAutoPlay();
        scheduleResume();
      }
    },
    [cycleNext, cyclePrev, pauseAutoPlay, scheduleResume]
  );

  const positions = isMobile ? STACK_POSITIONS_MOBILE : STACK_POSITIONS;

  return (
    <div
      ref={containerRef}
      className="relative min-h-[340px] lg:min-h-[400px] flex flex-col items-center justify-center"
      onMouseEnter={pauseAutoPlay}
      onMouseLeave={scheduleResume}
      onTouchStart={pauseAutoPlay}
      onTouchEnd={scheduleResume}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Paper card stack"
      aria-roledescription="carousel"
    >
      {/* Card stack */}
      <div className="relative w-[280px] lg:w-[320px] h-[380px] lg:h-[420px]">
        {cardOrder.map((paperIndex, stackPos) => {
          const pos = positions[stackPos] ?? positions[positions.length - 1];
          const isTop = stackPos === 0;
          const zIndex = samplePapers.length - stackPos;

          return (
            <StackCard
              key={samplePapers[paperIndex].id}
              paperIndex={paperIndex}
              isTop={isTop}
              pos={pos}
              zIndex={zIndex}
              onHover={() => {
                if (!isTop) {
                  bringToTop(paperIndex);
                  pauseAutoPlay();
                  scheduleResume();
                }
              }}
              onSwipe={(dir) => {
                if (isTop) {
                  if (dir === "left") cycleNext();
                  else cyclePrev();
                  pauseAutoPlay();
                  scheduleResume();
                }
              }}
              prefersReducedMotion={prefersReducedMotion}
            />
          );
        })}
      </div>

      {/* Nav arrows */}
      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={() => {
            cyclePrev();
            pauseAutoPlay();
            scheduleResume();
          }}
          aria-label="Previous card"
          className="w-10 h-10 rounded-full border border-border-warm/40 bg-white/80 text-espresso/60 hover:text-espresso hover:border-border-warm transition-colors flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={() => {
            cycleNext();
            pauseAutoPlay();
            scheduleResume();
          }}
          aria-label="Next card"
          className="w-10 h-10 rounded-full border border-border-warm/40 bg-white/80 text-espresso/60 hover:text-espresso hover:border-border-warm transition-colors flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

// ─── Individual stack card with drag-swipe ──────────────────────

interface StackCardProps {
  paperIndex: number;
  isTop: boolean;
  pos: (typeof STACK_POSITIONS)[number];
  zIndex: number;
  onHover: () => void;
  onSwipe: (dir: "left" | "right") => void;
  prefersReducedMotion: boolean;
}

function StackCard({
  paperIndex,
  isTop,
  pos,
  zIndex,
  onHover,
  onSwipe,
  prefersReducedMotion,
}: StackCardProps) {
  const x = useMotionValue(0);
  const rotateFromDrag = useTransform(x, [-200, 200], [-15, 15]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > SWIPE_THRESHOLD && isTop) {
      onSwipe(info.offset.x < 0 ? "left" : "right");
    }
    // Snap back
    animate(x, 0, SPRING);
  };

  return (
    <motion.div
      className="absolute top-0 left-0 w-full"
      style={{ zIndex }}
      animate={{
        x: pos.x,
        y: pos.y,
        rotate: pos.rotate,
        opacity: pos.opacity,
        filter: `blur(${pos.blur}px)`,
      }}
      transition={prefersReducedMotion ? { duration: 0 } : SPRING}
      onMouseEnter={onHover}
    >
      <motion.div
        style={isTop ? { x, rotate: rotateFromDrag } : undefined}
        drag={isTop ? "x" : false}
        dragElastic={0.7}
        onDragEnd={isTop ? handleDragEnd : undefined}
      >
        <PaperCard paper={samplePapers[paperIndex]} />
      </motion.div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Verify the file compiles**

Run: `npm run dev` — check for TypeScript errors in CardStack.tsx. The component is not yet wired into the page, so it won't render yet.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/product-showcase/CardStack.tsx
git commit -m "feat: add CardStack component — stacked deck with hover, swipe, auto-play"
```

---

### Task 3: Rewrite EvidenceFeed to use CardStack

**Files:**
- Modify: `src/components/sections/product-showcase/EvidenceFeed.tsx`

- [ ] **Step 1: Replace EvidenceFeed content**

Replace the entire file with:

```tsx
"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { EASE_CARD } from "@/components/motion/variants";
import { CardStack } from "./CardStack";

export function EvidenceFeed() {
  const t = useTranslations("showcase.feed");

  const bullets = [
    t("desc1"),
    t("desc2"),
    t("desc3"),
    t("desc4"),
    t("desc5"),
  ];

  return (
    <section id="product-showcase" className="bg-page-bg py-20 md:py-[80px] px-6 lg:px-16 overflow-hidden">
      <div className="max-w-content mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column — text */}
          <motion.div
            initial={{ opacity: 0, x: -148 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: EASE_CARD }}
          >
            <h2 className="font-heading text-[32px] md:text-[40px] lg:text-[48px] font-normal tracking-heading leading-[110%] text-espresso mb-8">
              {t("headline")}
            </h2>

            <ul className="space-y-4">
              {bullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-2 flex-shrink-0 w-2 h-2 rounded-full bg-orange" />
                  <span className="font-body text-base text-muted-text leading-[160%]">
                    {bullet}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right column — card stack */}
          <motion.div
            initial={{ opacity: 0, x: 148 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: EASE_CARD }}
          >
            <CardStack />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
```

Key changes: removed `useState`, `AnimatePresence`, `PaperDigest` import, `PaperCard` direct import, `feedContainer`/`feedCardReveal` imports, horizontal scroll markup, mobile hint, and digest overlay. Replaced with `CardStack`. Used `EASE_CARD` constant instead of inline array.

- [ ] **Step 2: Verify it renders**

Run: `npm run dev` — open browser, scroll to Evidence Feed section. The card stack should render with 5 cards stacked. Test: hover back cards, click arrows, drag-swipe on the top card.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/product-showcase/EvidenceFeed.tsx
git commit -m "feat: replace horizontal scroll with interactive card stack"
```

---

### Task 4: Create DigestShowcase section

**Files:**
- Create: `src/components/sections/product-showcase/DigestShowcase.tsx`
- Modify: `src/components/sections/product-showcase/index.tsx`

- [ ] **Step 1: Create `DigestShowcase.tsx`**

```tsx
"use client";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { EASE_CARD } from "@/components/motion/variants";
import { BrowserMockup } from "@/components/sections/BrowserMockup";
import { samplePapers } from "./paper-data";

// Use the Stanford TMS paper for the mockup.
// Mockup content is intentionally English-only (product UI preview) — not localized.
const paper = samplePapers[0];

export function DigestShowcase() {
  const t = useTranslations("showcase.digest");

  const bullets = [t("desc1"), t("desc2"), t("desc3"), t("desc4")];

  return (
    <section className="bg-page-warm py-20 md:py-[80px] px-6 lg:px-16 overflow-hidden">
      <div className="max-w-content mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column — text */}
          <motion.div
            initial={{ opacity: 0, x: -148 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: EASE_CARD }}
          >
            <h2 className="font-heading text-[32px] md:text-[40px] lg:text-[48px] font-normal tracking-heading leading-[110%] text-espresso mb-8">
              {t("headline")}
            </h2>

            <ul className="space-y-4">
              {bullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-2 flex-shrink-0 w-2 h-2 rounded-full bg-orange" />
                  <span className="font-body text-base text-muted-text leading-[160%]">
                    {bullet}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right column — browser mockup of digest */}
          <motion.div
            initial={{ opacity: 0, x: 148 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: EASE_CARD }}
          >
            <BrowserMockup>
              {/* Digest content */}
              <div className="max-h-[480px] overflow-hidden">
                {/* Specialty header bar */}
                <div
                  className="h-10 flex items-center px-5"
                  style={{ backgroundColor: paper.specialtyColor }}
                >
                  <span className="text-white/90 text-xs font-medium uppercase tracking-wider">
                    {paper.specialty}
                  </span>
                </div>

                <div className="p-5">
                  {/* Title */}
                  <h3 className="font-heading text-xl font-normal leading-[130%] text-[#2b180a] mb-1.5">
                    {paper.title}
                  </h3>
                  <p className="text-xs text-[#94877c] mb-5">
                    {paper.journal} &middot; {paper.date}
                  </p>

                  {/* AI Summary block */}
                  <div className="bg-[#faf6f2] rounded-faq p-4 mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles size={16} className="text-[#f97316]" />
                      <span className="font-body font-semibold text-sm text-[#2b180a]">
                        AI Summary
                      </span>
                    </div>

                    {/* Tab pills */}
                    <div className="flex gap-2 mb-3">
                      <span className="text-xs px-3 py-1 rounded-pill bg-[#f97316] text-white">
                        Lay Summary
                      </span>
                      <span className="text-xs px-3 py-1 rounded-pill bg-[#e8d3c0]/50 text-[#94877c]">
                        Original Abstract
                      </span>
                    </div>

                    <p className="text-sm text-[#94877c] leading-[170%]">
                      {paper.summary}
                    </p>
                  </div>

                  {/* Key Breakpoints */}
                  <div className="bg-[#faf6f2] rounded-faq p-4 mb-4">
                    <h4 className="font-body font-semibold text-sm text-[#2b180a] mb-3">
                      Key Breakpoints
                    </h4>
                    <ol className="space-y-2.5">
                      {[
                        { label: "Research Question", text: "Does fMRI-guided accelerated TMS achieve rapid remission in treatment-resistant depression?" },
                        { label: "Data & Sample", text: "Multi-center RCT with pre-specified endpoints and appropriate statistical power." },
                        { label: "Key Results", text: "90.5% remission rate within 5 days of the accelerated SAINT protocol." },
                      ].map((item, i) => (
                        <li key={i} className="flex gap-2.5">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#f97316] text-white text-[10px] font-bold flex items-center justify-center mt-0.5">
                            {i + 1}
                          </span>
                          <div>
                            <span className="text-xs font-medium text-[#2b180a]">{item.label}: </span>
                            <span className="text-xs text-[#94877c]">{item.text}</span>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Ask AI button */}
                  <div className="flex justify-center pt-2">
                    <span className="flex items-center gap-2 bg-[#f97316] text-white px-5 py-2.5 rounded-pill shadow-md text-sm font-medium">
                      <Sparkles size={14} />
                      Ask AI about this paper
                    </span>
                  </div>
                </div>
              </div>
            </BrowserMockup>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
```

Note: `BrowserMockup` wraps children in a `motion.div` with `mockupReveal` variants, but since the parent `motion.div` already handles the scroll-reveal entrance animation, the `BrowserMockup`'s `mockupReveal` variant will not fire (it's not inside a variants parent context). This means the browser chrome comes from `BrowserMockup` (no duplication), and the entrance animation is handled by the outer `motion.div` — they don't conflict.

- [ ] **Step 2: Wire DigestShowcase into ProductShowcase index**

Replace `src/components/sections/product-showcase/index.tsx` with:

```tsx
import { EvidenceFeed } from "./EvidenceFeed";
import { DigestShowcase } from "./DigestShowcase";
import { FlyWheelDivider } from "./FlyWheelDivider";
import { AIAgent } from "./AIAgent";
import { IntelligenceLayer } from "./IntelligenceLayer";

export function ProductShowcase() {
  return (
    <section>
      <EvidenceFeed />
      <DigestShowcase />
      <FlyWheelDivider />
      <AIAgent />
      <IntelligenceLayer />
    </section>
  );
}
```

- [ ] **Step 3: Verify it renders**

Run: `npm run dev` — scroll past Evidence Feed. The new Digest Showcase section should appear with the browser mockup on the right showing the Stanford TMS paper digest. Note: i18n keys don't exist yet, so this will error — that's expected and will be fixed in Task 5.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/product-showcase/DigestShowcase.tsx src/components/sections/product-showcase/index.tsx
git commit -m "feat: add Paper Digest showcase section with browser mockup"
```

---

### Task 5: Update i18n files

**Files:**
- Modify: `messages/en.json`
- Modify: `messages/zh.json`

- [ ] **Step 1: Update `messages/en.json`**

Three changes:
1. Update `showcase.feed.desc3` from "Click any card for a full paper digest" to "Swipe through cards to explore your daily evidence"
2. Remove `showcase.feed.digestTooltip`
3. Add `showcase.digest` section

In `en.json`, replace the `showcase.feed` block:

```json
"feed": {
  "headline": "Your Personalized Evidence Feed",
  "desc1": "Thousands of papers filtered to what matters to you",
  "desc2": "AI-summarized TL;DR on every card",
  "desc3": "Swipe through cards to explore your daily evidence",
  "desc4": "Learns from your behavior — gets smarter every day",
  "desc5": "Auto-evaluates study rigor and trustworthiness"
},
```

(Removed `digestTooltip` key, updated `desc3`)

Add the `digest` block as a sibling of `feed`, `flywheel`, `agent`, `intel` — all inside the `showcase` object. The end of the `showcase` block should look like:

```json
    "intel": {
      "headline": "Intelligence you can trust",
      "card1": { "title": "Evidence-Based", "desc": "..." },
      "card2": { "title": "Precision-Personalized", "desc": "..." },
      "card3": { "title": "Self-Improving", "desc": "..." },
      "card4": { "title": "Always Up-to-Date", "desc": "..." }
    },
    "digest": {
      "headline": "Open any paper. Get the full picture in seconds.",
      "desc1": "AI-generated lay summary and original abstract toggle",
      "desc2": "Structured key breakpoints: research question, data, and results",
      "desc3": "Ask AI follow-up questions — answered in context with citations",
      "desc4": "Figure digest with key charts and tables from the paper"
    }
  },
```

Note the comma after `intel`'s closing `}` and no comma after `digest`'s closing `}` (it's the last entry in `showcase`).

- [ ] **Step 2: Update `messages/zh.json`**

Same three changes in Chinese:

Replace `showcase.feed` block:

```json
"feed": {
  "headline": "您的个性化证据流",
  "desc1": "数千篇论文，筛选出与您相关的内容",
  "desc2": "每张卡片都有AI生成的摘要",
  "desc3": "滑动卡片，探索您的每日证据精选",
  "desc4": "从您的行为中学习——每天都更智能",
  "desc5": "自动评估研究的严谨性和可信度"
},
```

(Removed `digestTooltip`, updated `desc3`)

Add `digest` block as the last entry inside `showcase` (after `intel`, same placement as en.json):

```json
    "digest": {
      "headline": "打开任意论文，秒懂全貌。",
      "desc1": "AI生成的通俗摘要与原文摘要一键切换",
      "desc2": "结构化关键要点：研究问题、数据与结果",
      "desc3": "向AI追问——基于上下文和引文回答",
      "desc4": "图表解析：论文中的关键图表和数据"
    }
```

- [ ] **Step 3: Verify the dev server renders without i18n errors**

Run: `npm run dev` — navigate through the full page. All sections should render without missing translation warnings.

- [ ] **Step 4: Commit**

```bash
git add messages/en.json messages/zh.json
git commit -m "feat: update i18n — card stack desc, digest showcase keys (en + zh)"
```

---

### Task 6: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Update Key Architecture Decisions**

Replace this line in CLAUDE.md:
```
- **Interactive product showcase** — Paper cards in the feed are clickable; they expand into a digest view with Framer Motion layoutId transition.
```

With:
```
- **Interactive product showcase** — Evidence feed uses a stacked card deck with hover-to-surface, drag-swipe, and auto-play. Paper Digest is showcased in a dedicated section with a static browser mockup.
```

- [ ] **Step 2: Update Page Sections**

Replace:
```
4. Product Showcase: Evidence Feed → Flywheel Divider → AI Agent → Intelligence Layer
```

With:
```
4. Product Showcase: Evidence Feed (card stack) → Paper Digest Showcase → Flywheel Divider → AI Agent → Intelligence Layer
```

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md — card stack + digest showcase architecture"
```

---

### Task 7: Final verification

- [ ] **Step 1: Run production build**

Run: `npm run build`

Expected: Build succeeds with no errors. Check for TypeScript errors, missing i18n keys, or unused imports.

- [ ] **Step 2: Visual QA checklist**

Run `npm run dev` and manually verify:

1. **Card stack renders** — 5 cards stacked with rotation, back cards blurred/dimmed
2. **Hover** — hovering a back card slides the top card off and brings hovered card to top
3. **Arrow buttons** — `‹` / `›` cycle through cards, have visible focus rings
4. **Drag-swipe** — dragging the top card horizontally triggers a cycle
5. **Auto-play** — cards auto-rotate every ~4s, pause on hover, resume after ~3s
6. **Keyboard** — Tab to arrows, Left/Right arrow keys cycle
7. **Digest Showcase section** — appears between Evidence Feed and Flywheel, shows browser mockup with digest content
8. **Mobile responsive** — resize to mobile width, stack centers below text, cards shrink
9. **Language toggle** — switch to Chinese, verify all new strings render

- [ ] **Step 3: Commit any fixes if needed**

If the visual QA revealed issues, fix and commit them individually.
