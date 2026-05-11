"use client";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Search, ArrowUp, Plus, GitCompare, FileText, Scale } from "lucide-react";
import { useCursorDemoOptional } from "../cursor-demo/CursorDemoContext";

export function NewChatView() {
  const t = useTranslations("homeMockup.chat");
  const ctx = useCursorDemoOptional();
  const [localQuery, setLocalQuery] = useState("");
  const query = ctx?.query ?? localQuery;
  const setQuery = ctx?.setQueryFromUser ?? setLocalQuery;

  const [flash, setFlash] = useState(false);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const suggestions = [
    { key: "chipCompare", icon: GitCompare },
    { key: "chipSummarize", icon: FileText },
    { key: "chipGuidelines", icon: Search },
    { key: "chipRisk", icon: Scale },
  ];

  function handleChip(label: string) {
    setQuery(label);
    setFlash(true);
    if (flashTimer.current) clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setFlash(false), 200);
  }

  useEffect(() => {
    return () => {
      if (flashTimer.current) clearTimeout(flashTimer.current);
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[560px]">
      <div className="w-full max-w-[640px] px-6 text-center">
        <h1 className="font-heading text-[44px] md:text-[56px] text-espresso tracking-heading-tight leading-none">
          SciSpark
        </h1>
        <p className="text-[14px] text-muted-text tracking-body mt-1">{t("tagline")}</p>

        <div className="mt-8">
          <div
            className={`bg-white border rounded-[16px] px-5 pt-4 pb-3 transition-all ${
              flash ? "border-orange ring-2 ring-orange/30" : "border-border-warm"
            }`}
          >
            <div className="flex items-start gap-3">
              <Search size={18} className="text-muted-text flex-shrink-0 mt-1" />
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("placeholder")}
                rows={2}
                data-cursor-target="chat-textarea"
                className="flex-1 text-[15px] text-espresso tracking-body placeholder:text-muted-text bg-transparent focus:outline-none resize-none"
              />
            </div>
            <div className="flex items-center justify-between mt-3">
              <Plus size={16} className="text-muted-text" />
              <div
                data-cursor-target="chat-send"
                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                  query.trim() ? "bg-orange text-white" : "bg-card-surface text-muted-text"
                }`}
              >
                <ArrowUp size={16} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-nowrap justify-center gap-1.5 mt-5">
          {suggestions.map((s) => {
            const Icon = s.icon;
            const label = t(s.key);
            return (
              <button
                key={s.key}
                onClick={() => handleChip(label)}
                type="button"
                className="bg-card-surface border border-border-warm rounded-pill px-2.5 py-1.5 text-[13px] text-espresso hover:bg-border-warm transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                <Icon size={14} className="text-orange flex-shrink-0" />
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
