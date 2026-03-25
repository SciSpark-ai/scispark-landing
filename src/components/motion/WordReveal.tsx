"use client";
import { motion } from "framer-motion";
import { EASE_HERO } from "./variants";

interface WordRevealProps {
  text: string;
  className?: string;
  mutedWords?: string[];
  delay?: number;
}

export function WordReveal({ text, className, mutedWords = [], delay = 0 }: WordRevealProps) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0.001, filter: "blur(6px)", y: 50 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ delay: delay + i * 0.08, duration: 0.8, ease: EASE_HERO }}
          style={{ display: "inline-block" }}
          className={mutedWords.includes(word.replace(/[.,!?]/g, "")) ? "text-muted-text" : ""}
        >
          {word}&nbsp;
        </motion.span>
      ))}
    </span>
  );
}
