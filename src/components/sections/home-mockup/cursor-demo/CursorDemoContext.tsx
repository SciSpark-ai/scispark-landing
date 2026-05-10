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
