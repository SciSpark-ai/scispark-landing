"use client";
import { useTranslations } from "next-intl";
import { MOCK_HISTORY } from "../mock-data";

const GROUP_ORDER: (keyof typeof MOCK_HISTORY)[] = ["Today", "Yesterday", "This Week", "Earlier"];
const GROUP_KEYS: Record<keyof typeof MOCK_HISTORY, string> = {
  Today: "groupToday",
  Yesterday: "groupYesterday",
  "This Week": "groupThisWeek",
  Earlier: "groupEarlier",
};

export function HistoryView() {
  const t = useTranslations("homeMockup.history");

  return (
    <div className="p-7">
      <h1 className="font-heading text-[28px] text-espresso tracking-heading">{t("title")}</h1>

      <div>
        {GROUP_ORDER.filter((g) => MOCK_HISTORY[g].length > 0).map((group, groupIndex) => (
          <div key={group}>
            <p
              className={`text-[12px] uppercase text-muted-text font-medium tracking-[0.06em] mb-2 ${
                groupIndex === 0 ? "mt-4" : "mt-6"
              }`}
            >
              {t(GROUP_KEYS[group])}
            </p>
            <div>
              {MOCK_HISTORY[group].map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between py-3 px-3 -mx-3 rounded-[10px] hover:bg-light-surface transition-colors"
                >
                  <span className="text-[14px] text-espresso tracking-body truncate mr-4">
                    {session.title}
                  </span>
                  <span className="text-[12px] text-muted-text shrink-0">{session.time}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
