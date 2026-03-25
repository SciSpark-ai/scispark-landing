"use client";
import { motion } from "framer-motion";
import { mockupReveal } from "@/components/motion/variants";

interface BrowserMockupProps {
  children?: React.ReactNode;
}

export function BrowserMockup({ children }: BrowserMockupProps) {
  return (
    <motion.div
      variants={mockupReveal}
      className="mt-16 max-w-4xl mx-auto"
    >
      <div className="rounded-card shadow-lg border border-border-warm/30 overflow-hidden bg-white">
        {/* Title bar */}
        <div className="flex items-center gap-[6px] px-4 py-3 bg-light-surface border-b border-border-warm/20">
          {/* Traffic light dots */}
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
          {/* URL bar */}
          <div className="ml-3 flex-1 h-6 bg-card-surface/50 rounded-md" />
        </div>

        {/* Content area */}
        <div>
          {children ?? (
            <div className="h-[400px] bg-page-bg flex items-center justify-center">
              <p className="text-muted-text font-body text-sm">Product mockup</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
