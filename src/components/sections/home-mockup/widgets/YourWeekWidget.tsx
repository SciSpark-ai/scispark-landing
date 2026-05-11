"use client";
import { FileText, TrendingUp, Bookmark } from "lucide-react";
import { useTranslations } from "next-intl";
import { MOCK_WEEK_STATS } from "../mock-data";

const ICONS = { newInInterests: FileText, trendingInFields: TrendingUp, savedUnread: Bookmark };

export function YourWeekWidget() {
  const t = useTranslations("homeMockup.home");
  return (
    <div>
      <p className="text-[11px] text-muted-text font-medium uppercase tracking-[0.08em] mb-3">
        {t("yourWeek")}
      </p>
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-[28px] font-bold text-espresso leading-none">
            {MOCK_WEEK_STATS.papersThisWeek}
          </span>
          <span className="text-[12px] text-muted-text tracking-body">{t("papersThisWeek")}</span>
        </div>
        <p className="text-[11px] text-orange font-medium mt-1.5">
          +{MOCK_WEEK_STATS.diffVsLastWeek} {t("diffVsLastWeek")}
        </p>
      </div>
      <div className="space-y-2.5">
        {MOCK_WEEK_STATS.bullets.map((b) => {
          const Icon = ICONS[b.labelKey];
          return (
            <div key={b.labelKey} className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-[7px] bg-orange/10 flex items-center justify-center flex-shrink-0">
                <Icon size={13} className="text-orange" />
              </div>
              <p className="text-[13px] tracking-body">
                <span className="font-semibold text-espresso">{b.value}</span>
                <span className="text-muted-text ml-1">{t(b.labelKey)}</span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
