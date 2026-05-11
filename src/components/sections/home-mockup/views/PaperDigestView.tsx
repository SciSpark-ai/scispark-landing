"use client";
import { useState } from "react";
import {
  Bookmark,
  ChevronLeft,
  Clock,
  Code,
  Copy,
  ExternalLink,
  FileText,
  Heart,
  Share2,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { MOCK_PAPERS } from "../mock-data";
import { useCursorDemoOptional } from "../cursor-demo/CursorDemoContext";
import { DigestChatPreview } from "./DigestChatPreview";

export function PaperDigestView() {
  const t = useTranslations("homeMockup.paperDigest");
  const ctx = useCursorDemoOptional();
  const paper = MOCK_PAPERS[0]; // p-1 — the only paper with rich digest content

  const [liked, setLiked] = useState(false);
  const [readLater, setReadLater] = useState(false);
  const [summaryTab, setSummaryTab] = useState<"lay" | "abstract">("lay");
  const [localSaved, setLocalSaved] = useState(false);
  const saved = ctx?.cursor.digestSaved ?? localSaved;

  function handleBack() {
    if (ctx) ctx.setActiveViewFromUser("home");
  }

  function handleSaveClick() {
    setLocalSaved((v) => !v);
    ctx?.cursor.notifyUserNavigated();
  }

  return (
    <div className="flex-1 overflow-y-auto bg-page-bg">
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-5">
        {/* Back */}
        <button
          onClick={handleBack}
          type="button"
          className="flex items-center gap-1.5 text-[13px] text-muted-text hover:text-espresso transition-colors mb-5"
        >
          <ChevronLeft size={14} />
          {t("back")}
        </button>

        {/* Header */}
        <div>
          <h1 className="font-heading text-[22px] md:text-[26px] font-normal text-espresso leading-[1.3] tracking-heading">
            {paper.title}
          </h1>
          {paper.originalTitle && (
            <p className="text-[12px] text-muted-text tracking-body mt-2 leading-[1.5]">
              <span>{t("originalLabel")} </span>
              {paper.originalTitle}
            </p>
          )}
          <p className="text-[12px] text-muted-text mt-1">{paper.specialty}</p>

          <div className="flex items-center justify-between flex-wrap gap-3 mt-3">
            <p className="text-[13px] text-muted-text tracking-body">
              {t("publishedIn")}{" "}
              <span className="text-orange font-medium">{paper.journal}</span>{" "}
              {paper.year}
              {paper.citations != null
                ? ` · ${paper.citations} ${t("citations")}`
                : ""}
            </p>
            <a
              href={paper.paperUrl ?? "#"}
              onClick={(e) => e.preventDefault()}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-border-warm rounded-[10px] text-[12px] text-espresso hover:bg-card-surface transition-colors"
            >
              <ExternalLink size={13} />
              {t("viewFullPaper")}
            </a>
          </div>
        </div>

        {/* Authors */}
        {paper.authors && paper.authors.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {paper.authors.map((author) => (
              <span
                key={author}
                className="px-2.5 py-1 border border-border-warm rounded-pill text-[12px] text-espresso"
              >
                {author}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap mt-4">
          <button
            type="button"
            onClick={() => {
              setLiked((v) => !v);
              ctx?.cursor.notifyUserNavigated();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-[12px] transition-colors ${
              liked
                ? "bg-orange text-white"
                : "border border-border-warm text-espresso hover:bg-card-surface"
            }`}
          >
            <Heart size={13} className={liked ? "fill-current" : ""} />
            {t("like")}
          </button>
          <button
            type="button"
            data-cursor-target="digest-save"
            onClick={handleSaveClick}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-[12px] transition-colors ${
              saved
                ? "bg-orange text-white"
                : "border border-border-warm text-espresso hover:bg-card-surface"
            }`}
          >
            <Bookmark size={13} className={saved ? "fill-current" : ""} />
            {saved ? t("saved") : t("save")}
          </button>
          <button
            type="button"
            onClick={() => {
              setReadLater((v) => !v);
              ctx?.cursor.notifyUserNavigated();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-[12px] transition-colors ${
              readLater
                ? "bg-orange text-white"
                : "border border-border-warm text-espresso hover:bg-card-surface"
            }`}
          >
            <Clock size={13} className={readLater ? "fill-current" : ""} />
            {t("readLater")}
          </button>
          <button
            type="button"
            onClick={() => ctx?.cursor.notifyUserNavigated()}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-border-warm rounded-pill text-[12px] text-espresso hover:bg-card-surface transition-colors"
          >
            <Share2 size={13} />
            {t("share")}
          </button>
        </div>

        {/* AI Summary */}
        <div className="bg-white rounded-[14px] border border-border-warm/30 p-5 mt-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-orange" />
            <h2 className="font-heading text-[16px] text-espresso">
              {t("aiSummary")}
            </h2>
          </div>

          <div className="flex border border-border-warm/30 rounded-[10px] overflow-hidden mb-3">
            <button
              onClick={() => setSummaryTab("lay")}
              type="button"
              className={`flex-1 py-2 text-[13px] text-center transition-colors ${
                summaryTab === "lay"
                  ? "bg-white text-espresso font-medium"
                  : "bg-light-surface text-muted-text"
              }`}
            >
              {t("tabLay")}
            </button>
            <button
              onClick={() => setSummaryTab("abstract")}
              type="button"
              className={`flex-1 py-2 text-[13px] text-center transition-colors ${
                summaryTab === "abstract"
                  ? "bg-white text-espresso font-medium"
                  : "bg-light-surface text-muted-text"
              }`}
            >
              {t("tabAbstract")}
            </button>
          </div>

          <p className="text-[13px] text-espresso leading-[1.7] tracking-body whitespace-pre-line">
            {summaryTab === "lay"
              ? paper.laySummary ?? paper.summary
              : paper.originalAbstract ?? paper.summary}
          </p>

          <button
            type="button"
            className="flex items-center gap-1.5 mt-3 px-2.5 py-1 border border-border-warm rounded-[8px] text-[12px] text-muted-text hover:text-espresso transition-colors"
          >
            <Copy size={12} />
            {t("copySummary")}
          </button>
        </div>

        {/* Figure Digest */}
        {paper.figureDigest && (
          <div className="bg-white rounded-[14px] border border-border-warm/30 p-5 mt-4">
            <h2 className="font-heading text-[16px] text-espresso mb-3">
              {t("figureDigest")}
            </h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="md:w-[40%] bg-light-surface rounded-[10px] flex items-center justify-center min-h-[140px] p-4">
                <p className="text-[13px] text-muted-text text-center">
                  {paper.figureDigest.caption}
                </p>
              </div>
              <div className="flex-1 space-y-2">
                {paper.figureDigest.findings.map((finding, i) => (
                  <div
                    key={i}
                    className="flex gap-2 text-[13px] text-espresso leading-[1.55]"
                  >
                    <span className="text-orange mt-0.5 flex-shrink-0">•</span>
                    {finding}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Key Breakpoints */}
        {paper.breakpoints && paper.breakpoints.length > 0 && (
          <div className="bg-white rounded-[14px] border border-border-warm/30 p-5 mt-4">
            <h2 className="font-heading text-[16px] text-espresso mb-4">
              {t("keyBreakpoints")}
            </h2>
            {paper.breakpoints.map((bp, i) => (
              <div key={i} className="flex gap-3 mb-4 last:mb-0">
                <div className="w-6 h-6 rounded-full bg-orange text-white text-[11px] font-medium flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] text-orange font-medium">
                    {bp.label}
                  </p>
                  <p className="text-[13px] text-espresso leading-[1.6] tracking-body mt-0.5">
                    {bp.content}
                  </p>
                  {bp.evidence && (
                    <p className="text-[11px] text-muted-text mt-0.5">
                      {bp.evidence}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {(paper.dataLinks?.code || paper.dataLinks?.data) && (
              <div className="flex items-center gap-2 flex-wrap mt-4 pt-3 border-t border-border-warm/30">
                {paper.dataLinks?.code && (
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-2.5 py-1 border border-border-warm rounded-[8px] text-[12px] text-espresso hover:bg-card-surface transition-colors"
                  >
                    <Code size={12} />
                    {t("codeLabel")}
                  </button>
                )}
                {paper.dataLinks?.data && (
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-2.5 py-1 border border-border-warm rounded-[8px] text-[12px] text-espresso hover:bg-card-surface transition-colors"
                  >
                    <FileText size={12} />
                    {t("dataLabel")}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Related */}
        {paper.relatedPapers && paper.relatedPapers.length > 0 && (
          <div className="mt-6">
            <h2 className="font-heading text-[16px] text-espresso mb-3">
              {t("relatedExtended")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {paper.relatedPapers.map((rel, i) => (
                <div
                  key={i}
                  className="bg-white rounded-[12px] border border-border-warm/30 overflow-hidden"
                >
                  <div className="h-[80px] bg-light-surface relative">
                    <span className="absolute top-2 left-2 bg-[#0ea5e9] text-white text-[10px] font-medium px-1.5 py-0.5 rounded-[5px]">
                      {t("relatedTag")}
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="text-[12px] text-espresso font-medium leading-[1.4] line-clamp-2">
                      {rel.title}
                    </p>
                    <p className="text-[11px] text-muted-text mt-1">
                      {rel.journal} · {rel.year}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Citation */}
        <div className="bg-white rounded-[14px] border border-border-warm/30 p-5 mt-4">
          <h2 className="font-heading text-[16px] text-espresso mb-3">
            {t("quickCitation")}
          </h2>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              className="flex items-center gap-1.5 px-2.5 py-1 border border-border-warm rounded-[8px] text-[12px] text-espresso hover:bg-card-surface transition-colors"
            >
              <Copy size={12} />
              {t("copyBibtex")}
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 px-2.5 py-1 border border-border-warm rounded-[8px] text-[12px] text-espresso hover:bg-card-surface transition-colors"
            >
              <Copy size={12} />
              {t("copyApa")}
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 px-2.5 py-1 border border-border-warm rounded-[8px] text-[12px] text-espresso hover:bg-card-surface transition-colors"
            >
              <ExternalLink size={12} />
              {t("exportZotero")}
            </button>
          </div>
        </div>

        {/* Relevance */}
        <div className="bg-white rounded-[14px] border border-border-warm/30 p-5 mt-4 text-center">
          <h3 className="font-heading text-[14px] text-espresso font-medium">
            {t("relevanceTitle")}
          </h3>
          <p className="text-[12px] text-muted-text mt-0.5">
            {t("relevanceSubtitle")}
          </p>
          <div className="flex items-center justify-center gap-3 mt-3">
            <button
              type="button"
              className="flex items-center gap-1.5 px-4 py-1.5 border border-border-warm rounded-[10px] text-[12px] text-espresso hover:bg-card-surface transition-colors"
            >
              <ThumbsUp size={13} />
              {t("relevanceYes")}
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 px-4 py-1.5 border border-border-warm rounded-[10px] text-[12px] text-espresso hover:bg-card-surface transition-colors"
            >
              <ThumbsDown size={13} />
              {t("relevanceNo")}
            </button>
          </div>
        </div>

        {/* Embedded AI chat preview */}
        <div className="mt-5 mb-6">
          <DigestChatPreview />
        </div>
      </div>
    </div>
  );
}
