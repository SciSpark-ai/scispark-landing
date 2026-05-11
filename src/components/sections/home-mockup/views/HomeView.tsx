"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { YourWeekWidget } from "../widgets/YourWeekWidget";
import { TrendingTopicsWidget } from "../widgets/TrendingTopicsWidget";
import { ReadingStreakWidget } from "../widgets/ReadingStreakWidget";
import { FeedCard } from "../FeedCard";
import { MOCK_PAPERS, FEED_SLICES, MOCK_USER } from "../mock-data";

type FeedTab = "for-you" | "trending" | "by-specialty";

function getGreetingKey(): "morning" | "afternoon" | "evening" {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

export function HomeView() {
  const t = useTranslations("homeMockup");
  const [activeTab, setActiveTab] = useState<FeedTab>("for-you");

  const tabLabels: { value: FeedTab; key: string }[] = [
    { value: "for-you", key: "home.tabForYou" },
    { value: "trending", key: "home.tabTrending" },
    { value: "by-specialty", key: "home.tabBySpecialty" },
  ];

  const papers = FEED_SLICES[activeTab]
    .map((id) => MOCK_PAPERS.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const greeting = t(`greeting.${getGreetingKey()}`);

  return (
    <div className="pb-10">
      {/* Sticky tab bar */}
      <div className="sticky top-0 z-10 bg-page-bg border-b border-border-warm/60 px-7 py-2.5">
        <div className="flex gap-6">
          {tabLabels.map(({ value, key }) => (
            <button
              key={value}
              onClick={() => setActiveTab(value)}
              type="button"
              data-cursor-target={value === "for-you" ? "tab-for-you" : undefined}
              className={`pb-2 px-1 text-[14px] tracking-body border-b-2 transition-colors ${
                activeTab === value
                  ? "text-espresso font-medium border-orange"
                  : "text-muted-text border-transparent hover:text-espresso"
              }`}
            >
              {t(key)}
            </button>
          ))}
        </div>
      </div>

      {/* Greeting + widgets */}
      <div className="px-7">
        <h1 className="font-heading text-[28px] md:text-[32px] text-espresso tracking-heading pt-7">
          {greeting}, <span className="text-orange">{MOCK_USER.name}</span>
        </h1>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-[18px] bg-white/70 border border-border-warm/60 p-5">
            <YourWeekWidget />
          </div>
          <div className="rounded-[18px] bg-white/70 border border-border-warm/60 p-5 md:col-span-1 lg:col-span-2">
            <TrendingTopicsWidget />
          </div>
          <div className="rounded-[18px] bg-white/70 border border-border-warm/60 p-5">
            <ReadingStreakWidget />
          </div>
        </div>

        {/* New research header */}
        <h2 className="mt-10 font-heading text-[22px] text-espresso tracking-heading flex items-center gap-2">
          {t("home.newResearch")}
          <span className="text-orange">→</span>
        </h2>

        {/* Card grid */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[14px]">
          {papers.map((paper, idx) => (
            <div key={paper.id} data-cursor-target={idx === 0 ? "feed-card-0" : undefined}>
              <FeedCard paper={paper} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
