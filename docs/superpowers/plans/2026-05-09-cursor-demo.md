# Cursor Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Layer an auto-playing fake macOS-style cursor over the existing `HomeMockup` section that walks visitors through a 5-beat narrative (Discover → Read → Save → Ask → Project) with both an in-frame tooltip and a caption strip below the frame.

**Architecture:** New isolated module at `src/components/sections/home-mockup/cursor-demo/`. A `CursorDemoProvider` hoists `activeView` and chat `query` state out of `AppShell`/`NewChatView` so a `useCursorScript` hook can drive them imperatively. Existing components get `data-cursor-target` attributes; nothing in their visual contract changes. The overlay (`CursorOverlay`, `DigestOverlay`) renders absolutely inside the AppShell; the caption (`CaptionStrip`) renders below the browser frame in `HomeMockup/index.tsx`.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, framer-motion 12, next-intl 4, Tailwind v4. No test framework — verification is `npm run lint`, `npm run build`, and manual browser checks at `http://localhost:3001`.

**Spec:** `docs/superpowers/specs/2026-05-09-cursor-demo-design.md`

---

## File map

**New files:**
- `src/components/sections/home-mockup/cursor-demo/script.ts`
- `src/components/sections/home-mockup/cursor-demo/CursorDemoContext.tsx`
- `src/components/sections/home-mockup/cursor-demo/useCursorScript.ts`
- `src/components/sections/home-mockup/cursor-demo/CursorOverlay.tsx`
- `src/components/sections/home-mockup/cursor-demo/DigestOverlay.tsx`
- `src/components/sections/home-mockup/cursor-demo/CaptionStrip.tsx`
- `src/components/sections/home-mockup/cursor-demo/index.ts`

**Modified files:**
- `messages/en.json` — add `homeMockup.cursorDemo.*` keys
- `messages/zh.json` — same
- `src/components/sections/home-mockup/MockSidebar.tsx` — add `data-cursor-target="sidebar-${id}"` on each nav button
- `src/components/sections/home-mockup/views/HomeView.tsx` — add `data-cursor-target="tab-for-you"` and `data-cursor-target="feed-card-0"` on the first card wrapper
- `src/components/sections/home-mockup/views/NewChatView.tsx` — read `query` from context if provided; add `data-cursor-target="chat-textarea"` and `data-cursor-target="chat-send"`
- `src/components/sections/home-mockup/views/ProjectsView.tsx` — add `data-cursor-target="project-card-0"` on the first project card wrapper
- `src/components/sections/home-mockup/AppShell.tsx` — read state from context, render `CursorOverlay` + `DigestOverlay`
- `src/components/sections/home-mockup/index.tsx` — wrap in `CursorDemoProvider`, render `CaptionStrip`

---

## Task 1: Add i18n strings for cursor demo

**Files:**
- Modify: `messages/en.json` — add `cursorDemo` block under `homeMockup`
- Modify: `messages/zh.json` — same shape

- [ ] **Step 1: Add `cursorDemo` block to `messages/en.json`**

Locate `"history"` block at line 150–156. After its closing `}` (line 156), add a comma and a new `cursorDemo` block. The result inside `homeMockup` should end like this:

```json
    "history": {
      "title": "History",
      "groupToday": "Today",
      "groupYesterday": "Yesterday",
      "groupThisWeek": "This Week",
      "groupEarlier": "Earlier"
    },
    "cursorDemo": {
      "tooltip": {
        "discover": "Skim today's evidence",
        "read": "Open the digest",
        "save": "Add to library",
        "openChat": "Open chat",
        "askAnything": "Ask anything",
        "send": "Send",
        "project": "Group by case"
      },
      "caption": {
        "discover": "Discover — your daily feed, ranked by relevance.",
        "read": "Read — paper summaries you can scan in 30 seconds.",
        "save": "Save — keep what matters within reach.",
        "ask": "Ask — get cited answers, not just links.",
        "project": "Project — organize research around a patient or topic."
      },
      "chatQuestion": "Latest evidence on SGLT2 inhibitors in HFpEF?",
      "digest": {
        "saveLabel": "Save"
      }
    }
```

- [ ] **Step 2: Add the same block to `messages/zh.json`** with translations:

```json
    "history": {
      "title": "历史",
      "groupToday": "今天",
      "groupYesterday": "昨天",
      "groupThisWeek": "本周",
      "groupEarlier": "更早"
    },
    "cursorDemo": {
      "tooltip": {
        "discover": "浏览今日证据",
        "read": "打开摘要",
        "save": "加入收藏",
        "openChat": "打开对话",
        "askAnything": "提问任何问题",
        "send": "发送",
        "project": "按病例分组"
      },
      "caption": {
        "discover": "发现 — 每日证据流，按相关性排序。",
        "read": "阅读 — 30 秒读完一篇论文摘要。",
        "save": "收藏 — 让重要内容触手可及。",
        "ask": "提问 — 获得有引用的临床答案。",
        "project": "项目 — 按患者或主题组织研究。"
      },
      "chatQuestion": "SGLT2 抑制剂在 HFpEF 中的最新证据？",
      "digest": {
        "saveLabel": "收藏"
      }
    }
```

- [ ] **Step 3: Verify JSON is valid**

Run: `node -e "JSON.parse(require('fs').readFileSync('messages/en.json','utf8')); JSON.parse(require('fs').readFileSync('messages/zh.json','utf8')); console.log('OK')"`
Expected: `OK`

- [ ] **Step 4: Commit**

```bash
git add messages/en.json messages/zh.json
git commit -m "feat(cursor-demo): add i18n strings for cursor demo tooltips and captions"
```

---

## Task 2: Add `data-cursor-target` attributes to existing components

These are pure passive markers — no behavior change, no new imports, no risk. Doing them all in one task because they're tightly related.

**Files:**
- Modify: `src/components/sections/home-mockup/MockSidebar.tsx`
- Modify: `src/components/sections/home-mockup/views/HomeView.tsx`
- Modify: `src/components/sections/home-mockup/views/NewChatView.tsx`
- Modify: `src/components/sections/home-mockup/views/ProjectsView.tsx`

- [ ] **Step 1: `MockSidebar.tsx` — add `data-cursor-target` on nav buttons**

In the nav button JSX (around line 56–71), add `data-cursor-target={`sidebar-${item.id}`}` on the `<button>`:

```tsx
<button
  key={item.id}
  onClick={() => onNavigate(item.id)}
  type="button"
  data-cursor-target={`sidebar-${item.id}`}
  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[14px] tracking-body transition-colors ${
    isActive
      ? "bg-card-surface text-espresso font-medium"
      : "text-muted-text hover:bg-card-surface/50"
  }`}
>
```

- [ ] **Step 2: `HomeView.tsx` — mark "For You" tab and first feed card**

In the tab button map (around line 40–53), add `data-cursor-target` only when `value === "for-you"`:

```tsx
{tabLabels.map(({ value, key }) => (
  <button
    key={value}
    onClick={() => setActiveTab(value)}
    type="button"
    data-cursor-target={value === "for-you" ? "tab-for-you" : undefined}
    className={`pb-2 px-1 text-[14px] tracking-body border-b-2 transition-colors ${
      activeTab === value
        ? "text-espresso font-medium border-orange"
        : "text-muted-text border-transparent hover:text-espresso"
    }`}
  >
    {t(key)}
  </button>
))}
```

In the feed card grid (around line 82–86), wrap the first FeedCard in a marker `<div>`. Replace:

```tsx
{papers.map((paper) => (
  <FeedCard key={paper.id} paper={paper} />
))}
```

with:

```tsx
{papers.map((paper, idx) => (
  <div key={paper.id} data-cursor-target={idx === 0 ? "feed-card-0" : undefined}>
    <FeedCard paper={paper} />
  </div>
))}
```

- [ ] **Step 3: `NewChatView.tsx` — mark textarea and send button**

Add `data-cursor-target="chat-textarea"` on the `<textarea>` (around line 49–55) and `data-cursor-target="chat-send"` on the send button div (around line 59–65). Note the send is a `<div>` not a `<button>` in the existing code — keep it as a `<div>` and add the marker:

```tsx
<textarea
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  placeholder={t("placeholder")}
  rows={2}
  data-cursor-target="chat-textarea"
  className="flex-1 text-[15px] text-espresso tracking-body placeholder:text-muted-text bg-transparent focus:outline-none resize-none"
/>
```

```tsx
<div
  data-cursor-target="chat-send"
  className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
    query.trim() ? "bg-orange text-white" : "bg-card-surface text-muted-text"
  }`}
>
  <ArrowUp size={16} />
</div>
```

- [ ] **Step 4: `ProjectsView.tsx` — mark first project card**

In the project card map (the `<div className="bg-white border border-border-warm/30 rounded-[14px] p-5 hover:shadow-sm transition-all group">` element), add `data-cursor-target` for the first one. The map currently uses `MOCK_PROJECTS.map((project) => (...))`. Change to include the index:

```tsx
{MOCK_PROJECTS.map((project, idx) => (
  <div
    key={project.id}
    data-cursor-target={idx === 0 ? "project-card-0" : undefined}
    className="bg-white border border-border-warm/30 rounded-[14px] p-5 hover:shadow-sm transition-all group"
  >
```

- [ ] **Step 5: Verify lint and types**

Run: `npm run lint`
Expected: passes (pre-existing warnings OK; no new errors)

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/home-mockup/MockSidebar.tsx \
        src/components/sections/home-mockup/views/HomeView.tsx \
        src/components/sections/home-mockup/views/NewChatView.tsx \
        src/components/sections/home-mockup/views/ProjectsView.tsx
git commit -m "feat(cursor-demo): add data-cursor-target attributes on demo touchpoints"
```

---

## Task 3: Create the script data file

**Files:**
- Create: `src/components/sections/home-mockup/cursor-demo/script.ts`

- [ ] **Step 1: Create the directory and script file**

Run: `mkdir -p src/components/sections/home-mockup/cursor-demo`

Create `src/components/sections/home-mockup/cursor-demo/script.ts` with:

```ts
import type { ViewId } from "../MockSidebar";

export type BeatId = "discover" | "read" | "save" | "ask" | "project";

export type CursorAction =
  | { kind: "hover" }
  | { kind: "click" }
  | { kind: "type"; textKey: string }
  | { kind: "navigate"; to: ViewId };

export interface BeatStep {
  /** value matched against `data-cursor-target` attributes on the live DOM */
  target: string;
  /** what the cursor does once it reaches the target */
  action: CursorAction;
  /** ms to dwell after the action completes before the next step */
  dwellMs: number;
  /** translation key under `homeMockup.cursorDemo.tooltip.*`; falsy = keep previous */
  tooltipKey?: string;
}

export interface Beat {
  id: BeatId;
  /** translation key under `homeMockup.cursorDemo.caption.*` */
  captionKey: string;
  steps: BeatStep[];
}

export const SCRIPT: Beat[] = [
  {
    id: "discover",
    captionKey: "discover",
    steps: [
      { target: "tab-for-you",  action: { kind: "hover" }, dwellMs: 700,  tooltipKey: "discover" },
      { target: "feed-card-0",  action: { kind: "hover" }, dwellMs: 1200, tooltipKey: "discover" },
    ],
  },
  {
    id: "read",
    captionKey: "read",
    steps: [
      { target: "feed-card-0",  action: { kind: "click" }, dwellMs: 900,  tooltipKey: "read" },
    ],
  },
  {
    id: "save",
    captionKey: "save",
    steps: [
      { target: "digest-save",  action: { kind: "click" }, dwellMs: 1100, tooltipKey: "save" },
    ],
  },
  {
    id: "ask",
    captionKey: "ask",
    steps: [
      { target: "sidebar-chat",   action: { kind: "navigate", to: "chat" }, dwellMs: 500, tooltipKey: "openChat" },
      { target: "chat-textarea",  action: { kind: "type", textKey: "chatQuestion" }, dwellMs: 600, tooltipKey: "askAnything" },
      { target: "chat-send",      action: { kind: "click" }, dwellMs: 1200, tooltipKey: "send" },
    ],
  },
  {
    id: "project",
    captionKey: "project",
    steps: [
      { target: "sidebar-projects", action: { kind: "navigate", to: "projects" }, dwellMs: 500, tooltipKey: "project" },
      { target: "project-card-0",   action: { kind: "hover" }, dwellMs: 1500, tooltipKey: "project" },
    ],
  },
];
```

- [ ] **Step 2: Verify types compile**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/home-mockup/cursor-demo/script.ts
git commit -m "feat(cursor-demo): add script data file with 5-beat sequence"
```

---

## Task 4: Create CursorDemoContext + provider

This task creates the context with **stub state only** (no script driving). Later tasks plug `useCursorScript` into it. The provider exists from this task on so the build stays green.

**Files:**
- Create: `src/components/sections/home-mockup/cursor-demo/CursorDemoContext.tsx`

- [ ] **Step 1: Create the context file**

```tsx
"use client";
import { createContext, useContext, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import type { ViewId } from "../MockSidebar";

export interface CursorScriptState {
  cursorX: number;
  cursorY: number;
  visible: boolean;
  tooltipKey: string | null;
  captionKey: string | null;
  activeBeatIndex: number;
  digestOpen: boolean;
  ripple: { x: number; y: number; nonce: number } | null;
}

const DEFAULT_SCRIPT_STATE: CursorScriptState = {
  cursorX: 0,
  cursorY: 0,
  visible: false,
  tooltipKey: null,
  captionKey: null,
  activeBeatIndex: 0,
  digestOpen: false,
  ripple: null,
};

interface CursorDemoContextValue {
  // hoisted AppShell state
  activeView: ViewId;
  setActiveViewFromUser: (v: ViewId) => void;
  setActiveViewFromScript: (v: ViewId) => void;
  // hoisted chat textarea state
  query: string;
  setQueryFromUser: (q: string) => void;
  setQueryFromScript: (q: string) => void;
  // mockup root ref (used by useCursorScript for IntersectionObserver + getBoundingClientRect)
  mockupRef: RefObject<HTMLDivElement | null>;
  // current cursor / animation state, written by useCursorScript
  scriptState: CursorScriptState;
}

const CursorDemoContext = createContext<CursorDemoContextValue | null>(null);

export function useCursorDemo(): CursorDemoContextValue {
  const ctx = useContext(CursorDemoContext);
  if (!ctx) {
    throw new Error("useCursorDemo must be used inside <CursorDemoProvider>");
  }
  return ctx;
}

/** Optional read — returns null when no provider (e.g. component used in isolation). */
export function useCursorDemoOptional(): CursorDemoContextValue | null {
  return useContext(CursorDemoContext);
}

interface CursorDemoProviderProps {
  children: ReactNode;
}

export function CursorDemoProvider({ children }: CursorDemoProviderProps) {
  const [activeView, setActiveView] = useState<ViewId>("home");
  const [query, setQuery] = useState<string>("");
  const mockupRef = useRef<HTMLDivElement | null>(null);

  // Ref-mirrors so the script signal can flag "user took control" in later tasks.
  // For now the two setters behave identically.
  const setActiveViewFromUser = (v: ViewId) => setActiveView(v);
  const setActiveViewFromScript = (v: ViewId) => setActiveView(v);
  const setQueryFromUser = (q: string) => setQuery(q);
  const setQueryFromScript = (q: string) => setQuery(q);

  const value = useMemo<CursorDemoContextValue>(
    () => ({
      activeView,
      setActiveViewFromUser,
      setActiveViewFromScript,
      query,
      setQueryFromUser,
      setQueryFromScript,
      mockupRef,
      scriptState: DEFAULT_SCRIPT_STATE,
    }),
    [activeView, query],
  );

  return <CursorDemoContext.Provider value={value}>{children}</CursorDemoContext.Provider>;
}
```

- [ ] **Step 2: Verify types compile**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/home-mockup/cursor-demo/CursorDemoContext.tsx
git commit -m "feat(cursor-demo): add CursorDemoContext with hoisted view/query state"
```

---

## Task 5: Wire `AppShell` and `NewChatView` to read state from the context

Before this task: `AppShell` owns `activeView` locally and `NewChatView` owns `query` locally. After this task: both read/write through `CursorDemoProvider`. The provider isn't yet rendered (Task 9 wires that up), so we use the **optional** hook with a local fallback so the components still work when used outside a provider.

**Files:**
- Modify: `src/components/sections/home-mockup/AppShell.tsx`
- Modify: `src/components/sections/home-mockup/views/NewChatView.tsx`

- [ ] **Step 1: Refactor `AppShell.tsx`**

Replace the entire file contents with:

```tsx
"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MockSidebar, type ViewId } from "./MockSidebar";
import { MockMobileBar } from "./MockMobileBar";
import { HomeView } from "./views/HomeView";
import { NewChatView } from "./views/NewChatView";
import { ProjectsView } from "./views/ProjectsView";
import { LibraryView } from "./views/LibraryView";
import { HistoryView } from "./views/HistoryView";
import { useCursorDemoOptional } from "./cursor-demo/CursorDemoContext";

export function AppShell() {
  const ctx = useCursorDemoOptional();
  const [localView, setLocalView] = useState<ViewId>("home");
  const activeView = ctx?.activeView ?? localView;
  const setActiveView = ctx?.setActiveViewFromUser ?? setLocalView;

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  function handleNavigate(id: ViewId) {
    setActiveView(id);
    setMobileSidebarOpen(false);
  }

  return (
    <div ref={ctx?.mockupRef} className="relative flex h-[640px] md:h-[720px] bg-page-bg">
      {/* md rail — icon-only */}
      <div className="hidden md:block lg:hidden w-[60px] flex-shrink-0 border-r border-border-warm overflow-hidden">
        <MockSidebar activeView={activeView} onNavigate={handleNavigate} compact />
      </div>

      {/* lg full sidebar */}
      <div className="hidden lg:block w-[240px] flex-shrink-0 border-r border-border-warm overflow-hidden">
        <MockSidebar activeView={activeView} onNavigate={handleNavigate} />
      </div>

      {/* Main pane */}
      <main className="flex-1 min-w-0 overflow-y-auto flex flex-col">
        <MockMobileBar onOpenSidebar={() => setMobileSidebarOpen(true)} />
        <div className="flex-1 min-h-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="h-full"
            >
              {activeView === "home" && <HomeView />}
              {activeView === "chat" && <NewChatView />}
              {activeView === "projects" && <ProjectsView />}
              {activeView === "library" && <LibraryView />}
              {activeView === "history" && <HistoryView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile overlay sidebar */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden absolute inset-0 bg-espresso/20 z-20"
            />
            <motion.div
              key="panel"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden absolute inset-y-0 left-0 w-[260px] z-30 shadow-lg"
            >
              <MockSidebar
                activeView={activeView}
                onNavigate={handleNavigate}
                onClose={() => setMobileSidebarOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 2: Refactor `NewChatView.tsx`** to read `query` from context if available

Replace the file contents with:

```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Search, ArrowUp, Plus, GitCompare, FileText, Scale } from "lucide-react";
import { useCursorDemoOptional } from "../cursor-demo/CursorDemoContext";

export function NewChatView() {
  const t = useTranslations("homeMockup.chat");
  const ctx = useCursorDemoOptional();
  const [localQuery, setLocalQuery] = useState("");
  const query = ctx?.query ?? localQuery;
  const setQuery = ctx?.setQueryFromUser ?? setLocalQuery;

  const [flash, setFlash] = useState(false);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const suggestions = [
    { key: "chipCompare", icon: GitCompare },
    { key: "chipSummarize", icon: FileText },
    { key: "chipGuidelines", icon: Search },
    { key: "chipRisk", icon: Scale },
  ];

  function handleChip(label: string) {
    setQuery(label);
    setFlash(true);
    if (flashTimer.current) clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setFlash(false), 200);
  }

  useEffect(() => {
    return () => {
      if (flashTimer.current) clearTimeout(flashTimer.current);
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[560px]">
      <div className="w-full max-w-[640px] px-6 text-center">
        <h1 className="font-heading text-[44px] md:text-[56px] text-espresso tracking-heading-tight leading-none">
          SciSpark
        </h1>
        <p className="text-[14px] text-muted-text tracking-body mt-1">{t("tagline")}</p>

        <div className="mt-8">
          <div
            className={`bg-white border rounded-[16px] px-5 pt-4 pb-3 transition-all ${
              flash ? "border-orange ring-2 ring-orange/30" : "border-border-warm"
            }`}
          >
            <div className="flex items-start gap-3">
              <Search size={18} className="text-muted-text flex-shrink-0 mt-1" />
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("placeholder")}
                rows={2}
                data-cursor-target="chat-textarea"
                className="flex-1 text-[15px] text-espresso tracking-body placeholder:text-muted-text bg-transparent focus:outline-none resize-none"
              />
            </div>
            <div className="flex items-center justify-between mt-3">
              <Plus size={16} className="text-muted-text" />
              <div
                data-cursor-target="chat-send"
                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                  query.trim() ? "bg-orange text-white" : "bg-card-surface text-muted-text"
                }`}
              >
                <ArrowUp size={16} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-5">
          {suggestions.map((s) => {
            const Icon = s.icon;
            const label = t(s.key);
            return (
              <button
                key={s.key}
                onClick={() => handleChip(label)}
                type="button"
                className="bg-card-surface border border-border-warm rounded-pill px-3 py-1.5 text-[13px] text-espresso hover:bg-border-warm transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                <Icon size={14} className="text-orange" />
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify build**

Run: `npx tsc --noEmit`
Expected: no errors.

Run: `npm run lint`
Expected: passes.

- [ ] **Step 4: Browser smoke test**

If dev server is not running, start it: `npm run dev`. Open `http://localhost:3001`. Scroll to HomeMockup. Click each sidebar item — views should switch as before. Click a chat suggestion chip — textarea should fill. The behavior must be identical to before this task. (No cursor demo yet.)

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/home-mockup/AppShell.tsx \
        src/components/sections/home-mockup/views/NewChatView.tsx
git commit -m "feat(cursor-demo): hoist activeView and chat query into CursorDemoContext"
```

---

## Task 6: Implement `useCursorScript` hook

This is the brain of the demo. State machine + script playback + target resolution.

**Files:**
- Create: `src/components/sections/home-mockup/cursor-demo/useCursorScript.ts`

- [ ] **Step 1: Create the hook**

```ts
"use client";
import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { animate, useMotionValue, type MotionValue } from "framer-motion";
import { SCRIPT, type Beat, type BeatStep } from "./script";
import type { ViewId } from "../MockSidebar";

export type ScriptMode = "idle" | "playing" | "paused" | "userControlled";

interface UseCursorScriptArgs {
  mockupRef: RefObject<HTMLDivElement | null>;
  setActiveViewFromScript: (v: ViewId) => void;
  setQueryFromScript: (q: string) => void;
  /** Localized text for type actions, keyed by `homeMockup.cursorDemo.<textKey>` */
  resolveText: (textKey: string) => string;
}

export interface UseCursorScriptResult {
  x: MotionValue<number>;
  y: MotionValue<number>;
  visible: boolean;
  tooltipKey: string | null;
  captionKey: string | null;
  activeBeatIndex: number;
  digestOpen: boolean;
  digestSaved: boolean;
  ripple: { x: number; y: number; nonce: number } | null;
  mode: ScriptMode;
  notifyMouseEnter: () => void;
  notifyMouseLeave: () => void;
  notifyUserNavigated: () => void;
}

const REDUCED_MOTION =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const SPRING = { type: "spring" as const, stiffness: 90, damping: 18 };
const DESKTOP_MIN_WIDTH = 768; // md breakpoint

function distance(ax: number, ay: number, bx: number, by: number): number {
  return Math.hypot(bx - ax, by - ay);
}

async function nextFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

async function findTarget(
  root: HTMLElement,
  selectorValue: string,
  retries = 3,
): Promise<DOMRect | null> {
  for (let i = 0; i < retries; i++) {
    const el = root.querySelector<HTMLElement>(`[data-cursor-target="${selectorValue}"]`);
    if (el) {
      const rootRect = root.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      return new DOMRect(
        r.left - rootRect.left,
        r.top - rootRect.top,
        r.width,
        r.height,
      );
    }
    await nextFrame();
  }
  return null;
}

export function useCursorScript({
  mockupRef,
  setActiveViewFromScript,
  setQueryFromScript,
  resolveText,
}: UseCursorScriptArgs): UseCursorScriptResult {
  const x = useMotionValue(20);
  const y = useMotionValue(20);

  const [visible, setVisible] = useState(false);
  const [tooltipKey, setTooltipKey] = useState<string | null>(null);
  const [captionKey, setCaptionKey] = useState<string | null>(null);
  const [activeBeatIndex, setActiveBeatIndex] = useState(0);
  const [digestOpen, setDigestOpen] = useState(false);
  const [digestSaved, setDigestSaved] = useState(false);
  const [ripple, setRipple] = useState<{ x: number; y: number; nonce: number } | null>(null);
  const [mode, setMode] = useState<ScriptMode>("idle");

  const modeRef = useRef<ScriptMode>("idle");
  const cancelTokenRef = useRef(0);
  const pauseSignalRef = useRef<{ resolve?: () => void }>({});

  // Keep modeRef in sync so the async runner can read latest synchronously.
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  function setModeBoth(next: ScriptMode) {
    modeRef.current = next;
    setMode(next);
  }

  /** Block until mode is not "paused". Resolves immediately if already not paused. */
  async function awaitNotPaused(): Promise<void> {
    if (modeRef.current !== "paused") return;
    return new Promise<void>((resolve) => {
      pauseSignalRef.current.resolve = resolve;
    });
  }

  function releasePauseGate() {
    const resolve = pauseSignalRef.current.resolve;
    pauseSignalRef.current.resolve = undefined;
    if (resolve) resolve();
  }

  async function moveTo(toX: number, toY: number, fromX: number, fromY: number): Promise<void> {
    if (REDUCED_MOTION) {
      x.set(toX);
      y.set(toY);
      return;
    }
    const dist = distance(fromX, fromY, toX, toY);
    const duration = Math.min(0.6, Math.max(0.28, dist / 1000));
    await Promise.all([
      animate(x, toX, { ...SPRING, duration }).then(() => undefined),
      animate(y, toY, { ...SPRING, duration }).then(() => undefined),
    ]);
  }

  async function delay(ms: number, token: number): Promise<boolean> {
    const start = performance.now();
    while (performance.now() - start < ms) {
      if (cancelTokenRef.current !== token) return false;
      await awaitNotPaused();
      await new Promise((r) => setTimeout(r, Math.min(50, ms)));
    }
    return cancelTokenRef.current === token;
  }

  function fireRipple(rx: number, ry: number) {
    setRipple({ x: rx, y: ry, nonce: performance.now() });
  }

  async function runStep(step: BeatStep, token: number): Promise<boolean> {
    const root = mockupRef.current;
    if (!root) return false;

    const targetRect = await findTarget(root, step.target);
    if (!targetRect || cancelTokenRef.current !== token) return cancelTokenRef.current === token;

    if (step.tooltipKey) setTooltipKey(step.tooltipKey);

    const targetX = targetRect.left + targetRect.width / 2;
    const targetY = targetRect.top + targetRect.height / 2;

    await awaitNotPaused();
    if (cancelTokenRef.current !== token) return false;
    await moveTo(targetX, targetY, x.get(), y.get());
    if (cancelTokenRef.current !== token) return false;

    switch (step.action.kind) {
      case "hover":
        break;
      case "click":
        fireRipple(targetX, targetY);
        if (step.target === "feed-card-0") {
          setDigestSaved(false);
          setDigestOpen(true);
        }
        if (step.target === "digest-save") {
          setDigestSaved(true);
          // close the overlay shortly after the saved feedback so beat 4 starts clean
          setTimeout(() => setDigestOpen(false), 700);
        }
        break;
      case "navigate":
        fireRipple(targetX, targetY);
        setActiveViewFromScript(step.action.to);
        // give the AnimatePresence transition time to mount the new view
        await delay(280, token);
        break;
      case "type": {
        const text = resolveText(step.action.textKey);
        for (let i = 1; i <= text.length; i++) {
          if (cancelTokenRef.current !== token) return false;
          await awaitNotPaused();
          setQueryFromScript(text.slice(0, i));
          if (REDUCED_MOTION) break;
          const jitter = 50 + (Math.random() - 0.5) * 30;
          await new Promise((r) => setTimeout(r, jitter));
        }
        if (REDUCED_MOTION) setQueryFromScript(text);
        break;
      }
    }

    if (!(await delay(step.dwellMs, token))) return false;
    return true;
  }

  async function runBeat(beat: Beat, token: number): Promise<boolean> {
    setCaptionKey(beat.captionKey);
    for (const step of beat.steps) {
      const ok = await runStep(step, token);
      if (!ok) return false;
    }
    return true;
  }

  async function runScriptLoop(token: number): Promise<void> {
    setVisible(true);
    while (cancelTokenRef.current === token) {
      for (let i = 0; i < SCRIPT.length; i++) {
        if (cancelTokenRef.current !== token) return;
        setActiveBeatIndex(i);
        const ok = await runBeat(SCRIPT[i], token);
        if (!ok) return;
      }
      // Loop: reset to home view before restarting beat 1
      setActiveViewFromScript("home");
      setQueryFromScript("");
      setDigestOpen(false);
      setDigestSaved(false);
      await delay(800, token);
    }
  }

  // IntersectionObserver: kick off / tear down the script loop based on viewport visibility.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth < DESKTOP_MIN_WIDTH) return; // mobile: never run
    const root = mockupRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && modeRef.current === "idle") {
            const token = ++cancelTokenRef.current;
            setModeBoth("playing");
            void runScriptLoop(token);
          } else if (!entry.isIntersecting && modeRef.current !== "userControlled") {
            cancelTokenRef.current++;
            releasePauseGate();
            setVisible(false);
            setActiveBeatIndex(0);
            setTooltipKey(null);
            setCaptionKey(null);
            setDigestOpen(false);
            setDigestSaved(false);
            setModeBoth("idle");
          }
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(root);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mockupRef]);

  // Pause / resume hooks consumed by AppShell mouse handlers
  function notifyMouseEnter() {
    if (modeRef.current === "playing") setModeBoth("paused");
  }
  function notifyMouseLeave() {
    if (modeRef.current === "paused") {
      setTimeout(() => {
        if (modeRef.current === "paused") {
          setModeBoth("playing");
          releasePauseGate();
        }
      }, 800);
    }
  }
  function notifyUserNavigated() {
    cancelTokenRef.current++;
    releasePauseGate();
    setVisible(false);
    setDigestOpen(false);
    setDigestSaved(false);
    setTooltipKey(null);
    setCaptionKey(null);
    setActiveBeatIndex(0);
    setModeBoth("userControlled");
  }

  return {
    x,
    y,
    visible,
    tooltipKey,
    captionKey,
    activeBeatIndex,
    digestOpen,
    digestSaved,
    ripple,
    mode,
    notifyMouseEnter,
    notifyMouseLeave,
    notifyUserNavigated,
  };
}
```

- [ ] **Step 2: Verify types compile**

Run: `npx tsc --noEmit`
Expected: no errors.

Run: `npm run lint`
Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/home-mockup/cursor-demo/useCursorScript.ts
git commit -m "feat(cursor-demo): implement useCursorScript playback hook"
```

---

## Task 7: Implement `CursorOverlay` component

**Files:**
- Create: `src/components/sections/home-mockup/cursor-demo/CursorOverlay.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";
import { AnimatePresence, motion, type MotionValue } from "framer-motion";
import { useTranslations } from "next-intl";

interface CursorOverlayProps {
  x: MotionValue<number>;
  y: MotionValue<number>;
  visible: boolean;
  tooltipKey: string | null;
  ripple: { x: number; y: number; nonce: number } | null;
}

export function CursorOverlay({
  x,
  y,
  visible,
  tooltipKey,
  ripple,
}: CursorOverlayProps) {
  const t = useTranslations("homeMockup.cursorDemo.tooltip");

  return (
    <div className="pointer-events-none absolute inset-0 z-40" aria-hidden="true">
      {/* Click ripple — keyed on nonce so each click remounts */}
      <AnimatePresence>
        {ripple && (
          <motion.div
            key={ripple.nonce}
            initial={{ opacity: 0.45, scale: 0.2 }}
            animate={{ opacity: 0, scale: 1 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="absolute w-6 h-6 rounded-full border-2 border-orange"
            style={{
              left: ripple.x - 12,
              top: ripple.y - 12,
            }}
          />
        )}
      </AnimatePresence>

      {/* Cursor + tooltip */}
      <motion.div
        style={{ x, y, opacity: visible ? 1 : 0 }}
        transition={{ opacity: { duration: 0.18 } }}
        className="absolute top-0 left-0 will-change-transform"
      >
        {/* macOS arrow — anchored at hotspot (1,1) inside SVG; offset so the tip sits at (0,0) */}
        <svg
          width="22"
          height="26"
          viewBox="0 0 22 26"
          className="absolute -translate-x-[1px] -translate-y-[1px] drop-shadow-[0_2px_3px_rgba(0,0,0,0.25)]"
        >
          <path
            d="M2 2 L2 22 L7.5 17 L11 24 L13.5 22.7 L10 16 L18 16 Z"
            fill="#1f1f1f"
            stroke="#ffffff"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>

        {/* Tooltip chip — appears below-right of cursor */}
        <AnimatePresence mode="wait">
          {tooltipKey && (
            <motion.div
              key={tooltipKey}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 0 }}
              transition={{ duration: 0.18 }}
              className="absolute left-[18px] top-[24px] whitespace-nowrap rounded-[8px] bg-espresso text-white text-[12px] tracking-body px-2.5 py-1 shadow-md"
            >
              {t(tooltipKey)}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/home-mockup/cursor-demo/CursorOverlay.tsx
git commit -m "feat(cursor-demo): add CursorOverlay with macOS arrow, tooltip, and ripple"
```

---

## Task 8: Implement `DigestOverlay`

A small read panel that appears when Beat 2 fires. It shows the first feed paper's title + summary and provides a Save button (`data-cursor-target="digest-save"`) that Beat 3 clicks.

**Files:**
- Create: `src/components/sections/home-mockup/cursor-demo/DigestOverlay.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { MOCK_PAPERS, FEED_SLICES } from "../mock-data";

interface DigestOverlayProps {
  open: boolean;
  saved: boolean;
}

export function DigestOverlay({ open, saved }: DigestOverlayProps) {
  const t = useTranslations("homeMockup.cursorDemo.digest");

  // Source paper = first paper in the For You slice (matches feed-card-0)
  const paperId = FEED_SLICES["for-you"][0];
  const paper = MOCK_PAPERS.find((p) => p.id === paperId);

  if (!paper) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="digest"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden="true"
          className="pointer-events-none absolute z-30 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(420px,80%)] rounded-[18px] bg-white border border-border-warm shadow-[0_18px_60px_rgba(43,30,20,0.18)] overflow-hidden"
        >
          <div
            className="h-[6px]"
            style={{ backgroundColor: paper.specialtyColor }}
          />
          <div className="p-5">
            <p className="text-[11px] uppercase tracking-[0.06em] text-muted-text font-medium">
              {paper.tags[0] ?? paper.specialty}
            </p>
            <h3 className="font-heading text-[18px] text-espresso tracking-heading-card leading-[1.3] mt-1">
              {paper.title}
            </h3>
            <p className="text-[13px] text-muted-text tracking-body mt-2 line-clamp-3">
              {paper.summary}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-[11px] text-muted-text tracking-body">
                {paper.journal} · {paper.year}
              </p>
              <div
                data-cursor-target="digest-save"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-[13px] font-medium transition-colors ${
                  saved
                    ? "bg-orange/10 text-orange"
                    : "bg-card-surface text-espresso"
                }`}
              >
                {saved ? <Check size={14} /> : <Bookmark size={14} />}
                {t("saveLabel")}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

> **Note:** `mock-data.ts` already exports `FEED_SLICES` and `MOCK_PAPERS` — verified in `src/components/sections/home-mockup/views/HomeView.tsx`. If `FEED_SLICES["for-you"]` is empty for any reason, the component returns `null` (no crash).

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/home-mockup/cursor-demo/DigestOverlay.tsx
git commit -m "feat(cursor-demo): add DigestOverlay with paper preview and Save button"
```

---

## Task 9: Implement `CaptionStrip`

**Files:**
- Create: `src/components/sections/home-mockup/cursor-demo/CaptionStrip.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { SCRIPT } from "./script";

interface CaptionStripProps {
  captionKey: string | null;
  activeBeatIndex: number;
  visible: boolean;
}

export function CaptionStrip({ captionKey, activeBeatIndex, visible }: CaptionStripProps) {
  const t = useTranslations("homeMockup.cursorDemo.caption");

  return (
    <div
      aria-hidden="true"
      className={`mt-6 flex flex-col items-center gap-3 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="h-[1.6em] flex items-center text-center px-4">
        <AnimatePresence mode="wait">
          {captionKey && (
            <motion.p
              key={captionKey}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="font-heading text-[18px] md:text-[20px] text-espresso tracking-heading"
            >
              {t(captionKey)}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      <div className="flex items-center gap-2">
        {SCRIPT.map((beat, idx) => {
          const isActive = idx === activeBeatIndex;
          const isComplete = idx < activeBeatIndex;
          return (
            <span
              key={beat.id}
              className={`block rounded-full transition-all duration-300 ${
                isActive
                  ? "w-6 h-1.5 bg-orange"
                  : isComplete
                    ? "w-1.5 h-1.5 bg-orange/60"
                    : "w-1.5 h-1.5 bg-border-warm"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/home-mockup/cursor-demo/CaptionStrip.tsx
git commit -m "feat(cursor-demo): add CaptionStrip with phase text and step dots"
```

---

## Task 10: Activate the script in `CursorDemoProvider` + barrel export

Replace the stub script state in the provider with a real `useCursorScript` invocation, and create the barrel `index.ts`.

**Files:**
- Modify: `src/components/sections/home-mockup/cursor-demo/CursorDemoContext.tsx`
- Create: `src/components/sections/home-mockup/cursor-demo/index.ts`

- [ ] **Step 1: Replace `CursorDemoContext.tsx` with the activated version**

```tsx
"use client";
import {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { useTranslations } from "next-intl";
import type { MotionValue } from "framer-motion";
import type { ViewId } from "../MockSidebar";
import { useCursorScript, type ScriptMode } from "./useCursorScript";

interface CursorDemoContextValue {
  activeView: ViewId;
  setActiveViewFromUser: (v: ViewId) => void;
  setActiveViewFromScript: (v: ViewId) => void;
  query: string;
  setQueryFromUser: (q: string) => void;
  setQueryFromScript: (q: string) => void;
  mockupRef: RefObject<HTMLDivElement | null>;
  cursor: {
    x: MotionValue<number>;
    y: MotionValue<number>;
    visible: boolean;
    tooltipKey: string | null;
    captionKey: string | null;
    activeBeatIndex: number;
    digestOpen: boolean;
    digestSaved: boolean;
    ripple: { x: number; y: number; nonce: number } | null;
    mode: ScriptMode;
    notifyMouseEnter: () => void;
    notifyMouseLeave: () => void;
    notifyUserNavigated: () => void;
  };
}

const CursorDemoContext = createContext<CursorDemoContextValue | null>(null);

export function useCursorDemo(): CursorDemoContextValue {
  const ctx = useContext(CursorDemoContext);
  if (!ctx) throw new Error("useCursorDemo must be used inside <CursorDemoProvider>");
  return ctx;
}

export function useCursorDemoOptional(): CursorDemoContextValue | null {
  return useContext(CursorDemoContext);
}

interface CursorDemoProviderProps {
  children: ReactNode;
}

export function CursorDemoProvider({ children }: CursorDemoProviderProps) {
  const tDemo = useTranslations("homeMockup.cursorDemo");

  const [activeView, setActiveView] = useState<ViewId>("home");
  const [query, setQuery] = useState<string>("");
  const mockupRef = useRef<HTMLDivElement | null>(null);

  // user-vs-script signaling
  const cursor = useCursorScript({
    mockupRef,
    setActiveViewFromScript: setActiveView,
    setQueryFromScript: setQuery,
    resolveText: (key) => tDemo(key),
  });

  function setActiveViewFromUser(v: ViewId) {
    cursor.notifyUserNavigated();
    setActiveView(v);
  }
  function setQueryFromUser(q: string) {
    cursor.notifyUserNavigated();
    setQuery(q);
  }

  const value = useMemo<CursorDemoContextValue>(
    () => ({
      activeView,
      setActiveViewFromUser,
      setActiveViewFromScript: setActiveView,
      query,
      setQueryFromUser,
      setQueryFromScript: setQuery,
      mockupRef,
      cursor,
    }),
    // setActiveViewFromUser/setQueryFromUser are stable wrt cursor, included via cursor
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeView, query, cursor],
  );

  return <CursorDemoContext.Provider value={value}>{children}</CursorDemoContext.Provider>;
}
```

> **Note:** This refactor changes the provider's value shape — it now exposes a `cursor` sub-object instead of a flat `scriptState`. Task 11 wires the consumer (AppShell) to read from `cursor`.

- [ ] **Step 2: Create the barrel export**

Create `src/components/sections/home-mockup/cursor-demo/index.ts`:

```ts
export { CursorDemoProvider, useCursorDemo, useCursorDemoOptional } from "./CursorDemoContext";
export { CursorOverlay } from "./CursorOverlay";
export { DigestOverlay } from "./DigestOverlay";
export { CaptionStrip } from "./CaptionStrip";
export { SCRIPT } from "./script";
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/home-mockup/cursor-demo/CursorDemoContext.tsx \
        src/components/sections/home-mockup/cursor-demo/index.ts
git commit -m "feat(cursor-demo): activate script in provider and add barrel export"
```

---

## Task 11: Render the overlays in `AppShell` and the caption strip in `HomeMockup`

**Files:**
- Modify: `src/components/sections/home-mockup/AppShell.tsx`
- Modify: `src/components/sections/home-mockup/index.tsx`

- [ ] **Step 1: Update `AppShell.tsx`** to render `CursorOverlay` + `DigestOverlay` and wire mouseEnter/Leave + user-navigation signal

Replace the file contents with:

```tsx
"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MockSidebar, type ViewId } from "./MockSidebar";
import { MockMobileBar } from "./MockMobileBar";
import { HomeView } from "./views/HomeView";
import { NewChatView } from "./views/NewChatView";
import { ProjectsView } from "./views/ProjectsView";
import { LibraryView } from "./views/LibraryView";
import { HistoryView } from "./views/HistoryView";
import { useCursorDemoOptional } from "./cursor-demo/CursorDemoContext";
import { CursorOverlay } from "./cursor-demo/CursorOverlay";
import { DigestOverlay } from "./cursor-demo/DigestOverlay";

export function AppShell() {
  const ctx = useCursorDemoOptional();
  const [localView, setLocalView] = useState<ViewId>("home");
  const activeView = ctx?.activeView ?? localView;
  const setActiveView = ctx?.setActiveViewFromUser ?? setLocalView;

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  function handleNavigate(id: ViewId) {
    setActiveView(id);
    setMobileSidebarOpen(false);
  }

  return (
    <div
      ref={ctx?.mockupRef}
      onMouseEnter={ctx?.cursor.notifyMouseEnter}
      onMouseLeave={ctx?.cursor.notifyMouseLeave}
      className="relative flex h-[640px] md:h-[720px] bg-page-bg"
    >
      <div className="hidden md:block lg:hidden w-[60px] flex-shrink-0 border-r border-border-warm overflow-hidden">
        <MockSidebar activeView={activeView} onNavigate={handleNavigate} compact />
      </div>

      <div className="hidden lg:block w-[240px] flex-shrink-0 border-r border-border-warm overflow-hidden">
        <MockSidebar activeView={activeView} onNavigate={handleNavigate} />
      </div>

      <main className="flex-1 min-w-0 overflow-y-auto flex flex-col">
        <MockMobileBar onOpenSidebar={() => setMobileSidebarOpen(true)} />
        <div className="flex-1 min-h-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="h-full"
            >
              {activeView === "home" && <HomeView />}
              {activeView === "chat" && <NewChatView />}
              {activeView === "projects" && <ProjectsView />}
              {activeView === "library" && <LibraryView />}
              {activeView === "history" && <HistoryView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile overlay sidebar */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden absolute inset-0 bg-espresso/20 z-20"
            />
            <motion.div
              key="panel"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden absolute inset-y-0 left-0 w-[260px] z-30 shadow-lg"
            >
              <MockSidebar
                activeView={activeView}
                onNavigate={handleNavigate}
                onClose={() => setMobileSidebarOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cursor demo layers — only render when context is present (md+ inside HomeMockup) */}
      {ctx && (
        <>
          <DigestOverlay open={ctx.cursor.digestOpen} saved={ctx.cursor.digestSaved} />
          <CursorOverlay
            x={ctx.cursor.x}
            y={ctx.cursor.y}
            visible={ctx.cursor.visible}
            tooltipKey={ctx.cursor.tooltipKey}
            ripple={ctx.cursor.ripple}
          />
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Update `src/components/sections/home-mockup/index.tsx`** to wrap in provider and render `CaptionStrip`

Replace the file contents with:

```tsx
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
          <CaptionStripBound />
        </CursorDemoProvider>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/home-mockup/AppShell.tsx \
        src/components/sections/home-mockup/index.tsx
git commit -m "feat(cursor-demo): mount overlays in AppShell and caption in HomeMockup"
```

---

## Task 12: End-to-end browser verification

**No file changes. Verification only.**

- [ ] **Step 1: Production build succeeds**

Run: `npm run build`
Expected: build succeeds with no errors. Warnings about unused imports etc. are acceptable; type errors are not.

- [ ] **Step 2: Start dev server**

Run: `npm run dev`
Open: `http://localhost:3001`

- [ ] **Step 3: Smoke test the 5 beats**

Scroll until the HomeMockup section is in view. Watch the demo. All of the following must happen within ~30s:

1. **Discover:** cursor appears, hovers "For You" tab, then glides to the first feed card. Caption reads "Discover — your daily feed, ranked by relevance." Tooltip says "Skim today's evidence."
2. **Read:** cursor clicks the feed card, ripple fires, the digest overlay slides in centered over the mockup. Caption changes to "Read — paper summaries you can scan in 30 seconds."
3. **Save:** cursor moves to the Save button on the digest, ripple fires, button switches from `Bookmark` to `Check` icon, overlay fades out. Caption changes to "Save — keep what matters within reach."
4. **Ask:** cursor moves to the "New Chat" sidebar item, ripple fires, view transitions to NewChatView. Cursor moves to the textarea and types "Latest evidence on SGLT2 inhibitors in HFpEF?" character-by-character. Cursor moves to the send button and ripple fires. Caption is "Ask — get cited answers, not just links."
5. **Project:** cursor moves to the "Projects" sidebar item, ripple fires, view transitions to ProjectsView. Cursor lands on the first project card. Caption is "Project — organize research around a patient or topic."

After Beat 5, the demo loops back to Beat 1 with `home` view restored and chat query cleared.

- [ ] **Step 4: Pause behavior**

Hover the mockup with the real mouse — the cursor demo freezes mid-beat. Move the real mouse away — after ~800ms, the demo resumes from where it paused.

- [ ] **Step 5: User-takeover behavior**

While the demo is playing, click any sidebar item with the real mouse. Verify the demo cursor disappears and stops running. The mockup behaves like before (you can navigate freely).

- [ ] **Step 6: Scroll out / scroll back in**

Scroll the HomeMockup fully out of view and back in. The demo should restart from Beat 1. (If it was in `userControlled` mode from Step 5, this re-arms it.)

- [ ] **Step 7: Reduced motion**

In your OS, enable "Reduce motion" (macOS: System Settings → Accessibility → Display → Reduce motion). Reload the page. The cursor should still appear and walk through the beats, but jumps instantly between targets and types instantly. Disable reduced motion when done.

- [ ] **Step 8: Mobile breakpoint**

Resize the browser below `md` (~768px width) or use device emulation. The mockup should render with no cursor, no caption strip, and behave like the static mobile mockup did before this branch.

- [ ] **Step 9: Console check**

Open DevTools console. There should be no errors or React warnings during a full loop, pause, takeover, or resize.

- [ ] **Step 10: Locale check**

Switch the language toggle to ZH. Reload. The caption text and tooltip text should display Chinese translations from `messages/zh.json`. The chat question should be the Chinese version. Switch back to EN when done.

- [ ] **Step 11: Final commit (if any tweaks were needed during verification)**

If verification surfaced bugs, fix them, then commit with a descriptive message:

```bash
git add <fixed-files>
git commit -m "fix(cursor-demo): <describe the fix>"
```

If verification passed cleanly, no extra commit is needed.

---

## Self-review checklist (already performed)

- ✅ Spec coverage: every section of the spec maps to a task. Architecture → Tasks 3, 4, 6, 10. Touchpoints → Tasks 2, 5, 11. Beats → Tasks 1, 3. New components → Tasks 7, 8, 9. State machine → Task 6. Motion details → Task 6 (timing) + Tasks 7, 8, 9 (rendering). Reduced motion → Task 6. Resilience (target retry, cancel tokens) → Task 6. i18n → Task 1. File layout → Tasks 3–10. Acceptance criteria → Task 12.
- ✅ No placeholders or "TODO" or "similar to" — every code block is complete.
- ✅ Type consistency: `ViewId`, `BeatStep`, `Beat`, `CursorScriptState`, `ScriptMode`, `MotionValue<number>` types are defined where used. The provider value shape change in Task 10 (flat `scriptState` → nested `cursor`) is the consumer contract used in Task 11; both sides match.
