"use client";
import { motion } from "framer-motion";
import { Sparkles, Heart, Bookmark, Clock, Share2, ExternalLink, Copy, ThumbsUp, ThumbsDown, Send } from "lucide-react";
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

// Mockup content is intentionally English-only (product UI preview) — not localized.
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

          {/* Right column — browser mockup wireframe */}
          <motion.div
            initial={{ opacity: 0, x: 148 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: EASE_CARD }}
          >
            <BrowserMockup>
              <div className="relative h-[520px] overflow-y-auto overflow-x-hidden scrollbar-hide">
                {/* Scale the content down to look like a zoomed-out product screenshot */}
                <div
                  className="origin-top-left p-6 space-y-4 pb-16"
                  style={{ transform: "scale(0.55)", width: "182%" }}
                >

                  {/* ── Paper Header ── */}
                  <div>
                    {/* Title (2 lines) */}
                    <div className="space-y-2">
                      <div className="h-[16px] rounded-sm bg-[#c4b8aa] w-[95%]" />
                      <div className="h-[16px] rounded-sm bg-[#c4b8aa] w-[50%]" />
                    </div>
                    {/* Original title */}
                    <div className="mt-2.5">
                      <PlaceholderLine width="75%" />
                    </div>
                    {/* Specialty tag */}
                    <div className="mt-1.5">
                      <PlaceholderLine width="12%" />
                    </div>
                    {/* Published in Journal · Year · Citations + View Full Paper */}
                    <div className="mt-3 flex items-center justify-between flex-nowrap whitespace-nowrap">
                      <span className="text-xs text-[#94877c]">Published in <span className="text-orange font-medium">Journal Name</span> 2024 &middot; 487 citations</span>
                      <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-[#e8d3c0] text-[#94877c] flex-shrink-0">
                        <ExternalLink size={12} /> View Full Paper
                      </span>
                    </div>
                    {/* Author pills */}
                    <div className="flex gap-2 mt-3 flex-nowrap">
                      {[0, 1, 2].map((i) => (
                        <span key={i} className="text-xs px-3 py-1 rounded-full border border-[#e8d3c0] text-[#94877c] whitespace-nowrap">Author Name</span>
                      ))}
                    </div>
                    {/* Action bar */}
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
                  </div>

                  {/* ── AI Summary ── */}
                  <div className="bg-[#faf6f2] rounded-2xl p-5">
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
                  </div>

                  {/* ── Key Breakpoints & Methods ── */}
                  <div className="bg-[#faf6f2] rounded-2xl p-5">
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
                  </div>

                  {/* ── Figure Digest ── */}
                  <div className="bg-[#faf6f2] rounded-2xl p-5">
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
                  </div>

                  {/* ── Related & Extended ── */}
                  <div className="bg-[#faf6f2] rounded-2xl p-5">
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
                  </div>

                  {/* ── Quick Citation ── */}
                  <div className="bg-[#faf6f2] rounded-2xl p-5">
                    <span className="font-body font-semibold text-base text-[#2b180a]">Quick Citation</span>
                    <div className="flex gap-2 mt-3">
                      {["Copy BibTeX", "Copy APA", "Export to Zotero"].map((label) => (
                        <span key={label} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-[#e8d3c0] text-[#94877c]">
                          <Copy size={11} /> {label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* ── Relevance Feedback ── */}
                  <div className="bg-[#faf6f2] rounded-2xl p-5 text-center">
                    <span className="font-body font-semibold text-sm text-[#2b180a]">Is this paper relevant to you?</span>
                    <p className="text-xs text-[#94877c] mt-1">Giving feedback helps us give you better recommendations.</p>
                    <div className="flex justify-center gap-3 mt-3">
                      <span className="flex items-center gap-1.5 text-xs px-5 py-2 rounded-full border border-[#e8d3c0] text-[#94877c]">
                        <ThumbsUp size={12} /> Yes
                      </span>
                      <span className="flex items-center gap-1.5 text-xs px-5 py-2 rounded-full border border-[#e8d3c0] text-[#94877c]">
                        <ThumbsDown size={12} /> No
                      </span>
                    </div>
                  </div>
                </div>

              </div>
              {/* ── AI Chatbox (pinned below scrollable area) ── */}
              <div className="bg-white border-t border-[#e8d3c0]/30 px-4 py-2.5">
                <div className="flex items-center gap-2.5">
                  <Sparkles size={16} className="text-orange flex-shrink-0" />
                  <div className="flex-1 bg-[#faf6f2] rounded-full px-4 py-2 flex items-center">
                    <span className="text-xs text-[#94877c]">Ask AI about this paper...</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-orange flex items-center justify-center flex-shrink-0">
                    <Send size={14} className="text-white" />
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
