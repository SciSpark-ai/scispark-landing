"use client";
import { motion } from "framer-motion";
import { Star, Heart, Bookmark, Clock, MoreHorizontal } from "lucide-react";
import type { PaperCardData } from "./paper-data";

interface PaperCardProps {
  paper: PaperCardData;
  onCardClick?: (paper: PaperCardData) => void;
  showTooltip?: boolean;
}

export function PaperCard({ paper, onCardClick, showTooltip = true }: PaperCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onClick={() => onCardClick?.(paper)}
      className="relative flex-shrink-0 w-[320px] bg-white rounded-card overflow-hidden border border-[#e8d3c0]/30 cursor-pointer group"
    >
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#2b180a] text-white text-xs px-3 py-1.5 rounded-btn whitespace-nowrap">
            Click to see the full paper digest
            {/* Arrow */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#2b180a]" />
          </div>
        </div>
      )}

      {/* Colored header bar */}
      <div
        className="h-12 relative flex items-center px-4"
        style={{ backgroundColor: paper.specialtyColor }}
      >
        {/* Grain texture overlay */}
        <div className="absolute inset-0 bg-black/10" />
        <span className="relative text-white/90 text-xs font-medium uppercase tracking-wider">
          {paper.specialty}
        </span>
      </div>

      {/* Card body */}
      <div className="p-5">
        {/* Badges row */}
        {paper.badges.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {paper.badges.map((badge) => (
              <span
                key={badge}
                className="text-[10px] font-medium px-2 py-0.5 rounded-badge bg-[#faf6f2] text-[#94877c] border border-[#e8d3c0]"
              >
                {badge}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="font-heading text-lg font-normal leading-[130%] text-[#2b180a] line-clamp-2 mb-2">
          {paper.title}
        </h3>

        {/* Journal + date */}
        <p className="text-xs text-[#94877c] mb-3">
          {paper.journal} &middot; {paper.date}
        </p>

        {/* TL;DR summary */}
        <p className="text-sm text-[#94877c] leading-[160%] line-clamp-3 mb-4">
          {paper.summary}
        </p>

        {/* Tag pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {paper.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2.5 py-0.5 rounded-pill bg-[#efe7dd] text-[#94877c]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Evidence stars + action icons */}
        <div className="flex items-center justify-between">
          {/* Stars */}
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < paper.evidenceRating ? "fill-[#dab697] text-[#dab697]" : "text-[#e8d3c0]"}
              />
            ))}
          </div>

          {/* Action icons */}
          <div className="flex items-center gap-2 text-[#94877c]">
            <button
              aria-label="Like"
              className="hover:text-[#f97316] transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Heart size={15} />
            </button>
            <button
              aria-label="Save"
              className="hover:text-[#f97316] transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Bookmark size={15} />
            </button>
            <button
              aria-label="Read later"
              className="hover:text-[#f97316] transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Clock size={15} />
            </button>
            <button
              aria-label="More"
              className="hover:text-[#f97316] transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal size={15} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
