"use client";
import { motion } from "framer-motion";
import { ArrowLeft, X, Sparkles, Heart, Bookmark, Clock, Share2 } from "lucide-react";
import { useState } from "react";
import type { PaperCardData } from "./paper-data";

interface PaperDigestProps {
  paper: PaperCardData;
  onClose: () => void;
}

export function PaperDigest({ paper, onClose }: PaperDigestProps) {
  const [activeTab, setActiveTab] = useState<"lay" | "abstract">("lay");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-[#2b180a]/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Digest card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative max-w-3xl w-full max-h-[85vh] overflow-y-auto bg-white rounded-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky header bar */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-6 py-3"
          style={{ backgroundColor: paper.specialtyColor }}
        >
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-white/90 text-sm font-medium hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            Back to feed
          </button>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Title */}
          <h2 className="font-heading text-[28px] md:text-[32px] font-normal leading-[120%] text-[#2b180a] mb-3">
            {paper.title}
          </h2>

          {/* Journal + date */}
          <p className="text-sm text-[#94877c] mb-6">
            {paper.journal} &middot; {paper.date}
          </p>

          {/* Action bar */}
          <div className="flex items-center gap-3 mb-8">
            <button className="flex items-center gap-2 text-sm text-[#94877c] hover:text-[#f97316] transition-colors px-4 py-2 rounded-btn border border-[#e8d3c0] hover:border-[#f97316]/30">
              <Heart size={15} />
              Like
            </button>
            <button className="flex items-center gap-2 text-sm text-[#94877c] hover:text-[#f97316] transition-colors px-4 py-2 rounded-btn border border-[#e8d3c0] hover:border-[#f97316]/30">
              <Bookmark size={15} />
              Save
            </button>
            <button className="flex items-center gap-2 text-sm text-[#94877c] hover:text-[#f97316] transition-colors px-4 py-2 rounded-btn border border-[#e8d3c0] hover:border-[#f97316]/30">
              <Clock size={15} />
              Read Later
            </button>
            <button className="flex items-center gap-2 text-sm text-[#94877c] hover:text-[#f97316] transition-colors px-4 py-2 rounded-btn border border-[#e8d3c0] hover:border-[#f97316]/30">
              <Share2 size={15} />
              Share
            </button>
          </div>

          {/* AI Summary section */}
          <div className="bg-[#faf6f2] rounded-faq p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={18} className="text-[#f97316]" />
              <h3 className="font-body font-semibold text-[#2b180a]">AI Summary</h3>
            </div>

            {/* Tab buttons */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setActiveTab("lay")}
                className={`text-sm px-4 py-1.5 rounded-pill transition-colors ${
                  activeTab === "lay"
                    ? "bg-[#f97316] text-white"
                    : "bg-[#e8d3c0]/50 text-[#94877c] hover:bg-[#e8d3c0]"
                }`}
              >
                Lay Summary
              </button>
              <button
                onClick={() => setActiveTab("abstract")}
                className={`text-sm px-4 py-1.5 rounded-pill transition-colors ${
                  activeTab === "abstract"
                    ? "bg-[#f97316] text-white"
                    : "bg-[#e8d3c0]/50 text-[#94877c] hover:bg-[#e8d3c0]"
                }`}
              >
                Original Abstract
              </button>
            </div>

            <p className="text-sm text-[#94877c] leading-[170%]">
              {activeTab === "lay"
                ? paper.summary
                : `Original abstract for ${paper.title}. Published in ${paper.journal}, ${paper.date}. Full abstract text would appear here when fetched from the paper source.`}
            </p>
          </div>

          {/* Key Breakpoints & Methods */}
          <div className="bg-[#faf6f2] rounded-faq p-6 mb-6">
            <h3 className="font-body font-semibold text-[#2b180a] mb-4">
              Key Breakpoints &amp; Methods
            </h3>
            <ol className="space-y-3">
              {[
                { label: "Research Question", text: `What is the clinical impact of this intervention on patient outcomes?` },
                { label: "Data & Sample", text: `Multi-center randomized controlled trial with pre-specified endpoints and appropriate statistical power.` },
                { label: "Key Results", text: paper.summary },
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#f97316] text-white text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <div>
                    <span className="text-sm font-medium text-[#2b180a]">{item.label}: </span>
                    <span className="text-sm text-[#94877c]">{item.text}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Figure Digest placeholder */}
          <div className="bg-[#efe7dd] rounded-btn p-6 mb-20 text-center">
            <p className="text-sm text-[#94877c]">Figure digest coming soon — key charts and tables from the paper</p>
          </div>
        </div>

        {/* Floating "Ask AI" button */}
        <div className="sticky bottom-4 flex justify-center pb-2 pointer-events-none">
          <button className="pointer-events-auto flex items-center gap-2 bg-[#f97316] text-white px-6 py-3 rounded-pill shadow-lg hover:bg-[#ea6c0a] transition-colors font-body font-medium text-sm">
            <Sparkles size={16} />
            Ask AI about this paper
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
