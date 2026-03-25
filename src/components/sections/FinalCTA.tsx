"use client";
import { useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/motion/AnimatedSection";
import { EmailCapture } from "@/components/EmailCapture";

export function FinalCTA() {
  const t = useTranslations("finalCta");

  return (
    <AnimatedSection
      className="bg-page-bg py-20 px-6 lg:px-16"
      id="final-cta"
    >
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="font-heading text-[36px] md:text-[48px] tracking-heading text-espresso mb-4">
          {t("headline")}
        </h2>
        <p className="font-body text-lg text-muted-text leading-[150%] mb-8">
          {t("subhead")}
        </p>
        <EmailCapture
          source="footer-cta"
          buttonLabel={t("cta")}
          className="max-w-md mx-auto"
        />
      </div>
    </AnimatedSection>
  );
}
