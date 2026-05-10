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
      { target: "feed-card-0",  action: { kind: "navigate", to: "paper" }, dwellMs: 900, tooltipKey: "read" },
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
