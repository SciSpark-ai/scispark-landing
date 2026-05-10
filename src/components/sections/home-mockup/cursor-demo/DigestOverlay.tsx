"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { MOCK_PAPERS, FEED_SLICES } from "../mock-data";

interface DigestOverlayProps {
  open: boolean;
  saved: boolean;
}

export function DigestOverlay({ open, saved }: DigestOverlayProps) {
  const t = useTranslations("homeMockup.cursorDemo.digest");

  // Source paper = first paper in the For You slice (matches feed-card-0)
  const paperId = FEED_SLICES["for-you"][0];
  const paper = MOCK_PAPERS.find((p) => p.id === paperId);

  if (!paper) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="digest"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden="true"
          className="pointer-events-none absolute z-30 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(420px,80%)] rounded-[18px] bg-white border border-border-warm shadow-[0_18px_60px_rgba(43,30,20,0.18)] overflow-hidden"
        >
          <div
            className="h-[6px]"
            style={{ backgroundColor: paper.specialtyColor }}
          />
          <div className="p-5">
            <p className="text-[11px] uppercase tracking-[0.06em] text-muted-text font-medium">
              {paper.tags[0] ?? paper.specialty}
            </p>
            <h3 className="font-heading text-[18px] text-espresso tracking-heading-card leading-[1.3] mt-1">
              {paper.title}
            </h3>
            <p className="text-[13px] text-muted-text tracking-body mt-2 line-clamp-3">
              {paper.summary}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-[11px] text-muted-text tracking-body">
                {paper.journal} · {paper.year}
              </p>
              <div
                data-cursor-target="digest-save"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-[13px] font-medium transition-colors ${
                  saved
                    ? "bg-orange/10 text-orange"
                    : "bg-card-surface text-espresso"
                }`}
              >
                {saved ? <Check size={14} /> : <Bookmark size={14} />}
                {t("saveLabel")}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
