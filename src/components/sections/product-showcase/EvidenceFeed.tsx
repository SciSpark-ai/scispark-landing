"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { feedContainer, feedCardReveal } from "@/components/motion/variants";
import { PaperCard } from "./PaperCard";
import { PaperDigest } from "./PaperDigest";
import { samplePapers, type PaperCardData } from "./paper-data";

export function EvidenceFeed() {
  const t = useTranslations("showcase.feed");
  const [selectedPaper, setSelectedPaper] = useState<PaperCardData | null>(null);

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
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
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

          {/* Right column — scrollable feed */}
          <motion.div
            initial={{ opacity: 0, x: 148 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="overflow-x-auto pb-4 -mr-6 lg:-mr-16 scrollbar-hide">
              <motion.div
                variants={feedContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="flex gap-5 pl-1 pr-6 lg:pr-16"
              >
                {samplePapers.map((paper) => (
                  <motion.div key={paper.id} variants={feedCardReveal}>
                    <PaperCard
                      paper={paper}
                      onCardClick={setSelectedPaper}
                      showTooltip
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Mobile hint */}
            <p className="text-sm text-muted-text/60 mt-3 lg:hidden">
              Swipe to see more &rarr;
            </p>
          </motion.div>
        </div>
      </div>

      {/* Paper digest overlay */}
      <AnimatePresence>
        {selectedPaper && (
          <PaperDigest
            paper={selectedPaper}
            onClose={() => setSelectedPaper(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
