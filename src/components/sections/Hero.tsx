"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { WordReveal } from "@/components/motion/WordReveal";
import { EmailCapture } from "@/components/EmailCapture";
import { BrowserMockup } from "./BrowserMockup";
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
          <h1 className="font-heading text-[48px] md:text-[56px] lg:text-[70px] font-normal tracking-heading-tight leading-[110%] text-espresso mb-6">
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

          {/* Email capture — primary CTA */}
          <motion.div variants={heroElement} className="mb-4">
            <EmailCapture source="hero" buttonLabel={t("ctaPrimary")} />
          </motion.div>

          {/* Secondary CTA */}
          <motion.div variants={heroElement} className="mb-4">
            <a
              href="#product-showcase"
              className="inline-block border border-espresso/20 text-espresso text-sm font-medium px-5 py-2.5 rounded-pill hover:border-espresso/40 transition"
            >
              {t("ctaSecondary")}
            </a>
          </motion.div>

          {/* Microcopy */}
          <motion.p
            variants={heroElement}
            className="text-sm text-muted-text/70"
          >
            {t("microcopy")}
          </motion.p>
        </motion.div>

        {/* Browser mockup below the fold */}
        <BrowserMockup />
      </div>
    </section>
  );
}
