"use client";
import { motion } from "framer-motion";
import { Sparkles, Heart, Bookmark, Clock, Share2, ExternalLink, Copy, ThumbsUp, ThumbsDown, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { EASE_CARD } from "@/components/motion/variants";
import { BrowserMockup } from "@/components/sections/BrowserMockup";

// Wireframe placeholder line component
function PlaceholderLine({ width = "100%" }: { width?: string }) {
  return (
    <div
      className="h-[7px] rounded-sm bg-[#ddd5cb]"
      style={{ width }}
    />
  );
}

function PlaceholderLines({ count = 3, className = "" }: { count?: number; className?: string }) {
  const widths = ["100%", "92%", "78%", "85%", "65%", "90%", "70%"];
  return (
    <div className={`space-y-2 ${className}`}>
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
              <div className="relative max-h-[560px] overflow-hidden">
                {/* Scrollable content area */}
                <div className="p-4 space-y-3 pb-16">

                  {/* ── Paper Header ── */}
                  <div>
                    <PlaceholderLine width="35%" />
                    <div className="mt-2.5 space-y-1.5">
                      <div className="h-[10px] rounded-sm bg-[#c4b8aa] w-[90%]" />
                      <div className="h-[10px] rounded-sm bg-[#c4b8aa] w-[60%]" />
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <PlaceholderLine width="20%" />
                      <span className="text-[8px] text-orange font-medium">Am J Psychiatry</span>
                      <PlaceholderLine width="15%" />
                    </div>
                    {/* Author pills */}
                    <div className="flex gap-1.5 mt-2">
                      {["Author 1", "Author 2", "Author 3"].map((a) => (
                        <span key={a} className="text-[7px] px-2 py-0.5 rounded-full border border-[#e8d3c0] text-[#94877c]">{a}</span>
                      ))}
                    </div>
                    {/* Action bar */}
                    <div className="flex items-center gap-2 mt-2.5">
                      <span className="flex items-center gap-1 text-[7px] px-2 py-1 rounded-full bg-orange text-white">
                        <Heart size={7} /> Like
                      </span>
                      <span className="flex items-center gap-1 text-[7px] px-2 py-1 rounded-full bg-orange text-white">
                        <Bookmark size={7} /> Save
                      </span>
                      <span className="flex items-center gap-1 text-[7px] px-2 py-1 rounded-full border border-[#e8d3c0] text-[#94877c]">
                        <Clock size={7} /> Read Later
                      </span>
                      <span className="flex items-center gap-1 text-[7px] px-2 py-1 rounded-full border border-[#e8d3c0] text-[#94877c]">
                        <Share2 size={7} /> Share
                      </span>
                      <span className="ml-auto flex items-center gap-1 text-[7px] px-2 py-1 rounded-full border border-[#e8d3c0] text-[#94877c]">
                        <ExternalLink size={7} /> View Full Paper
                      </span>
                    </div>
                  </div>

                  {/* ── AI Summary ── */}
                  <div className="bg-[#faf6f2] rounded-[10px] p-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Sparkles size={10} className="text-orange" />
                      <span className="font-body font-semibold text-[9px] text-[#2b180a]">AI Summary</span>
                    </div>
                    <div className="flex gap-1.5 mb-2">
                      <span className="text-[7px] px-2.5 py-0.5 rounded-full bg-orange text-white">Lay Summary</span>
                      <span className="text-[7px] px-2.5 py-0.5 rounded-full bg-[#e8d3c0]/50 text-[#94877c]">Original Abstract</span>
                    </div>
                    <PlaceholderLines count={4} />
                    <div className="flex items-center gap-1 mt-2">
                      <Copy size={7} className="text-[#94877c]" />
                      <span className="text-[7px] text-[#94877c]">Copy Summary</span>
                    </div>
                  </div>

                  {/* ── Key Breakpoints & Methods ── */}
                  <div className="bg-[#faf6f2] rounded-[10px] p-3">
                    <span className="font-body font-semibold text-[9px] text-[#2b180a]">Key Breakpoints &amp; Methods</span>
                    <div className="mt-2 space-y-2">
                      {["Research Question", "Data & Sample", "Method Highlights", "Key Results", "Implications"].map((label, i) => (
                        <div key={i} className="flex gap-2">
                          <span className="flex-shrink-0 w-3.5 h-3.5 rounded-full bg-orange text-white text-[6px] font-bold flex items-center justify-center mt-0.5">
                            {i + 1}
                          </span>
                          <div className="flex-1">
                            <span className="text-[7px] font-medium text-orange">{label}</span>
                            <PlaceholderLines count={1} className="mt-1" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ── Figure Digest ── */}
                  <div className="bg-[#faf6f2] rounded-[10px] p-3">
                    <span className="font-body font-semibold text-[9px] text-[#2b180a]">Figure Digest</span>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <div className="bg-[#e8d3c0]/40 rounded-md h-12 flex items-center justify-center">
                        <span className="text-[7px] text-[#94877c]">Figure 1</span>
                      </div>
                      <div className="space-y-1.5 flex flex-col justify-center">
                        <PlaceholderLine width="90%" />
                        <PlaceholderLine width="70%" />
                      </div>
                    </div>
                  </div>

                  {/* ── Related & Extended ── */}
                  <div className="bg-[#faf6f2] rounded-[10px] p-3">
                    <span className="font-body font-semibold text-[9px] text-[#2b180a]">Related &amp; Extended</span>
                    <div className="mt-2 flex gap-2">
                      {[1, 2, 3].map((n) => (
                        <div key={n} className="flex-1 rounded-md overflow-hidden border border-[#e8d3c0]/30">
                          <div className="bg-[#e8d3c0]/30 h-8 relative">
                            <span className="absolute top-1 left-1 text-[5px] px-1 py-0.5 rounded bg-[#06b6d4] text-white">Related</span>
                          </div>
                          <div className="p-1.5">
                            <PlaceholderLine width="85%" />
                            <div className="mt-1">
                              <PlaceholderLine width="55%" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ── Quick Citation ── */}
                  <div className="bg-[#faf6f2] rounded-[10px] p-3">
                    <span className="font-body font-semibold text-[9px] text-[#2b180a]">Quick Citation</span>
                    <div className="flex gap-1.5 mt-2">
                      {["Copy BibTeX", "Copy APA", "Export to Zotero"].map((label) => (
                        <span key={label} className="flex items-center gap-1 text-[6px] px-2 py-1 rounded-full border border-[#e8d3c0] text-[#94877c]">
                          <Copy size={6} /> {label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* ── Relevance Feedback ── */}
                  <div className="bg-[#faf6f2] rounded-[10px] p-3 text-center">
                    <span className="font-body font-semibold text-[8px] text-[#2b180a]">Is this paper relevant to you?</span>
                    <p className="text-[6px] text-[#94877c] mt-0.5">Giving feedback helps us give you better recommendations.</p>
                    <div className="flex justify-center gap-2 mt-2">
                      <span className="flex items-center gap-1 text-[7px] px-3 py-1 rounded-full border border-[#e8d3c0] text-[#94877c]">
                        <ThumbsUp size={7} /> Yes
                      </span>
                      <span className="flex items-center gap-1 text-[7px] px-3 py-1 rounded-full border border-[#e8d3c0] text-[#94877c]">
                        <ThumbsDown size={7} /> No
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── Bottom fade gradient ── */}
                <div className="absolute bottom-10 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />

                {/* ── Sticky AI Chatbox ── */}
                <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#e8d3c0]/30 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Sparkles size={12} className="text-orange flex-shrink-0" />
                    <div className="flex-1 bg-[#faf6f2] rounded-full px-3 py-1.5 flex items-center">
                      <span className="text-[8px] text-[#94877c]">Ask AI about this paper...</span>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-orange flex items-center justify-center flex-shrink-0">
                      <Send size={10} className="text-white" />
                    </div>
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
