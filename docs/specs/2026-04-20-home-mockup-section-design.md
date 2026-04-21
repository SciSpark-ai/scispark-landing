# Home Mockup Section — Design Spec

**Date:** 2026-04-20
**Author:** Tong Shan (brainstormed with Claude)
**Status:** Approved — ready for implementation plan

## Summary

Add an interactive product mockup section to the SciSpark landing page, placed between `<Hero />` and `<ProblemStatement />`. The mockup presents the real app's full shell (sidebar + main content) inside the existing `BrowserMockup` chrome. Five sidebar nav items (Home, New Chat, Projects, Library, History) are clickable and swap the main view to a mini-mockup of that page.

The intent is to give landing-page visitors a tangible preview of the product before the narrative shifts into problem/solution territory. The mockup uses real-app component structures re-implemented in this repo with curated-but-lightweight placeholder data.

## Placement

In `src/app/page.tsx`:

```tsx
<Hero />
<HomeMockup />   // new section
<ProblemStatement />
```

Section wrapper:

- Background: `bg-page-bg` (matches Hero — no color seam above; ProblemStatement's `bg-page-warm` supplies the break below)
- Padding: `pt-0 pb-24 md:pb-32 px-6 lg:px-16`
- Container: `max-w-[1120px] mx-auto`
- No eyebrow/kicker line — the mockup is the content

## File Structure

```
src/components/sections/home-mockup/
  index.tsx                 section wrapper; exports <HomeMockup />
  AppShell.tsx              BrowserMockup → MockSidebar + active view; owns useState<ViewId>
  MockSidebar.tsx           logo, 5 nav items, recent chats list, user tile
  MockMobileBar.tsx         mobile-only: hamburger that opens an overlay sidebar
  views/
    HomeView.tsx            FeedTabs + greeting + widgets + feed card grid
    NewChatView.tsx         centered "SciSpark" + search textarea + 4 suggestion chips
    ProjectsView.tsx        title + "New Project" + search + project cards grid
    LibraryView.tsx         title + Saved/Liked/ReadLater pills + paper list
    HistoryView.tsx         title + grouped chat sessions (Today/Yesterday/…)
  widgets/
    YourWeekWidget.tsx
    TrendingTopicsWidget.tsx
    ReadingStreakWidget.tsx
  FeedCard.tsx              display-only port; no next/router
  mock-data.ts              all paper/project/history/widget data
```

Matches the existing `src/components/sections/product-showcase/` pattern.

## State & Interactions

All state is local to the mockup section. No global store, no router.

**`AppShell.tsx`** owns the active view:

```ts
type ViewId = 'home' | 'chat' | 'projects' | 'library' | 'history';
const [activeView, setActiveView] = useState<ViewId>('home');
```

**MockSidebar** receives `activeView` and `onNavigate(ViewId)`.

- Nav item hover: `hover:bg-card-surface/50`
- Active nav item: `bg-card-surface text-espresso font-medium` (matches real app)
- All 5 items are clickable

**Per-view local state:**

- `HomeView`: `useState<'for-you' | 'trending' | 'by-specialty'>`. Each tab maps to a deterministic slice of `MOCK_PAPERS` (6 cards) via `FEED_SLICES`.
- `LibraryView`: `useState<'saved' | 'liked' | 'readLater'>`. Filters `MOCK_PAPERS` by the matching flag.
- `ProjectsView`: search input is **visual-only** — a controlled `useState<string>` that never filters anything (the `onChange` handler is a no-op on the list). Keeps the UI responsive-feeling without list-filtering logic.
- `NewChatView`: textarea is controlled; clicking a suggestion chip **populates** the textarea with the chip label and briefly flashes an orange-tinted ring on the textarea border (~200ms). No submit, no navigation.
- `HistoryView`: purely presentational. Rows hover but don't navigate.

**Sidebar recent-chats**: 3 static items from `MOCK_RECENT_CHATS`. Non-clickable.

**Sidebar user tile** (`Dr. Ana Chen`): non-clickable.

## Mock Data (`mock-data.ts`)

```ts
MOCK_USER = { name: "Ana", fullName: "Dr. Ana Chen", email: "ana.chen@mgh.harvard.edu" }

MOCK_PAPERS: Paper[]         // ~12 entries, clinical psychiatry / neuromodulation / gut-brain themes
FEED_SLICES: {                // deterministic id slices per FeedTab
  'for-you':       string[6]
  'trending':      string[6]
  'by-specialty':  string[6]
}
MOCK_PROJECTS: Project[]     // 3 entries matching real-app ProjectsPage shape
MOCK_RECENT_CHATS: { id, title }[]  // 3 entries
MOCK_HISTORY: Record<'Today'|'Yesterday'|'This Week'|'Earlier', HistoryItem[]>  // ~8-10 total
MOCK_TRENDING_TOPICS: { rank, name, count }[]  // 5
MOCK_WEEK_STATS: { papersThisWeek, diffVsLastWeek, bullets }
MOCK_STREAK: { current, best, activeDays: boolean[7] }
```

`Paper` shape matches the real-app `Paper` type minimally (title, summary, journal, year, specialty, specialtyColor, tags, evidenceRating, badges, liked, saved, readLater).

Paper titles and summaries are in English only in both EN and ZH locales (clinical content convention — see i18n section).

## Component Behaviors

**FeedCard** (display-only port)

- Same visual as the real app's `FeedCard` (colored topic stripe + title + summary + journal·year + stars + icon row).
- Icons in the footer (heart/bookmark/clock/more) are rendered but **inert** — no click handlers that change state.
- No `useRouter`.

**FeedTabs (in HomeView)**

- Horizontal row of three text buttons with an orange underline on the active tab.
- Switching tabs instantly updates the card grid below. No stagger animation.

**Widgets** (YourWeek, TrendingTopics, ReadingStreak)

- Structurally identical to real-app widgets, minus the `ShareButton` (removed — no sharing affordance on a landing-page preview).
- Static data from `MOCK_WEEK_STATS`, `MOCK_TRENDING_TOPICS`, `MOCK_STREAK`.

**NewChatView**

- Centered layout within the main pane.
- `font-heading text-[56px]` "SciSpark" heading + tagline.
- Search textarea styled to match the real app's New Chat, plus the later AI-agent demo's input bar language (white rounded-2xl container, plus icon on left, arrow-up submit button on right).
- 4 suggestion chips: `Compare treatments`, `Summarize RCT`, `Find guidelines`, `Risk vs benefit`. Clicking a chip writes its label into the textarea.

**ProjectsView**

- Title + "New Project" button (non-functional) + description line.
- Search input (visual-only).
- 3-column grid of project cards at full width, collapses to 2 at md, 1 at sm.
- Trailing dashed "Create new project" card (non-functional).

**LibraryView**

- Title + 3 pill tabs.
- Vertical list of papers filtered by tab. Each row: colored stripe + title + journal·year·specialty + stars rating.
- Rows hoverable but inert.

**HistoryView**

- Title + date-grouped sections (Today/Yesterday/This Week/Earlier).
- Each row: chat title (truncated if long) + timestamp.
- Rows hoverable but inert.

## Motion

Uses the landing page's existing motion language only.

- **Section reveal**: Wrap `<HomeMockup />` in `<motion.div variants={mockupReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>`. Reuses the existing variant — no new ones.
- **View swap**: `<AnimatePresence mode="wait">` around the right pane. Each view enters with `opacity: 0 → 1, y: 8 → 0, duration: 0.22`.
- **FeedTabs / Library pills**: active-state changes only; no mount/unmount animation on the cards below.
- **NewChat chip press**: textarea value set immediately, plus a brief ring-flash on the textarea border (CSS transition, ~200ms).
- **No ambient loops, no infinite animations** — the later AI-agent section carries the "look it moves" beat.

## Responsive

| Breakpoint | Layout |
|---|---|
| `lg` (≥1024px) | Full sidebar (240px) + feed area; BrowserMockup at `max-w-[1120px]` |
| `md` (768–1023px) | Sidebar collapses to icon rail (60px); feed grid 2 columns |
| `<768px` (mobile) | Sidebar hidden; a 50px top bar renders inside the mockup content area (above the view, below the browser chrome) with a hamburger on the left and the "SciSpark" wordmark centered — analogous to the real app's `MobileNav`. Tapping the hamburger slides in an overlay sidebar. Feed grid 1 column; widgets stack vertically |

Text/spacing scales with Tailwind's breakpoint prefixes (e.g. `text-[28px] md:text-[32px]` for greetings).

## Accessibility

Basic. Every interactive element is a `<button>`. Default focus rings (Tailwind `focus-visible:`) are kept. No full keyboard navigation logic (arrow-keys for sidebar, ARIA tablist/tabpanel roles) — this is a marketing mockup, not a real app surface.

`<HomeMockup />` section has an `aria-label` of "Product preview" (or i18n'd equivalent).

## i18n

Strings go through `next-intl` under `homeMockup.*` in `messages/en.json` and `messages/zh.json`:

- Sidebar nav labels (Home, New Chat, Projects, Library, History)
- Sidebar section labels ("Recent Chats")
- Greeting time phrases (Good morning / afternoon / evening)
- FeedTabs labels (For You, Trending, By Specialty)
- "New research" section header
- Widget labels (Your Week, Trending Topics, Reading Streak, "papers this week", "day streak", "Best:", "...more to beat your record")
- Page titles (Projects, Library, History) + "New Project" button + project-grid description + search placeholders
- Library pill labels (Saved, Liked, Read Later)
- History date-group headers (Today, Yesterday, This Week, Earlier)
- NewChat tagline, textarea placeholder, suggestion chip labels

Kept English-only in both locales (clinical content convention):

- Paper titles, summaries, journal names, specialty names, tag names
- Project names and descriptions
- Chat session titles (history + sidebar recent chats)
- `MOCK_USER.fullName`, email, sidebar name

## Build Sequence (high-level, for the planning step)

1. Scaffold folder + `mock-data.ts` with finalized content.
2. Port `FeedCard.tsx` (display-only) + three widgets.
3. Build `HomeView.tsx` (tabs + greeting + widgets + grid) — verify in isolation by briefly rendering it inside the page.
4. Build `MockSidebar.tsx` + `AppShell.tsx` with view-switch wiring.
5. Build `NewChatView.tsx`, `ProjectsView.tsx`, `LibraryView.tsx`, `HistoryView.tsx`.
6. Build `MockMobileBar.tsx` + hook up mobile overlay.
7. Wire `<HomeMockup />` in `src/app/page.tsx`.
8. Add i18n keys to `messages/en.json` and `messages/zh.json`.
9. Verify in dev on desktop → tablet → mobile widths.

## Out of Scope

- Routing/deep-linking to any real page (mockup is pure presentation)
- Animated transitions on paper cards when FeedTabs switch
- Real search behavior in Projects
- Submit action on NewChat textarea / chip press
- Any form of persistent state (no cookies/localStorage/Zustand for mockup state)
- Dark mode (deferred per project CLAUDE.md)
- Keyboard navigation beyond default browser focus behavior
- Copy keeping pace with the real app — this mockup is a standalone marketing asset and can drift

## Open Questions (resolved during brainstorming, logged for reference)

- Scope: full shell with sidebar — **A**
- Framing: browser chrome via existing `BrowserMockup` — **A**
- Interactivity: clickable sidebar + view swap — **D/B hybrid**
- Sidebar views to mock: all five — **A**
- Content fidelity: real components, placeholder data — **C**
- NewChat chip click: populate textarea, matching later AI-agent demo's input styling — **accepted**
- Projects search: visual-only — **accepted**
- Eyebrow line above mockup: skipped — **accepted default**
- Mobile sidebar: hamburger overlay — **accepted**
- Accessibility depth: basic — **accepted**
