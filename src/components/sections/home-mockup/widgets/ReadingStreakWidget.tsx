"use client";
import { useTranslations } from "next-intl";
import { MOCK_STREAK } from "../mock-data";

const DAY_LETTERS = ["M", "T", "W", "T", "F", "S", "S"];

export function ReadingStreakWidget() {
  const t = useTranslations("homeMockup.home");
  const remaining = MOCK_STREAK.best - MOCK_STREAK.current + 1;

  return (
    <div>
      <p className="text-[11px] text-muted-text font-medium uppercase tracking-[0.08em] mb-3">
        {t("readingStreak")}
      </p>
      <div className="flex items-baseline gap-1.5 mb-3">
        <span className="text-[28px] font-bold text-orange leading-none">{MOCK_STREAK.current}</span>
        <span className="text-[13px] text-muted-text tracking-body">{t("dayStreak")}</span>
      </div>
      <div className="flex justify-between mb-4">
        {MOCK_STREAK.activeDays.map((active, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <span className="text-[12px] font-medium text-muted-text/80 uppercase tracking-[0.05em]">
              {DAY_LETTERS[i]}
            </span>
            <div
              className={`w-5 h-5 rounded-full transition-colors ${
                active ? "bg-orange" : "bg-card-surface border border-border-warm/60"
              }`}
            />
          </div>
        ))}
      </div>
      <div className="pt-3 border-t border-border-warm/60 space-y-1">
        <p className="text-[12px] text-muted-text tracking-body">
          {t("best")}: <span className="font-semibold text-espresso">{MOCK_STREAK.best}</span>
        </p>
        <p className="text-[11px] text-orange font-medium">
          {remaining} {t("moreToBeatRecord")}
        </p>
      </div>
    </div>
  );
}
