"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { EASE_CARD } from "@/components/motion/variants";
import { CardStack } from "./CardStack";

export function EvidenceFeed() {
  const t = useTranslations("showcase.feed");

  const bullets = [
    t("desc1"),
    t("desc2"),
    t("desc3"),
    t("desc4"),
    t("desc5"),
  ];

  return (
    <section id="product-showcase" className="bg-page-bg py-20 md:py-[80px] px-6 lg:px-16 overflow-hidden">
      <div className="max-w-content mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column — text */}
          <motion.div
            initial={{ opacity: 0, x: -148 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: EASE_CARD }}
          >
            <h2 className="font-heading text-[32px] md:text-[40px] lg:text-[48px] font-normal tracking-heading leading-[110%] text-espresso mb-8">
              {t("headline")}
            </h2>

            <ul className="space-y-4">
              {bullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-2 flex-shrink-0 w-2 h-2 rounded-full bg-orange" />
                  <span className="font-body text-base text-muted-text leading-[160%]">
                    {bullet}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right column — card stack */}
          <motion.div
            initial={{ opacity: 0, x: 148 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: EASE_CARD }}
          >
            <CardStack />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
