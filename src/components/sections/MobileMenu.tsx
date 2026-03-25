"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const navLinks = [
  { key: "product", href: "#product-showcase" },
  { key: "howItWorks", href: "#how-it-works" },
  { key: "useCases", href: "#use-cases" },
  { key: "faq", href: "#faq" },
] as const;

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const t = useTranslations("nav");

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-page-bg flex flex-col"
        >
          {/* Close button */}
          <div className="flex justify-end px-6 pt-5">
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="p-2 text-espresso hover:text-muted-text transition"
            >
              <X size={24} />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 flex flex-col items-center justify-center gap-8">
            {navLinks.map((link, i) => (
              <motion.a
                key={link.key}
                href={link.href}
                onClick={onClose}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.3 }}
                className="font-heading text-3xl text-espresso hover:text-muted-text transition"
              >
                {t(link.key)}
              </motion.a>
            ))}
          </nav>

          {/* CTA */}
          <div className="px-6 pb-12 flex justify-center">
            <a
              href="#final-cta"
              onClick={onClose}
              className="bg-espresso text-white text-sm font-medium px-8 py-3 rounded-btn hover:opacity-90 transition"
            >
              {t("cta")}
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
