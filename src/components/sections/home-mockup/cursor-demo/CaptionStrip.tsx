"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { SCRIPT } from "./script";

interface CaptionStripProps {
  captionKey: string | null;
  activeBeatIndex: number;
  visible: boolean;
}

export function CaptionStrip({ captionKey, activeBeatIndex, visible }: CaptionStripProps) {
  const t = useTranslations("homeMockup.cursorDemo.caption");

  return (
    <div
      aria-hidden="true"
      className={`mt-6 flex flex-col items-center gap-3 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="h-[1.6em] flex items-center text-center px-4">
        <AnimatePresence mode="wait">
          {captionKey && (
            <motion.p
              key={captionKey}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="font-heading text-[18px] md:text-[20px] text-espresso tracking-heading"
            >
              {t(captionKey)}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      <div className="flex items-center gap-2">
        {SCRIPT.map((beat, idx) => {
          const isActive = idx === activeBeatIndex;
          const isComplete = idx < activeBeatIndex;
          return (
            <span
              key={beat.id}
              className={`block rounded-full transition-all duration-300 ${
                isActive
                  ? "w-6 h-1.5 bg-orange"
                  : isComplete
                    ? "w-1.5 h-1.5 bg-orange/60"
                    : "w-1.5 h-1.5 bg-border-warm"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
