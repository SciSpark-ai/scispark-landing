# Cursor Demo for HomeMockup — Design Spec

**Date:** 2026-05-09
**Branch:** `feat/home-mockup`
**Target section:** `src/components/sections/home-mockup/`

## Goal

Layer an auto-playing fake cursor over the existing HomeMockup so visitors see SciSpark's full workspace in motion — not just a static screenshot. The cursor walks a 5-beat narrative (Discover → Read → Save → Ask → Project), with an in-frame tooltip naming the micro-action and a caption strip below the frame naming the broader phase.

## Non-goals

- No play/pause/restart UI controls.
- No mobile cursor demo. Below `md` the existing static AppShell behavior is unchanged.
- No analytics or telemetry on demo events.
- No rewrite of existing AppShell/view internals beyond wiring described in "Touchpoints".

## Architecture

A new isolated module `src/components/sections/home-mockup/cursor-demo/` overlays the existing `AppShell` without rewriting it. Four files plus one data file:

| File | Purpose |
|---|---|
| `script.ts` | The 5 beats as data. Each beat: `target`, `action`, `tooltip`, `caption`, `dwell`. Editing copy = editing one file. |
| `useCursorScript.ts` | Hook owning the playback state machine, target position resolution, current cursor coords, current tooltip + caption. Drives `setActiveView` and chat query at the right moments. |
| `CursorOverlay.tsx` | macOS arrow SVG positioned absolutely inside AppShell, tooltip chip pinned beside it. `aria-hidden="true"`. Renders click ripple on action. |
| `CaptionStrip.tsx` | Large caption + 5 step-dots, rendered below the browser frame inside the existing `HomeMockup` `<section>`. |
| `index.ts` | Barrel export of `CursorOverlay`, `CaptionStrip`, `useCursorScript`, `cursorScript`. |

The demo **drives the real AppShell state**. At the moment a beat fires a "click" on a sidebar item, the hook calls the same `setActiveView` setter the sidebar buttons use; existing `AnimatePresence` view transitions take over. No parallel rendering, no duplicated views.

## Touchpoints (existing files that change)

- **`HomeMockup/index.tsx`** — render `<CaptionStrip />` below the browser frame, pass demo state in via context.
- **`AppShell.tsx`** — hoist `activeView` and chat `query` to a `CursorDemoContext` provider so the hook can drive them. Render `<CursorOverlay />` as the last child of the AppShell root (positioned `absolute`, above content, below mobile overlay sidebar). Add `data-cursor-target` attributes on:
  - `tab-for-you` (HomeView "For you" tab)
  - `feed-card-0` (first FeedCard rendered)
  - `sidebar-chat`, `sidebar-projects` (sidebar nav buttons by view id)
  - `chat-textarea`, `chat-send` (NewChatView)
  - `project-card-0` (first project card in ProjectsView)
- **`NewChatView.tsx`** — read `query` from `CursorDemoContext` instead of local `useState` when the context is present; otherwise keep existing local state (so the component still works in isolation if reused).
- **No other view changes required.**

## Beats

Total loop: ~28s.

| # | Beat | Cursor target | Action sequence | Tooltip (small, by cursor) | Caption (large, below frame) |
|---|---|---|---|---|---|
| 1 | **Discover** | `tab-for-you` → `feed-card-0` | hover tab (400ms dwell) → glide to card → hover (1200ms) | "Skim today's evidence" | *Discover — your daily feed, ranked by relevance.* |
| 2 | **Read** | `feed-card-0` | click → digest overlay slides in from card position | "Open the digest" | *Read — paper summaries you can scan in 30 seconds.* |
| 3 | **Save** | `digest-save` (button on overlay) | move to Save → click → bookmark icon fills, brief check confirmation, overlay fades after 800ms | "Add to library" | *Save — keep what matters within reach.* |
| 4 | **Ask** | `sidebar-chat` → `chat-textarea` → `chat-send` | click sidebar (view switches) → wait for textarea mount → glide to textarea → type "Latest evidence on SGLT2 inhibitors in HFpEF?" char-by-char → glide to send → click | morphs: "Open chat" → "Ask anything" → "Send" | *Ask — get cited answers, not just links.* |
| 5 | **Project** | `sidebar-projects` → `project-card-0` | click sidebar (view switches) → wait for mount → glide to card → hover (1500ms) | "Group by case" | *Project — organize research around a patient or topic.* |

After Beat 5, the script returns to `home` view and restarts at Beat 1.

## New components introduced

### `DigestOverlay` (inside cursor-demo module)
A small card that animates in from the clicked FeedCard's measured position. Shows: paper title, 2-line abstract excerpt, and a `data-cursor-target="digest-save"` Save button. Pulled from the same paper data the FeedCard renders. Renders only while the script is in beats 2–3, then fades. ~50 lines including the Save button. Lives in cursor-demo module; not exported elsewhere.

## State machine

```
idle ── viewport entry ──▶ playing
playing ── mouseEnter mockup ──▶ paused
paused ── mouseLeave + 800ms grace ──▶ playing  (resumes from current beat)
playing ── user click on real sidebar ──▶ userControlled  (script disabled until viewport re-entry)
playing | paused ── viewport exit ──▶ idle  (rewinds to beat 1, restarts on re-entry)
end of beat 5 ──▶ playing (loops to beat 1)
```

Implementation: a `useReducer` inside `useCursorScript` with the modes above. Viewport detection uses `IntersectionObserver` on the AppShell root with `threshold: 0.4`. The "real user click" signal is propagated via the `CursorDemoContext` — the hoisted `setActiveView` wrapper records whether the change came from the script or from a DOM event.

## Motion details

- **Cursor movement:** `useMotionValue` for x/y, animated with framer-motion `animate()` using a spring (`stiffness: 90, damping: 18`). Movement duration scales with distance: short hops ~280ms, cross-shell jumps ~600ms.
- **Click feedback:** small ripple (24px circle, scales 0→1, opacity 0.4→0) at cursor anchor when an action fires. Duration 350ms.
- **Typing:** ~50ms per character with ±15ms jitter; commit each character into the chat query state via context setter.
- **Tooltip + caption swap:** cross-fade only, `duration: 0.18`, no slide.
- **Step dots:** the active dot fills with brand `orange`; completed dots stay filled at 60% opacity; upcoming dots are 20% opacity outlines.

## Reduced motion

Respect `prefers-reduced-motion: reduce`:
- Cursor jumps instantly between targets (no spring).
- Typing collapses to instant text on the send beat.
- Tooltip + caption cross-fade only.
- DigestOverlay appears with opacity transition only, no scale/position animation.
- Loop duration is shortened by skipping dwell padding (still legible, just faster).

## Resilience

- If a target ref isn't mounted yet (e.g., view just switched), the script `await`s `requestAnimationFrame` and retries up to 3 frames before skipping the beat. Prevents cursor flying to `(0,0)`.
- `ResizeObserver` on the AppShell root recomputes the cached target positions when layout shifts; if the user resizes mid-beat, the cursor re-targets to the new coordinates from its current position (no jump).
- All script timers are cleared on unmount and on state transitions to `idle` / `userControlled` to prevent leaked timeouts.

## Accessibility

- `CursorOverlay` and `DigestOverlay`: `aria-hidden="true"`. Decorative only.
- `CaptionStrip`: visible text, but `aria-hidden="true"` since the caption duplicates information already implied by the visible mockup. The mockup's own elements remain the accessible surface.
- The script never traps focus. Keyboard users interacting with the mockup put it into `userControlled` mode immediately.

## File layout

```
src/components/sections/home-mockup/
├── cursor-demo/
│   ├── CursorOverlay.tsx
│   ├── CaptionStrip.tsx
│   ├── DigestOverlay.tsx
│   ├── useCursorScript.ts
│   ├── CursorDemoContext.tsx
│   ├── script.ts
│   └── index.ts
├── AppShell.tsx              (modified: context provider, data-cursor-target, render overlay)
├── index.tsx                 (modified: render CaptionStrip)
├── views/NewChatView.tsx     (modified: read query from context if present)
└── ...                       (other files unchanged)
```

## i18n

All visible strings in `script.ts` (tooltips, captions, chat question text) live as keys under `homeMockup.cursorDemo.*` in the `en.json` and `zh.json` message files. Beat 4's chat question is translated as a complete sentence; the typing animation simply types the localized string. No layout assumptions about character counts.

## Open questions

None. All decisions are finalized in the brainstorm.

## Acceptance criteria

1. Mockup loads with no cursor visible until scrolled into view.
2. On scroll into view, the cursor appears at the top-left of the AppShell and begins Beat 1 within 300ms.
3. All 5 beats fire in order; sidebar view changes are visible; chat textarea fills with the question one character at a time; send button click is signaled by ripple.
4. Hovering the mockup pauses the script; leaving + 800ms resumes from the current beat.
5. Clicking a real sidebar item disables the script; reloading or scrolling fully out + back in re-enables it.
6. With `prefers-reduced-motion`, the same beats play but the cursor jumps and typing is instant.
7. Below `md` breakpoint, no cursor overlay renders; existing mobile mockup behavior is unchanged.
8. No console warnings or errors during a full loop.
