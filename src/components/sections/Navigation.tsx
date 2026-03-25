"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu } from "lucide-react";
import { MobileMenu } from "./MobileMenu";

const navLinks = [
  { key: "product", href: "#product-showcase" },
  { key: "howItWorks", href: "#how-it-works" },
  { key: "useCases", href: "#use-cases" },
  { key: "faq", href: "#faq" },
] as const;

function LanguageToggle() {
  function setLocale(locale: "en" | "zh") {
    document.cookie = `locale=${locale}; path=/; max-age=31536000`;
    window.location.reload();
  }

  return (
    <div className="flex items-center gap-1 text-sm text-muted-text">
      <button
        onClick={() => setLocale("en")}
        className="hover:text-espresso transition px-1"
      >
        EN
      </button>
      <span className="opacity-40">|</span>
      <button
        onClick={() => setLocale("zh")}
        className="hover:text-espresso transition px-1"
      >
        中文
      </button>
    </div>
  );
}

export function Navigation() {
  const t = useTranslations("nav");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-[65px] backdrop-blur-[5px] bg-[rgba(252,246,239,0.16)] border-b border-border-warm/20">
        <div className="max-w-container mx-auto px-6 lg:px-16 h-full flex items-center justify-between">
          {/* Logo */}
          <a
            href="/"
            className="font-heading text-2xl text-espresso hover:opacity-80 transition"
          >
            SciSpark
          </a>

          {/* Center nav — desktop only */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                className="text-sm font-body text-muted-text hover:text-espresso transition"
              >
                {t(link.key)}
              </a>
            ))}
          </nav>

          {/* Right side — desktop */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageToggle />
            <a
              href="#final-cta"
              className="bg-espresso text-white text-sm font-medium px-5 py-2.5 rounded-btn hover:opacity-90 transition"
            >
              {t("cta")}
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-espresso hover:text-muted-text transition"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
