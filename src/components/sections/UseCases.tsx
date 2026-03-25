"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/motion/AnimatedSection";
import { StaggerContainer } from "@/components/motion/StaggerContainer";
import { cardReveal } from "@/components/motion/variants";

export function UseCases() {
  const t = useTranslations("useCases");

  const cases = ["case1", "case2", "case3"] as const;

  return (
    <AnimatedSection className="py-20 px-6 lg:px-16" id="use-cases">
      <div className="max-w-content mx-auto">
        <h2 className="font-heading text-[36px] md:text-[48px] tracking-heading text-espresso text-center mb-16">
          {t("headline")}
        </h2>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cases.map((key) => (
            <motion.div
              key={key}
              variants={cardReveal}
              className="bg-white rounded-card p-8 border-l-4 border-orange"
            >
              <h3 className="font-heading text-xl tracking-heading-card text-espresso mb-4">
                {t(`${key}.title`)}
              </h3>
              <p className="font-body text-base text-muted-text leading-[170%] italic">
                &ldquo;{t(`${key}.quote`)}&rdquo;
              </p>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </AnimatedSection>
  );
}
