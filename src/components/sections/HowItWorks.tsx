"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/motion/AnimatedSection";
import { StaggerContainer } from "@/components/motion/StaggerContainer";
import { cardReveal } from "@/components/motion/variants";

export function HowItWorks() {
  const t = useTranslations("howItWorks");

  const steps = [
    { key: "step1", number: 1 },
    { key: "step2", number: 2 },
    { key: "step3", number: 3 },
  ] as const;

  return (
    <AnimatedSection
      className="bg-[#fef7f0] py-20 px-6 lg:px-16"
      id="how-it-works"
    >
      <div className="max-w-content mx-auto">
        <h2 className="font-heading text-[36px] md:text-[48px] tracking-heading text-espresso text-center mb-16">
          {t("headline")}
        </h2>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map(({ key, number }) => (
            <motion.div key={key} variants={cardReveal}>
              <div className="w-12 h-12 rounded-full bg-orange text-white font-heading text-xl flex items-center justify-center mx-auto mb-6">
                {number}
              </div>
              <h3 className="font-heading text-2xl tracking-heading-card text-espresso mb-3 text-center">
                {t(`${key}.title`)}
              </h3>
              <p className="font-body text-base text-muted-text leading-[160%] text-center">
                {t(`${key}.desc`)}
              </p>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </AnimatedSection>
  );
}
