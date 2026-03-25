"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { WordReveal } from "@/components/motion/WordReveal";
import { EmailCapture } from "@/components/EmailCapture";
import { BrowserMockup } from "./BrowserMockup";
import { heroElement } from "@/components/motion/variants";

function HeroMockupContent() {
  const miniPapers = [
    { color: "#6b7280", specialty: "PSYCHIATRY", title: "Stanford's 5-Day Brain Stimulation Protocol", journal: "Am J Psychiatry · 2020", stars: 5 },
    { color: "#ea580c", specialty: "CARDIOLOGY", title: "GLP-1 Agonists Reduce MACE by 14%", journal: "NEJM · 2025", stars: 5 },
    { color: "#d97706", specialty: "ONCOLOGY", title: "CAR-T Shows Durable Remission in Lymphoma", journal: "Lancet Oncol · 2025", stars: 4 },
  ];

  return (
    <div className="p-4 bg-page-bg flex gap-3">
      {miniPapers.map((paper, i) => (
        <div key={i} className="flex-1 bg-white rounded-xl overflow-hidden border border-border-warm/30">
          <div className="h-8" style={{ backgroundColor: paper.color }}>
            <span className="text-white/80 text-[9px] font-medium uppercase tracking-wider px-3 leading-8 block">{paper.specialty}</span>
          </div>
          <div className="p-3">
            <p className="font-heading text-xs font-normal text-espresso leading-tight line-clamp-2">{paper.title}</p>
            <p className="text-[9px] text-muted-text mt-1">{paper.journal}</p>
            <div className="flex gap-0.5 mt-2">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className={`w-2 h-2 rounded-full ${j < paper.stars ? "bg-warm-tan" : "bg-border-warm/50"}`} />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

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
        <BrowserMockup>
          <HeroMockupContent />
        </BrowserMockup>
      </div>
    </section>
  );
}
