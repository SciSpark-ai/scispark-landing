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
