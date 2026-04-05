"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { Sparkles, Heart, Bookmark, Clock, Share2, ExternalLink, Copy, Code, FileText, Plus, ArrowUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { EASE_CARD } from "@/components/motion/variants";
import { BrowserMockup } from "@/components/sections/BrowserMockup";

// Wireframe placeholder line component — sizes are pre-scale (scaled down 0.55x)
function PlaceholderLine({ width = "100%" }: { width?: string }) {
  return (
    <div
      className="h-[10px] rounded-sm bg-[#ddd5cb]"
      style={{ width }}
    />
  );
}

function PlaceholderLines({ count = 3, className = "" }: { count?: number; className?: string }) {
  const widths = ["100%", "92%", "78%", "85%", "65%", "90%", "70%"];
  return (
    <div className={`space-y-2.5 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <PlaceholderLine key={i} width={widths[i % widths.length]} />
      ))}
    </div>
  );
}

// Section reveal timing (ms after inView triggers)
const SECTION_DELAYS = [0, 800, 1700, 2700, 3800, 5000];
const SCROLL_DELAY_AFTER_LAST = 600;

// Mockup content is intentionally English-only (product UI preview) — not localized.
export function DigestShowcase() {
  const t = useTranslations("showcase.digest");
  const bullets = [t("desc1"), t("desc2"), t("desc3"), t("desc4")];

  const mockupRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(mockupRef, { once: false, margin: "-80px" });
  const [visibleSections, setVisibleSections] = useState(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const runRevealSequence = useCallback(() => {
    clearTimers();
    setVisibleSections(0);

    const totalSections = 6; // header, AI summary, figure, breakpoints, related, citation
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Reveal sections one by one
    for (let i = 0; i < totalSections; i++) {
      timers.push(setTimeout(() => {
        setVisibleSections(i + 1);
      }, SECTION_DELAYS[i]));
    }

    // Auto-scroll to bottom after all sections revealed
    timers.push(setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
          top: scrollContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, SECTION_DELAYS[totalSections - 1] + SCROLL_DELAY_AFTER_LAST));

    // Restart loop: scroll back to top, then re-reveal
    const restartDelay = SECTION_DELAYS[totalSections - 1] + 4000;
    timers.push(setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
      setTimeout(() => runRevealSequence(), 900);
    }, restartDelay));

    timersRef.current = timers;
  }, [clearTimers]);

  useEffect(() => {
    if (isInView) {
      runRevealSequence();
    } else {
      clearTimers();
      setVisibleSections(0);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
    }
    return clearTimers;
  }, [isInView, runRevealSequence, clearTimers]);

  // Auto-scroll as new sections appear (slight delay so fade-in starts before scroll)
  useEffect(() => {
    if (visibleSections > 1 && scrollContainerRef.current) {
      const el = scrollContainerRef.current;
      const t = setTimeout(() => {
        el.scrollTo({
          top: el.scrollHeight,
          behavior: "smooth",
        });
      }, 250);
      return () => clearTimeout(t);
    }
  }, [visibleSections]);

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
  };

  return (
    <section className="bg-page-warm py-20 md:py-[80px] px-6 lg:px-16 overflow-hidden">
      <div className="max-w-content mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column — browser mockup wireframe */}
          <motion.div
            ref={mockupRef}
            initial={{ opacity: 0, x: -148 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: EASE_CARD }}
          >
            <BrowserMockup>
              <div ref={scrollContainerRef} className="relative h-[420px] overflow-y-auto overflow-x-hidden scrollbar-hide bg-white">
                <div
                  className="origin-top-left p-6 space-y-4"
                  style={{ transform: "scale(0.55)", width: "182%" }}
                  ref={(el) => {
                    if (el) {
                      const fullH = el.scrollHeight;
                      const scaledH = fullH * 0.55;
                      el.style.marginBottom = `-${fullH - scaledH}px`;
                    }
                  }}
                >

                  {/* ── 1. Paper Header ── */}
                  {visibleSections >= 1 && (
                    <motion.div variants={sectionVariants} initial="hidden" animate="visible">
                      <div className="space-y-2">
                        <div className="h-[16px] rounded-sm bg-[#c4b8aa] w-[95%]" />
                        <div className="h-[16px] rounded-sm bg-[#c4b8aa] w-[50%]" />
                      </div>
                      <div className="mt-3 flex items-center justify-between flex-nowrap whitespace-nowrap">
                        <span className="text-xs text-[#94877c]">Published in <span className="text-orange font-medium">Journal Name</span> 2024 &middot; 487 citations</span>
                        <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-[#e8d3c0] text-[#94877c] flex-shrink-0">
                          <ExternalLink size={12} /> View Full Paper
                        </span>
                      </div>
                      <div className="flex gap-2 mt-3 flex-nowrap">
                        {[0, 1, 2].map((i) => (
                          <span key={i} className="text-xs px-3 py-1 rounded-full border border-[#e8d3c0] text-[#94877c] whitespace-nowrap">Author Name</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2.5 mt-4 flex-nowrap">
                        <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-orange text-white whitespace-nowrap">
                          <Heart size={12} /> Like
                        </span>
                        <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-orange text-white whitespace-nowrap">
                          <Bookmark size={12} /> Save
                        </span>
                        <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-[#e8d3c0] text-[#94877c] whitespace-nowrap">
                          <Clock size={12} /> Read Later
                        </span>
                        <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-[#e8d3c0] text-[#94877c] whitespace-nowrap">
                          <Share2 size={12} /> Share
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {/* ── 2. AI Summary ── */}
                  {visibleSections >= 2 && (
                    <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="bg-[#faf6f2] rounded-2xl p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles size={16} className="text-orange" />
                        <span className="font-body font-semibold text-base text-[#2b180a]">AI Summary</span>
                      </div>
                      <div className="flex gap-2 mb-3">
                        <span className="text-xs px-4 py-1.5 rounded-full bg-orange text-white">Lay Summary</span>
                        <span className="text-xs px-4 py-1.5 rounded-full bg-[#e8d3c0]/50 text-[#94877c]">Original Abstract</span>
                      </div>
                      <PlaceholderLines count={4} />
                      <div className="flex items-center gap-1.5 mt-3">
                        <Copy size={12} className="text-[#94877c]" />
                        <span className="text-xs text-[#94877c]">Copy Summary</span>
                      </div>
                    </motion.div>
                  )}

                  {/* ── 3. Figure Digest ── */}
                  {visibleSections >= 3 && (
                    <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="bg-[#faf6f2] rounded-2xl p-5">
                      <span className="font-body font-semibold text-base text-[#2b180a]">Figure Digest</span>
                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <div className="bg-[#e8d3c0]/40 rounded-lg h-20 flex items-center justify-center">
                          <span className="text-xs text-[#94877c]">Figure 1</span>
                        </div>
                        <div className="space-y-2 flex flex-col justify-center">
                          <PlaceholderLine width="90%" />
                          <PlaceholderLine width="70%" />
                          <PlaceholderLine width="80%" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ── 4. Key Breakpoints & Methods ── */}
                  {visibleSections >= 4 && (
                    <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="bg-[#faf6f2] rounded-2xl p-5">
                      <span className="font-body font-semibold text-base text-[#2b180a]">Key Breakpoints &amp; Methods</span>
                      <div className="mt-3 space-y-3">
                        {["Research Question", "Data & Sample", "Method Highlights", "Key Results", "Implications"].map((label, i) => (
                          <div key={i} className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange text-white text-[10px] font-bold flex items-center justify-center mt-0.5">
                              {i + 1}
                            </span>
                            <div className="flex-1">
                              <span className="text-xs font-medium text-orange">{label}</span>
                              <PlaceholderLines count={1} className="mt-1.5" />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 mt-4">
                        <span className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-full border border-[#e8d3c0] text-[#2b180a] whitespace-nowrap">
                          <Code size={12} /> Code
                        </span>
                        <span className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-full border border-[#e8d3c0] text-[#2b180a] whitespace-nowrap">
                          <FileText size={12} /> Data
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {/* ── 5. Related & Extended ── */}
                  {visibleSections >= 5 && (
                    <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="p-5">
                      <span className="font-body font-semibold text-base text-[#2b180a]">Related &amp; Extended</span>
                      <div className="mt-3 flex gap-3">
                        {[1, 2, 3].map((n) => (
                          <div key={n} className="flex-1 rounded-lg overflow-hidden border border-[#e8d3c0]/30 bg-white">
                            <div className="bg-[#e8d3c0]/30 h-14 relative">
                              <span className="absolute top-1.5 left-1.5 text-[8px] px-1.5 py-0.5 rounded bg-[#06b6d4] text-white font-medium">Related</span>
                            </div>
                            <div className="p-2.5">
                              <PlaceholderLine width="85%" />
                              <div className="mt-1.5">
                                <PlaceholderLine width="55%" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* ── 6. Quick Citation ── */}
                  {visibleSections >= 6 && (
                    <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="bg-[#faf6f2] rounded-2xl p-5">
                      <span className="font-body font-semibold text-base text-[#2b180a]">Quick Citation</span>
                      <div className="flex gap-2 mt-3">
                        {["Copy BibTeX", "Copy APA", "Export to Zotero"].map((label) => (
                          <span key={label} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-[#e8d3c0] text-[#94877c]">
                            <Copy size={11} /> {label}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}

                </div>
              </div>

              {/* ── AI Chatbox (always visible, pinned below scrollable area) ── */}
              <div className="bg-page-warm border-t border-[#e8d3c0]/30 px-4 py-3">
                <div className="bg-white rounded-2xl border border-[#e8d3c0]/30 px-4 pt-3 pb-2.5">
                  <span className="text-xs text-[#94877c]">Ask question about this paper</span>
                  <div className="flex items-center justify-between mt-3">
                    <Plus size={14} className="text-[#94877c]" />
                    <div className="w-7 h-7 rounded-full bg-[#e8d3c0]/50 flex items-center justify-center">
                      <ArrowUp size={13} className="text-[#94877c]" />
                    </div>
                  </div>
                </div>
              </div>
            </BrowserMockup>
          </motion.div>

          {/* Right column — text */}
          <motion.div
            initial={{ opacity: 0, x: 148 }}
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
        </div>
      </div>
    </section>
  );
}
