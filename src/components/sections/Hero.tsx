"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { WordReveal } from "@/components/motion/WordReveal";
import { EmailCapture } from "@/components/EmailCapture";
import { heroElement } from "@/components/motion/variants";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="bg-page-bg pt-[160px] pb-20 md:pt-[180px] px-6 lg:px-16">
      <div className="max-w-content mx-auto text-center">
        <motion.div initial="hidden" animate="visible">
          {/* Kicker badge */}
          <motion.div variants={heroElement} className="mb-6">
            <span className="inline-block px-4 py-1.5 rounded-badge bg-light-surface text-sm font-body font-medium text-muted-text">
              {t("kicker")}
            </span>
          </motion.div>

          {/* Headline */}
          <h1 className="font-heading text-[40px] md:text-[52px] lg:text-[62px] font-normal tracking-heading-tight leading-[110%] text-espresso mb-6">
            <WordReveal
              text={t("headline")}
              mutedWords={["that", "could"]}
              delay={1.0}
            />
          </h1>

          {/* Subhead */}
          <motion.p
            variants={heroElement}
            className="font-body text-lg md:text-xl text-muted-text tracking-body leading-[150%] max-w-2xl mx-auto mb-8"
          >
            {t("subhead")}
          </motion.p>

          {/* CTA row: email + buttons side by side */}
          <motion.div variants={heroElement} className="flex flex-col sm:flex-row items-stretch justify-center gap-3 max-w-2xl mx-auto">
            <EmailCapture source="hero" buttonLabel={t("ctaPrimary")} className="flex-1 w-full" />
            <a
              href="#product-showcase"
              className="inline-flex items-center justify-center border border-espresso/20 text-espresso text-base font-medium px-6 py-3 rounded-pill hover:border-espresso/40 transition whitespace-nowrap h-[48px]"
            >
              {t("ctaSecondary")}
            </a>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
