"use client";
import { Menu } from "lucide-react";

interface MockMobileBarProps {
  onOpenSidebar: () => void;
}

export function MockMobileBar({ onOpenSidebar }: MockMobileBarProps) {
  return (
    <div className="md:hidden h-[50px] bg-page-warm border-b border-border-warm/60 flex items-center justify-between px-3">
      <button
        onClick={onOpenSidebar}
        className="p-2 text-muted-text hover:text-espresso transition-colors rounded-[8px] hover:bg-card-surface/50"
        aria-label="Open navigation"
        type="button"
      >
        <Menu size={18} strokeWidth={1.8} />
      </button>
      <span className="font-heading text-[20px] text-espresso tracking-heading leading-none">
        SciSpark
      </span>
      <div className="w-[34px]" aria-hidden />
    </div>
  );
}
