"use client";
import { Star, Heart, Bookmark, Clock, MoreHorizontal } from "lucide-react";
import { GrainOverlay } from "@/components/GrainOverlay";
import type { PaperCardData } from "./paper-data";

interface PaperCardProps {
  paper: PaperCardData;
}

export function PaperCard({ paper }: PaperCardProps) {
  return (
    <div className="relative w-[320px] lg:w-[320px] bg-white rounded-card overflow-hidden border border-[#e8d3c0]/30">
      {/* Colored header bar */}
      <div
        className="h-12 relative flex items-center px-4"
        style={{ backgroundColor: paper.specialtyColor }}
      >
        <GrainOverlay intensity="heavy" />
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
            <button aria-label="Like" className="hover:text-[#f97316] transition-colors" onClick={(e) => e.stopPropagation()}>
              <Heart size={15} />
            </button>
            <button aria-label="Save" className="hover:text-[#f97316] transition-colors" onClick={(e) => e.stopPropagation()}>
              <Bookmark size={15} />
            </button>
            <button aria-label="Read later" className="hover:text-[#f97316] transition-colors" onClick={(e) => e.stopPropagation()}>
              <Clock size={15} />
            </button>
            <button aria-label="More" className="hover:text-[#f97316] transition-colors" onClick={(e) => e.stopPropagation()}>
              <MoreHorizontal size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
