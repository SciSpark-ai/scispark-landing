"use client";
import { Home, MessageSquarePlus, FolderOpen, BookOpen, Clock, PanelLeftClose } from "lucide-react";
import { useTranslations } from "next-intl";
import { MOCK_RECENT_CHATS, MOCK_USER } from "./mock-data";

export type ViewId = "home" | "chat" | "projects" | "library" | "history";

export const NAV_ITEMS: { id: ViewId; labelKey: string; icon: typeof Home }[] = [
  { id: "home", labelKey: "navHome", icon: Home },
  { id: "chat", labelKey: "navChat", icon: MessageSquarePlus },
  { id: "projects", labelKey: "navProjects", icon: FolderOpen },
  { id: "library", labelKey: "navLibrary", icon: BookOpen },
  { id: "history", labelKey: "navHistory", icon: Clock },
];

interface MockSidebarProps {
  activeView: ViewId;
  onNavigate: (id: ViewId) => void;
  /** When true, render as icon-only rail: no labels, no wordmark, no recent chats, no user tile. */
  compact?: boolean;
  /** Show a close button at top (used by mobile overlay). */
  onClose?: () => void;
}

export function MockSidebar({ activeView, onNavigate, compact = false, onClose }: MockSidebarProps) {
  const t = useTranslations("homeMockup.sidebar");
  const initial = MOCK_USER.fullName.charAt(0).toUpperCase();

  return (
    <aside className="w-full h-full bg-page-warm flex flex-col p-3">
      {/* Top: toggle + wordmark */}
      <div className="mb-3 flex items-center gap-3 flex-shrink-0">
        <button
          onClick={onClose}
          className="px-3 py-2.5 text-muted-text hover:text-espresso transition-colors rounded-[10px] hover:bg-card-surface/50 flex items-center flex-shrink-0"
          aria-label="Collapse sidebar"
          type="button"
        >
          <PanelLeftClose size={18} strokeWidth={1.8} />
        </button>
        {!compact && (
          <span className="font-heading text-[22px] text-espresso tracking-heading leading-none whitespace-nowrap">
            SciSpark
          </span>
        )}
      </div>

      {/* Nav items */}
      <nav>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              type="button"
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[14px] tracking-body transition-colors ${
                isActive
                  ? "bg-card-surface text-espresso font-medium"
                  : "text-muted-text hover:bg-card-surface/50"
              }`}
            >
              <Icon size={18} strokeWidth={1.8} className="flex-shrink-0" />
              {!compact && (
                <span className="whitespace-nowrap">{t(item.labelKey)}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Recent chats + user tile — only in expanded variant */}
      {!compact && (
        <>
          <div className="flex-1 min-h-0 flex flex-col">
            <hr className="border-border-warm mx-[10px] my-[14px] flex-shrink-0" />
            <p className="text-[11px] uppercase tracking-[0.06em] text-muted-text font-medium px-3 pb-2">
              {t("recentChats")}
            </p>
            {MOCK_RECENT_CHATS.map((chat) => (
              <div
                key={chat.id}
                className="block text-[13px] text-muted-text px-3 py-1.5 rounded-[6px] truncate leading-[1.4]"
              >
                {chat.title}
              </div>
            ))}
          </div>
          <div>
            <hr className="border-border-warm mx-[10px] my-[14px]" />
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-[10px]">
              <div className="w-9 h-9 rounded-full bg-orange text-white flex items-center justify-center text-[14px] font-medium flex-shrink-0">
                {initial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-espresso font-medium truncate tracking-body">
                  {MOCK_USER.fullName}
                </p>
                <p className="text-[11px] text-muted-text truncate tracking-body">{MOCK_USER.email}</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Compact variant: push nav toward top with filler spacer */}
      {compact && <div className="flex-1" aria-hidden />}
    </aside>
  );
}
