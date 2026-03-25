"use client";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-page-bg border-t border-border-warm/30 py-8 px-6 lg:px-16">
      <div className="max-w-content mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col md:flex-row items-center gap-2">
          <span className="font-heading text-lg text-espresso">SciSpark</span>
          <span className="text-sm text-muted-text">{t("copyright")}</span>
        </div>

        <nav className="flex items-center gap-6">
          <a
            href="#"
            className="text-sm text-muted-text hover:text-espresso transition-colors"
          >
            {t("privacy")}
          </a>
          <a
            href="#"
            className="text-sm text-muted-text hover:text-espresso transition-colors"
          >
            {t("terms")}
          </a>
          <a
            href="#"
            className="text-sm text-muted-text hover:text-espresso transition-colors"
          >
            {t("contact")}
          </a>
        </nav>
      </div>
    </footer>
  );
}
