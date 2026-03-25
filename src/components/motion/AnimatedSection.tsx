"use client";
import { motion } from "framer-motion";
import { sectionReveal } from "./variants";

export function AnimatedSection({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.section
      variants={sectionReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className={className}
    >
      {children}
    </motion.section>
  );
}
