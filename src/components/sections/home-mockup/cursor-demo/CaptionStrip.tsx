"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { SCRIPT } from "./script";

interface CaptionStripProps {
  captionKey: string | null;
  activeBeatIndex: number;
  visible: boolean;
  onSelectBeat?: (beatIndex: number) => void;
}

export function CaptionStrip({
  captionKey,
  activeBeatIndex,
  visible,
  onSelectBeat,
}: CaptionStripProps) {
  const t = useTranslations("homeMockup.cursorDemo.caption");

  return (
    <div
      className={`mt-6 flex flex-col items-center gap-3 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        aria-hidden="true"
        className="h-[1.6em] flex items-center text-center px-4"
      >
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
      <div className="flex items-center gap-2.5">
        {SCRIPT.map((beat, idx) => {
          const isActive = idx === activeBeatIndex;
          const isComplete = idx < activeBeatIndex;
          return (
            <button
              key={beat.id}
              type="button"
              onClick={() => onSelectBeat?.(idx)}
              aria-label={t(beat.captionKey)}
              className="group p-1.5 -m-1.5 cursor-pointer"
            >
              <span
                className={`block rounded-full transition-all duration-300 ${
                  isActive
                    ? "w-6 h-1.5 bg-orange"
                    : isComplete
                      ? "w-1.5 h-1.5 bg-orange/60 group-hover:bg-orange"
                      : "w-1.5 h-1.5 bg-border-warm group-hover:bg-orange/60"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
