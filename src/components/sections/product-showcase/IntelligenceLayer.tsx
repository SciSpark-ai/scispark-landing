"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/motion/AnimatedSection";
import { StaggerContainer } from "@/components/motion/StaggerContainer";
import { cardReveal } from "@/components/motion/variants";
import { ShieldCheck, Crosshair, RefreshCw, Zap } from "lucide-react";

const cardIcons = [ShieldCheck, Crosshair, RefreshCw, Zap];

export function IntelligenceLayer() {
  const t = useTranslations("showcase.intel");

  const cards = [
    { key: "card1", title: t("card1.title"), desc: t("card1.desc") },
    { key: "card2", title: t("card2.title"), desc: t("card2.desc") },
    { key: "card3", title: t("card3.title"), desc: t("card3.desc") },
    { key: "card4", title: t("card4.title"), desc: t("card4.desc") },
  ];

  return (
    <AnimatedSection className="relative bg-page-warm py-20 px-6 lg:px-16 overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-content mx-auto">
        <h2 className="font-heading text-[36px] md:text-[48px] font-normal tracking-heading leading-[110%] text-espresso text-center mb-16">
          {t("headline")}
        </h2>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card, i) => {
            const Icon = cardIcons[i];
            return (
              <motion.div
                key={card.key}
                variants={cardReveal}
                className="group relative bg-white rounded-card p-8 border border-border-warm/30 shadow-sm hover:shadow-md hover:border-orange/30 transition-all duration-300"
              >
                {/* Title row with icon */}
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-orange/10 flex items-center justify-center flex-shrink-0 group-hover:bg-orange/15 transition-colors duration-300">
                    <Icon className="w-5 h-5 text-orange" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-heading text-2xl font-normal tracking-heading-card text-espresso">
                    {card.title}
                  </h3>
                </div>

                {/* Description — aligned with title (offset by icon + gap) */}
                <p className="font-body text-base text-muted-text leading-[160%] ml-[56px]">
                  {card.desc}
                </p>
              </motion.div>
            );
          })}
        </StaggerContainer>
      </div>
    </AnimatedSection>
  );
}
