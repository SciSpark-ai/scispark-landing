"use client";
import { AnimatePresence, motion, type MotionValue } from "framer-motion";
import { useTranslations } from "next-intl";

interface CursorOverlayProps {
  x: MotionValue<number>;
  y: MotionValue<number>;
  visible: boolean;
  tooltipKey: string | null;
  ripple: { x: number; y: number; nonce: number } | null;
}

export function CursorOverlay({
  x,
  y,
  visible,
  tooltipKey,
  ripple,
}: CursorOverlayProps) {
  const t = useTranslations("homeMockup.cursorDemo.tooltip");

  return (
    <div className="pointer-events-none absolute inset-0 z-40" aria-hidden="true">
      {/* Click ripple — keyed on nonce so each click remounts */}
      <AnimatePresence>
        {ripple && (
          <motion.div
            key={ripple.nonce}
            initial={{ opacity: 0.45, scale: 0.2 }}
            animate={{ opacity: 0, scale: 1 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="absolute w-6 h-6 rounded-full border-2 border-orange"
            style={{
              left: ripple.x - 12,
              top: ripple.y - 12,
            }}
          />
        )}
      </AnimatePresence>

      {/* Cursor + tooltip */}
      <motion.div
        style={{ x, y, opacity: visible ? 1 : 0 }}
        transition={{ opacity: { duration: 0.18 } }}
        className="absolute top-0 left-0 will-change-transform"
      >
        {/* macOS arrow — anchored at hotspot (1,1) inside SVG; offset so the tip sits at (0,0) */}
        <svg
          width="22"
          height="26"
          viewBox="0 0 22 26"
          className="absolute -translate-x-[1px] -translate-y-[1px] drop-shadow-[0_2px_3px_rgba(0,0,0,0.25)]"
        >
          <path
            d="M2 2 L2 22 L7.5 17 L11 24 L13.5 22.7 L10 16 L18 16 Z"
            fill="#1f1f1f"
            stroke="#ffffff"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>

        {/* Tooltip chip — appears below-right of cursor */}
        <AnimatePresence mode="wait">
          {tooltipKey && (
            <motion.div
              key={tooltipKey}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 0 }}
              transition={{ duration: 0.18 }}
              className="absolute left-[18px] top-[24px] whitespace-nowrap rounded-[8px] bg-espresso text-white text-[12px] tracking-body px-2.5 py-1 shadow-md"
            >
              {t(tooltipKey)}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
