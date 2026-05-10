"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { mockupReveal } from "@/components/motion/variants";
import { AppShell } from "./AppShell";
import { CursorDemoProvider, useCursorDemo, CaptionStrip } from "./cursor-demo";

function CaptionStripBound() {
  const { cursor } = useCursorDemo();
  return (
    <CaptionStrip
      captionKey={cursor.captionKey}
      activeBeatIndex={cursor.activeBeatIndex}
      visible={cursor.visible}
    />
  );
}

export function HomeMockup() {
  const t = useTranslations("homeMockup");

  return (
    <section
      aria-label={t("ariaLabel")}
      className="bg-page-bg pt-0 pb-24 md:pb-32 px-6 lg:px-16"
    >
      <div className="max-w-[1120px] mx-auto">
        <CursorDemoProvider>
          <motion.div
            variants={mockupReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="mt-8"
          >
            <div className="rounded-card shadow-lg border border-border-warm/30 overflow-hidden bg-white">
              <div className="flex items-center gap-[6px] px-4 py-3 bg-light-surface border-b border-border-warm/20">
                <span
                  className="w-3 h-3 rounded-full inline-block"
                  style={{ backgroundColor: "#fd5754", border: "1px solid #e04340" }}
                />
                <span
                  className="w-3 h-3 rounded-full inline-block"
                  style={{ backgroundColor: "#febb40", border: "1px solid #dfa52e" }}
                />
                <span
                  className="w-3 h-3 rounded-full inline-block"
                  style={{ backgroundColor: "#34c848", border: "1px solid #27ae38" }}
                />
                <div className="ml-3 flex-1 h-6 bg-card-surface/50 rounded-md flex items-center px-3">
                  <span className="text-[11px] text-muted-text tracking-body">scispark.ai/home</span>
                </div>
              </div>
              <AppShell />
            </div>
          </motion.div>
          <div className="hidden md:block">
            <CaptionStripBound />
          </div>
        </CursorDemoProvider>
      </div>
    </section>
  );
}
