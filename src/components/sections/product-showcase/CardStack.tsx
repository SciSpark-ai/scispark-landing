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
