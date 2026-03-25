"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export function FlyWheelDivider() {
  const t = useTranslations("showcase");

  return (
    <div className="py-12 px-6 lg:px-16">
      <div className="max-w-content mx-auto flex items-center gap-4">
        <motion.div
          className="flex-1 h-px bg-gradient-to-r from-transparent via-orange to-transparent"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.span
          className="font-body text-sm md:text-base font-medium text-muted-text whitespace-nowrap"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {t("flywheel")}
        </motion.span>
        <motion.div
          className="flex-1 h-px bg-gradient-to-r from-transparent via-orange to-transparent"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}
