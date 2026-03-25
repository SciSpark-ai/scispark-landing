"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ChatMockup } from "./ChatMockup";

export function AIAgent() {
  const t = useTranslations("showcase.agent");

  const bullets = [
    t("desc1"),
    t("desc2"),
    t("desc3"),
    t("desc4"),
    t("desc5"),
  ];

  return (
    <section className="py-20 px-6 lg:px-16 overflow-hidden">
      <div className="max-w-container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left — ChatMockup */}
          <motion.div
            initial={{ opacity: 0, x: -148 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <ChatMockup />
          </motion.div>

          {/* Right — description */}
          <motion.div
            initial={{ opacity: 0, x: 148 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="font-heading text-[36px] md:text-[48px] font-normal tracking-heading leading-[110%] text-espresso mb-8">
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
        </div>
      </div>
    </section>
  );
}
