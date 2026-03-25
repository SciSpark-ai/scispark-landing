"use client";
import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";

interface AnimatedStatProps {
  target: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export function AnimatedStat({ target, suffix = "", prefix = "", className }: AnimatedStatProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => prefix + Math.round(v).toLocaleString() + suffix);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      animate(count, target, { duration: 1.5, ease: "easeOut" });
    }
  }, [inView, count, target]);

  return <motion.span ref={ref} className={className}>{rounded}</motion.span>;
}
