"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/motion/AnimatedSection";
import { AnimatedStat } from "@/components/motion/AnimatedStat";
import { StaggerContainer } from "@/components/motion/StaggerContainer";
import { cardReveal } from "@/components/motion/variants";

export function ProblemStatement() {
  const t = useTranslations("problem");

  return (
    <AnimatedSection className="bg-page-warm py-20 md:py-[80px] px-6 lg:px-16">
      <div className="max-w-content mx-auto">
        <h2 className="font-heading text-[36px] md:text-[48px] lg:text-[56px] font-normal tracking-heading leading-[110%] text-espresso text-center mb-16">
          {t("headline")}
        </h2>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Stat Card 1 */}
          <motion.div
            variants={cardReveal}
            className="bg-card-surface rounded-card p-8 text-center"
          >
            <div className="font-heading text-[48px] md:text-[56px] font-normal tracking-heading text-espresso">
              <AnimatedStat target={3000} suffix="+" />
            </div>
            <p className="font-body text-base text-muted-text mt-2">
              {t("stat1.label")}
            </p>
          </motion.div>

          {/* Stat Card 2 */}
          <motion.div
            variants={cardReveal}
            className="bg-card-surface rounded-card p-8 text-center"
          >
            <div className="font-heading text-[48px] md:text-[56px] font-normal tracking-heading text-espresso">
              <AnimatedStat target={17} suffix="" />
            </div>
            <p className="font-body text-base text-muted-text mt-2">
              {t("stat2.label")}
            </p>
          </motion.div>

          {/* Stat Card 3 */}
          <motion.div
            variants={cardReveal}
            className="bg-card-surface rounded-card p-8 text-center"
          >
            <div className="font-heading text-[48px] md:text-[56px] font-normal tracking-heading text-espresso">
              <AnimatedStat target={250000} suffix="" />
            </div>
            <p className="font-body text-base text-muted-text mt-2">
              {t("stat3.label")}
            </p>
          </motion.div>
        </StaggerContainer>

        {/* Narrative quote */}
        <motion.blockquote
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="font-body text-lg md:text-xl text-muted-text italic leading-[170%]">
            &ldquo;{t("quote")}&rdquo;
          </p>
        </motion.blockquote>
      </div>
    </AnimatedSection>
  );
}
