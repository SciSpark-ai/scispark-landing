"use client";
import { useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/motion/AnimatedSection";
import { WordReveal } from "@/components/motion/WordReveal";
import { AnimatedStat } from "@/components/motion/AnimatedStat";

export default function Home() {
  const t = useTranslations("hero");
  return (
    <main className="min-h-screen bg-page-bg p-16">
      <h1 className="font-heading text-[70px] font-normal tracking-heading-tight leading-[110%] text-espresso">
        <WordReveal text={t("headline")} mutedWords={["that", "could"]} delay={0.2} />
      </h1>
      <p className="font-body text-xl text-muted-text tracking-body leading-[150%] mt-4">
        {t("subhead")}
      </p>
      <AnimatedSection className="mt-16 bg-page-warm p-8 rounded-card">
        <p className="text-espresso font-heading text-4xl">
          <AnimatedStat target={3000} suffix="+" />
        </p>
        <p className="text-muted-text">papers published daily</p>
      </AnimatedSection>
    </main>
  );
}
