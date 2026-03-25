"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/motion/AnimatedSection";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export function FAQ() {
  const t = useTranslations("faq");

  const keys = ["q1", "q2", "q3", "q4"] as const;

  return (
    <AnimatedSection className="bg-page-warm py-20 px-6 lg:px-16" id="faq">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-heading text-[36px] md:text-[48px] tracking-heading text-espresso text-center mb-16">
          {t("headline")}
        </h2>

        <Accordion className="space-y-3">
          {keys.map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <AccordionItem
                value={key}
                className="bg-card-surface rounded-faq px-6 border-none"
              >
                <AccordionTrigger className="font-heading text-lg font-normal text-espresso tracking-heading-card hover:no-underline py-5">
                  {t(`${key}.q`)}
                </AccordionTrigger>
                <AccordionContent className="font-body text-base text-muted-text leading-[170%] pb-5">
                  {t(`${key}.a`)}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </AnimatedSection>
  );
}
