"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { StarsRating } from "../StarsRating";
import { MOCK_PAPERS, type Paper } from "../mock-data";

type Tab = "saved" | "liked" | "readLater";

export function LibraryView() {
  const t = useTranslations("homeMockup.library");
  const [activeTab, setActiveTab] = useState<Tab>("saved");

  const tabs: { id: Tab; key: string }[] = [
    { id: "saved", key: "tabSaved" },
    { id: "liked", key: "tabLiked" },
    { id: "readLater", key: "tabReadLater" },
  ];

  const filteredPapers = MOCK_PAPERS.filter((paper: Paper) => {
    if (activeTab === "saved") return paper.saved;
    if (activeTab === "liked") return paper.liked;
    if (activeTab === "readLater") return paper.readLater;
    return false;
  });

  return (
    <div className="p-7">
      <h1 className="font-heading text-[28px] text-espresso tracking-heading">{t("title")}</h1>

      <div className="flex gap-2 mt-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            type="button"
            className={`px-4 py-[7px] text-[13px] font-medium rounded-pill transition-colors ${
              activeTab === tab.id ? "bg-orange text-white" : "bg-card-surface text-muted-text"
            }`}
          >
            {t(tab.key)}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-0">
        {filteredPapers.map((paper: Paper) => (
          <div
            key={paper.id}
            className="flex items-center gap-4 py-4 border-b border-border-warm/30 hover:bg-light-surface/50 transition-colors px-2 -mx-2 rounded-[8px]"
          >
            <div
              className="w-1 h-10 rounded-[2px] flex-shrink-0"
              style={{ backgroundColor: paper.specialtyColor }}
            />
            <div className="flex-1 min-w-0">
              <p className="font-heading text-[16px] text-espresso tracking-heading-card leading-[1.35]">
                {paper.title}
              </p>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <span className="text-[12px] text-muted-text tracking-body">
                  {paper.journal} · {paper.year} · {paper.specialty}
                </span>
                <StarsRating rating={paper.evidenceRating} size={11} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
