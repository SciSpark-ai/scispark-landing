"use client";
import { Heart, Bookmark, Clock, MoreHorizontal } from "lucide-react";
import { GrainOverlay } from "@/components/GrainOverlay";
import { StarsRating } from "./StarsRating";
import type { Paper } from "./mock-data";

const TOPIC_COLORS: Record<string, string> = {
  Psilocybin: "#9333ea",
  "Deep Brain Stimulation": "#2563eb",
  Ketamine: "#0891b2",
  "Gut-Brain Axis": "#16a34a",
  TMS: "#4f46e5",
  MDMA: "#e11d48",
  "Machine Learning": "#0d9488",
  "Digital Health": "#ea580c",
};

function getCardColor(paper: Paper): string {
  const primaryTag = paper.tags[0];
  if (primaryTag && TOPIC_COLORS[primaryTag]) return TOPIC_COLORS[primaryTag];
  return paper.specialtyColor;
}

interface FeedCardProps {
  paper: Paper;
}

export function FeedCard({ paper }: FeedCardProps) {
  return (
    <div className="bg-white rounded-card border border-border-warm/30 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
      {/* Topic-color header strip with grain */}
      <div
        className="h-[30px] relative flex items-center px-4"
        style={{ backgroundColor: getCardColor(paper) }}
      >
        <GrainOverlay intensity="heavy" />
        <span className="relative text-white/90 text-[10px] font-medium uppercase tracking-[0.06em]">
          {paper.tags[0] ?? paper.specialty}
        </span>
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="font-heading text-[16px] font-normal leading-[1.35] text-espresso line-clamp-2">
          {paper.title}
        </h3>
        <p className="text-[14px] text-muted-text tracking-body line-clamp-2 mt-2">
          {paper.summary}
        </p>
        <p className="text-[12px] text-muted-text tracking-body mt-2">
          {paper.journal} · {paper.year}
          {paper.badges[0] ? ` · ${paper.badges[0]}` : null}
        </p>
      </div>

      {/* Footer */}
      <div className="border-t border-[#faf6f2] px-5 py-3 flex items-center justify-between">
        <StarsRating rating={paper.evidenceRating} size={12} />
        <div className="flex items-center gap-2 text-muted-text">
          <Heart
            size={15}
            className={paper.liked ? "fill-orange text-orange" : "hover:text-orange transition-colors"}
          />
          <Bookmark
            size={15}
            className={paper.saved ? "fill-orange text-orange" : "hover:text-orange transition-colors"}
          />
          <Clock
            size={15}
            className={paper.readLater ? "fill-orange text-orange" : "hover:text-orange transition-colors"}
          />
          <MoreHorizontal size={15} className="hover:text-orange transition-colors" />
        </div>
      </div>
    </div>
  );
}
