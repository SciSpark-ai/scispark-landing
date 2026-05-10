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
  const [digestSaved, setDigestSaved] = useState(false);
  const [ripple, setRipple] = useState<{ x: number; y: number; nonce: number } | null>(null);
  const [mode, setMode] = useState<ScriptMode>("idle");

  const modeRef = useRef<ScriptMode>("idle");
  const cancelTokenRef = useRef(0);
  const pauseSignalRef = useRef<{ resolve?: () => void }>({});
  const mouseLeaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        if (step.target === "digest-save") setDigestSaved(true);
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
          } else if (!entry.isIntersecting && modeRef.current !== "idle") {
            // Reset on scroll-out from any non-idle state (playing, paused, OR userControlled),
            // so the script re-arms when the user scrolls back into view.
            cancelTokenRef.current++;
            releasePauseGate();
            setVisible(false);
            setActiveBeatIndex(0);
            setTooltipKey(null);
            setCaptionKey(null);
            setDigestSaved(false);
            setModeBoth("idle");
          }
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(root);
    return () => {
      observer.disconnect();
      if (mouseLeaveTimerRef.current) {
        clearTimeout(mouseLeaveTimerRef.current);
        mouseLeaveTimerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mockupRef]);

  // Pause / resume hooks consumed by AppShell mouse handlers
  function notifyMouseEnter() {
    if (mouseLeaveTimerRef.current !== null) {
      clearTimeout(mouseLeaveTimerRef.current);
      mouseLeaveTimerRef.current = null;
    }
    if (modeRef.current === "playing") setModeBoth("paused");
  }
  function notifyMouseLeave() {
    if (modeRef.current === "paused") {
      mouseLeaveTimerRef.current = setTimeout(() => {
        mouseLeaveTimerRef.current = null;
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
    digestSaved,
    ripple,
    mode,
    notifyMouseEnter,
    notifyMouseLeave,
    notifyUserNavigated,
  };
}
