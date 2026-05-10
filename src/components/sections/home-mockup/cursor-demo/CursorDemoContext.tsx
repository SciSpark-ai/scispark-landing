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

/** Optional read — returns null when no provider (e.g. component used in isolation). */
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
    resolveText: tDemo,
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
    // setActiveViewFromUser/setQueryFromUser are intentionally omitted: they're
    // re-created each render and would loop deps via `cursor`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeView, query, cursor],
  );

  return <CursorDemoContext.Provider value={value}>{children}</CursorDemoContext.Provider>;
}
