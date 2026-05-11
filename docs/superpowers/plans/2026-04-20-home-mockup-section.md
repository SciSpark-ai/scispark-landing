# Home Mockup Section — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an interactive product mockup section between `<Hero />` and `<ProblemStatement />` on the SciSpark landing page. The mockup shows the real app's full shell (sidebar + main content) inside the existing `BrowserMockup` chrome. All 5 sidebar nav items (Home, New Chat, Projects, Library, History) are clickable and swap the main pane to a mini-mockup of that page.

**Architecture:** One new section folder at `src/components/sections/home-mockup/` containing a `<HomeMockup />` wrapper, a single `<AppShell />` that holds the `useState<ViewId>` and switches between five view components, plus a static `MockSidebar`, a mobile top-bar with hamburger-opened overlay, and a `mock-data.ts` module with all placeholder content. No global state, no routing, no new Framer Motion variants (reuses existing `mockupReveal`).

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Framer Motion, next-intl, TypeScript, lucide-react

**Spec:** `docs/specs/2026-04-20-home-mockup-section-design.md`

**Testing approach:** This repo has no unit-test framework (no vitest/jest). Verification is via `npm run dev` + browser inspection at desktop/tablet/mobile widths, and `npx tsc --noEmit` + `npm run lint` for type/lint safety. Each task ends with a type check and a commit.

---

### Task 1: Scaffold folder + add i18n keys

**Files:**
- Create: `src/components/sections/home-mockup/.gitkeep` (or skip — Git tracks the files we add next)
- Modify: `messages/en.json` (append `homeMockup` key)
- Modify: `messages/zh.json` (append `homeMockup` key)

- [ ] **Step 1: Add the `homeMockup` block to `messages/en.json`**

Insert this block as a new top-level key after `"footer"` (and before the closing `}`). Remember to put a comma after the closing `}` of `"footer"`.

```json
  "homeMockup": {
    "ariaLabel": "Product preview",
    "sidebar": {
      "navHome": "Home",
      "navChat": "New Chat",
      "navProjects": "Projects",
      "navLibrary": "Library",
      "navHistory": "History",
      "recentChats": "Recent Chats"
    },
    "greeting": {
      "morning": "Good morning",
      "afternoon": "Good afternoon",
      "evening": "Good evening"
    },
    "home": {
      "tabForYou": "For You",
      "tabTrending": "Trending",
      "tabBySpecialty": "By Specialty",
      "newResearch": "New research",
      "yourWeek": "Your Week",
      "papersThisWeek": "papers this week",
      "diffVsLastWeek": "vs last week",
      "newInInterests": "new in your interests",
      "trendingInFields": "trending in your fields",
      "savedUnread": "saved & unread",
      "trendingTopics": "Trending Topics",
      "readingStreak": "Reading Streak",
      "dayStreak": "day streak",
      "best": "Best",
      "moreToBeatRecord": "more to beat your record"
    },
    "chat": {
      "tagline": "AI-powered clinical evidence assistant",
      "placeholder": "Ask about clinical evidence, treatments, guidelines...",
      "chipCompare": "Compare treatments",
      "chipSummarize": "Summarize RCT",
      "chipGuidelines": "Find guidelines",
      "chipRisk": "Risk vs benefit"
    },
    "projects": {
      "title": "Projects",
      "description": "Organize papers, chats, and notes into research projects.",
      "newProject": "New Project",
      "searchPlaceholder": "Search projects...",
      "papersLabel": "papers",
      "chatsLabel": "chats",
      "createNew": "Create new project"
    },
    "library": {
      "title": "Library",
      "tabSaved": "Saved",
      "tabLiked": "Liked",
      "tabReadLater": "Read Later"
    },
    "history": {
      "title": "History",
      "groupToday": "Today",
      "groupYesterday": "Yesterday",
      "groupThisWeek": "This Week",
      "groupEarlier": "Earlier"
    }
  }
```

- [ ] **Step 2: Add the `homeMockup` block to `messages/zh.json`** with translated UI strings (keep paper/journal/project/chat names in English — they live in `mock-data.ts`, not here).

```json
  "homeMockup": {
    "ariaLabel": "产品预览",
    "sidebar": {
      "navHome": "主页",
      "navChat": "新对话",
      "navProjects": "项目",
      "navLibrary": "收藏",
      "navHistory": "历史",
      "recentChats": "最近对话"
    },
    "greeting": {
      "morning": "早上好",
      "afternoon": "下午好",
      "evening": "晚上好"
    },
    "home": {
      "tabForYou": "为你推荐",
      "tabTrending": "趋势",
      "tabBySpecialty": "按专科",
      "newResearch": "最新研究",
      "yourWeek": "本周动态",
      "papersThisWeek": "本周论文",
      "diffVsLastWeek": "较上周",
      "newInInterests": "条关注领域更新",
      "trendingInFields": "个研究方向热门",
      "savedUnread": "条已收藏未读",
      "trendingTopics": "热门主题",
      "readingStreak": "连续阅读",
      "dayStreak": "天连续阅读",
      "best": "最佳",
      "moreToBeatRecord": "天即可打破纪录"
    },
    "chat": {
      "tagline": "AI 驱动的临床证据助手",
      "placeholder": "询问临床证据、治疗方案、指南…",
      "chipCompare": "对比治疗方案",
      "chipSummarize": "总结 RCT",
      "chipGuidelines": "查找指南",
      "chipRisk": "风险收益评估"
    },
    "projects": {
      "title": "项目",
      "description": "将论文、对话和笔记整理为研究项目。",
      "newProject": "新建项目",
      "searchPlaceholder": "搜索项目…",
      "papersLabel": "篇论文",
      "chatsLabel": "段对话",
      "createNew": "创建新项目"
    },
    "library": {
      "title": "收藏",
      "tabSaved": "已收藏",
      "tabLiked": "已点赞",
      "tabReadLater": "稍后阅读"
    },
    "history": {
      "title": "历史",
      "groupToday": "今天",
      "groupYesterday": "昨天",
      "groupThisWeek": "本周",
      "groupEarlier": "更早"
    }
  }
```

- [ ] **Step 3: Verify JSON is valid**

Run:
```bash
node -e "JSON.parse(require('fs').readFileSync('messages/en.json','utf8')); console.log('en.json OK')"
node -e "JSON.parse(require('fs').readFileSync('messages/zh.json','utf8')); console.log('zh.json OK')"
```
Expected: `en.json OK` and `zh.json OK`.

- [ ] **Step 4: Create the home-mockup folder**

```bash
mkdir -p src/components/sections/home-mockup/views src/components/sections/home-mockup/widgets
```

- [ ] **Step 5: Commit**

```bash
git add messages/en.json messages/zh.json src/components/sections/home-mockup/
git commit -m "chore(home-mockup): scaffold folder and add i18n keys"
```

---

### Task 2: Mock data module

**Files:**
- Create: `src/components/sections/home-mockup/mock-data.ts`

- [ ] **Step 1: Write `mock-data.ts` with all placeholder content**

```ts
// All placeholder data for the landing-page home mockup.
// Clinical content (paper titles, journal names, chat titles) stays in English
// for both EN and ZH locales — this file is the source of truth for it.

export interface Paper {
  id: string;
  title: string;
  summary: string;
  journal: string;
  year: number;
  specialty: string;
  specialtyColor: string;
  tags: string[];
  evidenceRating: number;
  badges: string[];
  liked?: boolean;
  saved?: boolean;
  readLater?: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  papersCount: number;
  chatsCount: number;
  updatedAt: string;
  color: string;
}

export interface HistoryItem {
  id: string;
  title: string;
  time: string;
}

export interface RecentChat {
  id: string;
  title: string;
}

export const MOCK_USER = {
  name: "Ana",
  fullName: "Dr. Ana Chen",
  email: "ana.chen@mgh.harvard.edu",
};

export const MOCK_PAPERS: Paper[] = [
  {
    id: "p-1",
    title: "Psilocybin versus Escitalopram for Major Depressive Disorder",
    summary:
      "Head-to-head RCT in 59 patients with moderate-to-severe depression found comparable symptom reduction at 6 weeks, with psilocybin showing faster onset and higher remission rates.",
    journal: "New England Journal of Medicine",
    year: 2024,
    specialty: "Psychiatry",
    specialtyColor: "#9333ea",
    tags: ["Psilocybin"],
    evidenceRating: 5,
    badges: ["RCT"],
    saved: true,
  },
  {
    id: "p-2",
    title: "Closed-Loop Deep Brain Stimulation for Treatment-Resistant OCD",
    summary:
      "Responsive neurostimulation of the ventral capsule reduced YBOCS scores by 47% on average across 18 patients at 12-month follow-up.",
    journal: "Nature Medicine",
    year: 2024,
    specialty: "Neurology",
    specialtyColor: "#2563eb",
    tags: ["Deep Brain Stimulation"],
    evidenceRating: 4,
    badges: ["Open-label"],
    liked: true,
  },
  {
    id: "p-3",
    title: "Stanford SAINT Protocol: Accelerated TMS for Treatment-Resistant Depression",
    summary:
      "90% remission rate (HAM-D ≤7) in a 5-day intensive course using fMRI-guided sgACC targeting. Sham-controlled RCT with n=29.",
    journal: "American Journal of Psychiatry",
    year: 2023,
    specialty: "Psychiatry",
    specialtyColor: "#9333ea",
    tags: ["TMS"],
    evidenceRating: 5,
    badges: ["RCT"],
    saved: true,
    readLater: true,
  },
  {
    id: "p-4",
    title: "Low-Dose Ketamine Infusions for Suicidal Ideation in the Emergency Department",
    summary:
      "Single-dose IV ketamine (0.5 mg/kg) reduced acute suicidality within 40 minutes. Effect sustained at 24h in 62% of patients.",
    journal: "JAMA Psychiatry",
    year: 2024,
    specialty: "Emergency Medicine",
    specialtyColor: "#0891b2",
    tags: ["Ketamine"],
    evidenceRating: 4,
    badges: ["RCT"],
    liked: true,
    saved: true,
  },
  {
    id: "p-5",
    title: "Multi-Strain Probiotic Supplementation Modulates Mood via Vagal Afferents",
    summary:
      "12-week RCT in 124 adults with subthreshold depression showed PHQ-9 reduction of 3.8 points and altered vagal tone on HRV.",
    journal: "Gastroenterology",
    year: 2024,
    specialty: "Gastroenterology",
    specialtyColor: "#16a34a",
    tags: ["Gut-Brain Axis"],
    evidenceRating: 3,
    badges: ["RCT"],
    readLater: true,
  },
  {
    id: "p-6",
    title: "MDMA-Assisted Therapy for Severe PTSD: Phase 3 Confirmatory Trial",
    summary:
      "Pooled analysis of two Phase 3 RCTs (n=194) shows 67% of patients no longer meet PTSD criteria at 18 weeks vs 32% placebo.",
    journal: "Nature Medicine",
    year: 2023,
    specialty: "Psychiatry",
    specialtyColor: "#9333ea",
    tags: ["MDMA"],
    evidenceRating: 5,
    badges: ["Phase 3"],
    saved: true,
  },
  {
    id: "p-7",
    title: "Machine Learning Prediction of Treatment Response in Bipolar Disorder",
    summary:
      "Multimodal model (EHR + actigraphy + speech) achieved AUC 0.83 for predicting lithium response across 2,147 patients.",
    journal: "Lancet Psychiatry",
    year: 2024,
    specialty: "Psychiatry",
    specialtyColor: "#9333ea",
    tags: ["Machine Learning"],
    evidenceRating: 4,
    badges: ["Prospective"],
  },
  {
    id: "p-8",
    title: "Digital Phenotyping Detects Prodromal Psychosis Six Weeks Before Onset",
    summary:
      "Passive smartphone sensing (sleep, movement, communication) flagged impending psychotic episodes with 78% sensitivity.",
    journal: "World Psychiatry",
    year: 2024,
    specialty: "Psychiatry",
    specialtyColor: "#ea580c",
    tags: ["Digital Health"],
    evidenceRating: 3,
    badges: ["Cohort"],
    liked: true,
  },
  {
    id: "p-9",
    title: "GLP-1 Receptor Agonists and Cognitive Outcomes in Type 2 Diabetes",
    summary:
      "Retrospective cohort (n=41,608) found semaglutide users had 24% lower incidence of dementia vs matched controls over 4 years.",
    journal: "The Lancet",
    year: 2024,
    specialty: "Endocrinology",
    specialtyColor: "#e11d48",
    tags: ["Digital Health"],
    evidenceRating: 3,
    badges: ["Cohort"],
    readLater: true,
  },
  {
    id: "p-10",
    title: "Focused Ultrasound Blood-Brain Barrier Opening for Alzheimer's Therapy Delivery",
    summary:
      "First-in-human trial demonstrated reversible BBB opening with transient edema resolution at 24h. Safety signal clear in 8/8.",
    journal: "Science Translational Medicine",
    year: 2024,
    specialty: "Neurology",
    specialtyColor: "#2563eb",
    tags: ["Deep Brain Stimulation"],
    evidenceRating: 3,
    badges: ["First-in-human"],
  },
  {
    id: "p-11",
    title: "Single-Cell Atlas of the Human Prefrontal Cortex Across Major Depressive Disorder",
    summary:
      "snRNA-seq of 78 donor brains reveals transcriptional signatures in deep-layer pyramidal neurons linked to suicide completion.",
    journal: "Cell",
    year: 2024,
    specialty: "Neuroscience",
    specialtyColor: "#4f46e5",
    tags: ["Machine Learning"],
    evidenceRating: 4,
    badges: ["Atlas"],
  },
  {
    id: "p-12",
    title: "Ketogenic Diet Induces Remission in Bipolar Depression: Open-Label Pilot",
    summary:
      "14 of 21 patients achieved ≥50% MADRS reduction at 16 weeks with ketosis confirmed via serum β-hydroxybutyrate.",
    journal: "Psychiatric Research",
    year: 2023,
    specialty: "Psychiatry",
    specialtyColor: "#9333ea",
    tags: ["Gut-Brain Axis"],
    evidenceRating: 2,
    badges: ["Pilot"],
  },
];

export const FEED_SLICES: Record<"for-you" | "trending" | "by-specialty", string[]> = {
  "for-you":       ["p-1", "p-3", "p-5", "p-7", "p-9", "p-11"],
  "trending":      ["p-3", "p-6", "p-2", "p-10", "p-4", "p-8"],
  "by-specialty":  ["p-1", "p-4", "p-6", "p-7", "p-12", "p-3"],
};

export const MOCK_PROJECTS: Project[] = [
  {
    id: "proj-1",
    name: "Psilocybin for Treatment-Resistant Depression",
    description:
      "Collecting evidence on psilocybin-assisted therapy efficacy, safety profiles, and neuroimaging findings.",
    papersCount: 8,
    chatsCount: 3,
    updatedAt: "2 hours ago",
    color: "#9333ea",
  },
  {
    id: "proj-2",
    name: "DBS Targets in OCD",
    description:
      "Reviewing deep brain stimulation target sites, outcomes, and emerging protocol optimizations for OCD.",
    papersCount: 5,
    chatsCount: 2,
    updatedAt: "1 day ago",
    color: "#2563eb",
  },
  {
    id: "proj-3",
    name: "Gut-Brain Axis & Probiotics",
    description:
      "Exploring microbiome interventions and their effects on mood disorders and cognitive function.",
    papersCount: 12,
    chatsCount: 4,
    updatedAt: "3 days ago",
    color: "#16a34a",
  },
];

export const MOCK_RECENT_CHATS: RecentChat[] = [
  { id: "c-1", title: "Psilocybin dosing in TRD" },
  { id: "c-2", title: "DBS target selection for OCD" },
  { id: "c-3", title: "GLP-1 cognitive effects" },
];

export const MOCK_HISTORY: Record<"Today" | "Yesterday" | "This Week" | "Earlier", HistoryItem[]> = {
  Today: [
    { id: "h-1", title: "Psilocybin dosing in TRD", time: "2:41 PM" },
    { id: "h-2", title: "DBS target selection for OCD", time: "11:08 AM" },
  ],
  Yesterday: [
    { id: "h-3", title: "Ketamine vs esketamine for suicidal ideation", time: "Apr 19" },
    { id: "h-4", title: "GLP-1 cognitive effects", time: "Apr 19" },
  ],
  "This Week": [
    { id: "h-5", title: "SAINT protocol contraindications", time: "Apr 17" },
    { id: "h-6", title: "MDMA-assisted therapy workflow", time: "Apr 16" },
    { id: "h-7", title: "Probiotics for mood — evidence review", time: "Apr 15" },
  ],
  Earlier: [
    { id: "h-8", title: "Lithium response prediction models", time: "Apr 8, 2026" },
    { id: "h-9", title: "Focused ultrasound for Alzheimer's", time: "Apr 2, 2026" },
  ],
};

export const MOCK_TRENDING_TOPICS = [
  { rank: 1, name: "Psychedelic Therapy", count: 52 },
  { rank: 2, name: "Deep Brain Stimulation", count: 38 },
  { rank: 3, name: "Ketamine/Esketamine", count: 31 },
  { rank: 4, name: "Gut-Brain Axis", count: 24 },
  { rank: 5, name: "Digital Phenotyping", count: 19 },
];

export const MOCK_WEEK_STATS = {
  papersThisWeek: 25,
  diffVsLastWeek: 3,
  bullets: [
    { value: 18, labelKey: "newInInterests" as const },
    { value: 5, labelKey: "trendingInFields" as const },
    { value: 2, labelKey: "savedUnread" as const },
  ],
};

export const MOCK_STREAK = {
  current: 4,
  best: 14,
  activeDays: [true, true, true, true, false, false, false],
};
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/home-mockup/mock-data.ts
git commit -m "feat(home-mockup): add mock data module"
```

---

### Task 3: StarsRating + FeedCard (display-only)

**Files:**
- Create: `src/components/sections/home-mockup/StarsRating.tsx`
- Create: `src/components/sections/home-mockup/FeedCard.tsx`

- [ ] **Step 1: Create `StarsRating.tsx`**

```tsx
import { Star } from "lucide-react";

interface StarsRatingProps {
  rating: number;
  max?: number;
  size?: number;
}

export function StarsRating({ rating, max = 5, size = 12 }: StarsRatingProps) {
  return (
    <div className="flex gap-[2px]">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < rating ? "fill-warm-tan text-warm-tan" : "text-border-warm"}
          strokeWidth={1.6}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create `FeedCard.tsx`** (display-only port — no router, all interactive icons inert but hoverable)

```tsx
"use client";
import { Heart, Bookmark, Clock, MoreHorizontal } from "lucide-react";
import { GrainOverlay } from "@/components/GrainOverlay";
import { StarsRating } from "./StarsRating";
import type { Paper } from "./mock-data";

const TOPIC_COLORS: Record<string, string> = {
  Psilocybin: "#9333ea",
  "Deep Brain Stimulation": "#2563eb",
  Ketamine: "#0891b2",
  "Gut-Brain Axis": "#16a34a",
  TMS: "#4f46e5",
  MDMA: "#e11d48",
  "Machine Learning": "#0d9488",
  "Digital Health": "#ea580c",
};

function getCardColor(paper: Paper): string {
  const primaryTag = paper.tags[0];
  if (primaryTag && TOPIC_COLORS[primaryTag]) return TOPIC_COLORS[primaryTag];
  return paper.specialtyColor;
}

interface FeedCardProps {
  paper: Paper;
}

export function FeedCard({ paper }: FeedCardProps) {
  return (
    <div className="bg-white rounded-card border border-border-warm/30 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
      {/* Topic-color header strip with grain */}
      <div
        className="h-[30px] relative flex items-center px-4"
        style={{ backgroundColor: getCardColor(paper) }}
      >
        <GrainOverlay intensity="heavy" />
        <span className="relative text-white/90 text-[10px] font-medium uppercase tracking-[0.06em]">
          {paper.tags[0] ?? paper.specialty}
        </span>
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="font-heading text-[16px] font-normal leading-[1.35] text-espresso line-clamp-2">
          {paper.title}
        </h3>
        <p className="text-[14px] text-muted-text tracking-body line-clamp-2 mt-2">
          {paper.summary}
        </p>
        <p className="text-[12px] text-muted-text tracking-body mt-2">
          {paper.journal} · {paper.year}
          {paper.badges[0] ? ` · ${paper.badges[0]}` : null}
        </p>
      </div>

      {/* Footer */}
      <div className="border-t border-[#faf6f2] px-5 py-3 flex items-center justify-between">
        <StarsRating rating={paper.evidenceRating} size={12} />
        <div className="flex items-center gap-2 text-muted-text">
          <Heart
            size={15}
            className={paper.liked ? "fill-orange text-orange" : "hover:text-orange transition-colors"}
          />
          <Bookmark
            size={15}
            className={paper.saved ? "fill-orange text-orange" : "hover:text-orange transition-colors"}
          />
          <Clock
            size={15}
            className={paper.readLater ? "fill-orange text-orange" : "hover:text-orange transition-colors"}
          />
          <MoreHorizontal size={15} className="hover:text-orange transition-colors" />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/home-mockup/StarsRating.tsx src/components/sections/home-mockup/FeedCard.tsx
git commit -m "feat(home-mockup): add FeedCard and StarsRating"
```

---

### Task 4: Three widgets (YourWeek, TrendingTopics, ReadingStreak)

**Files:**
- Create: `src/components/sections/home-mockup/widgets/YourWeekWidget.tsx`
- Create: `src/components/sections/home-mockup/widgets/TrendingTopicsWidget.tsx`
- Create: `src/components/sections/home-mockup/widgets/ReadingStreakWidget.tsx`

- [ ] **Step 1: Create `YourWeekWidget.tsx`**

```tsx
"use client";
import { FileText, TrendingUp, Bookmark } from "lucide-react";
import { useTranslations } from "next-intl";
import { MOCK_WEEK_STATS } from "../mock-data";

const ICONS = { newInInterests: FileText, trendingInFields: TrendingUp, savedUnread: Bookmark };

export function YourWeekWidget() {
  const t = useTranslations("homeMockup.home");
  return (
    <div>
      <p className="text-[11px] text-muted-text font-medium uppercase tracking-[0.08em] mb-3">
        {t("yourWeek")}
      </p>
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-[28px] font-bold text-espresso leading-none">
            {MOCK_WEEK_STATS.papersThisWeek}
          </span>
          <span className="text-[12px] text-muted-text tracking-body">{t("papersThisWeek")}</span>
        </div>
        <p className="text-[11px] text-orange font-medium mt-1.5">
          +{MOCK_WEEK_STATS.diffVsLastWeek} {t("diffVsLastWeek")}
        </p>
      </div>
      <div className="space-y-2.5">
        {MOCK_WEEK_STATS.bullets.map((b) => {
          const Icon = ICONS[b.labelKey];
          return (
            <div key={b.labelKey} className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-[7px] bg-orange/10 flex items-center justify-center flex-shrink-0">
                <Icon size={13} className="text-orange" />
              </div>
              <p className="text-[13px] tracking-body">
                <span className="font-semibold text-espresso">{b.value}</span>
                <span className="text-muted-text ml-1">{t(b.labelKey)}</span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `TrendingTopicsWidget.tsx`**

```tsx
"use client";
import { useTranslations } from "next-intl";
import { MOCK_TRENDING_TOPICS } from "../mock-data";

export function TrendingTopicsWidget() {
  const t = useTranslations("homeMockup.home");
  const maxCount = Math.max(...MOCK_TRENDING_TOPICS.map((tp) => tp.count));

  return (
    <div>
      <p className="text-[11px] text-muted-text font-medium uppercase tracking-[0.08em] mb-3">
        {t("trendingTopics")}
      </p>
      <div className="space-y-1.5">
        {MOCK_TRENDING_TOPICS.map((topic) => (
          <div
            key={topic.rank}
            className="flex items-center gap-3 py-1 rounded-[6px] hover:bg-card-surface/40 px-1 -mx-1 transition-colors"
          >
            <span
              className={`text-[11px] font-semibold w-4 text-right tabular-nums flex-shrink-0 ${
                topic.rank <= 2 ? "text-orange" : "text-muted-text/60"
              }`}
            >
              {topic.rank}
            </span>
            <p className="text-[13px] text-espresso flex-shrink-0 truncate tracking-body w-[180px]">
              {topic.name}
            </p>
            <div className="flex-1 h-1.5 rounded-full bg-orange/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-orange/60"
                style={{ width: `${(topic.count / maxCount) * 100}%` }}
              />
            </div>
            <span className="text-[11px] text-muted-text tabular-nums flex-shrink-0 w-8 text-right">
              {topic.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create `ReadingStreakWidget.tsx`**

```tsx
"use client";
import { useTranslations } from "next-intl";
import { MOCK_STREAK } from "../mock-data";

const DAY_LETTERS = ["M", "T", "W", "T", "F", "S", "S"];

export function ReadingStreakWidget() {
  const t = useTranslations("homeMockup.home");
  const remaining = MOCK_STREAK.best - MOCK_STREAK.current + 1;

  return (
    <div>
      <p className="text-[11px] text-muted-text font-medium uppercase tracking-[0.08em] mb-3">
        {t("readingStreak")}
      </p>
      <div className="flex items-baseline gap-1.5 mb-3">
        <span className="text-[28px] font-bold text-orange leading-none">{MOCK_STREAK.current}</span>
        <span className="text-[13px] text-muted-text tracking-body">{t("dayStreak")}</span>
      </div>
      <div className="flex justify-between mb-4">
        {MOCK_STREAK.activeDays.map((active, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <span className="text-[12px] font-medium text-muted-text/80 uppercase tracking-[0.05em]">
              {DAY_LETTERS[i]}
            </span>
            <div
              className={`w-5 h-5 rounded-full transition-colors ${
                active ? "bg-orange" : "bg-card-surface border border-border-warm/60"
              }`}
            />
          </div>
        ))}
      </div>
      <div className="pt-3 border-t border-border-warm/60 space-y-1">
        <p className="text-[12px] text-muted-text tracking-body">
          {t("best")}: <span className="font-semibold text-espresso">{MOCK_STREAK.best}</span>
        </p>
        <p className="text-[11px] text-orange font-medium">
          {remaining} {t("moreToBeatRecord")}
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/home-mockup/widgets/
git commit -m "feat(home-mockup): add Your Week, Trending Topics, Reading Streak widgets"
```

---

### Task 5: HomeView

**Files:**
- Create: `src/components/sections/home-mockup/views/HomeView.tsx`

- [ ] **Step 1: Create `HomeView.tsx`**

```tsx
"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { YourWeekWidget } from "../widgets/YourWeekWidget";
import { TrendingTopicsWidget } from "../widgets/TrendingTopicsWidget";
import { ReadingStreakWidget } from "../widgets/ReadingStreakWidget";
import { FeedCard } from "../FeedCard";
import { MOCK_PAPERS, FEED_SLICES, MOCK_USER } from "../mock-data";

type FeedTab = "for-you" | "trending" | "by-specialty";

function getGreetingKey(): "morning" | "afternoon" | "evening" {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

export function HomeView() {
  const t = useTranslations("homeMockup");
  const [activeTab, setActiveTab] = useState<FeedTab>("for-you");

  const tabLabels: { value: FeedTab; key: string }[] = [
    { value: "for-you", key: "home.tabForYou" },
    { value: "trending", key: "home.tabTrending" },
    { value: "by-specialty", key: "home.tabBySpecialty" },
  ];

  const papers = FEED_SLICES[activeTab]
    .map((id) => MOCK_PAPERS.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const greeting = t(`greeting.${getGreetingKey()}`);

  return (
    <div className="pb-10">
      {/* Sticky tab bar */}
      <div className="sticky top-0 z-10 bg-page-bg border-b border-border-warm/60 px-7 py-2.5">
        <div className="flex gap-6">
          {tabLabels.map(({ value, key }) => (
            <button
              key={value}
              onClick={() => setActiveTab(value)}
              className={`pb-2 px-1 text-[14px] tracking-body border-b-2 transition-colors ${
                activeTab === value
                  ? "text-espresso font-medium border-orange"
                  : "text-muted-text border-transparent hover:text-espresso"
              }`}
            >
              {t(key)}
            </button>
          ))}
        </div>
      </div>

      {/* Greeting + widgets */}
      <div className="px-7">
        <h1 className="font-heading text-[28px] md:text-[32px] text-espresso tracking-heading pt-7">
          {greeting}, <span className="text-orange">{MOCK_USER.name}</span>
        </h1>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-[18px] bg-white/70 border border-border-warm/60 p-5">
            <YourWeekWidget />
          </div>
          <div className="rounded-[18px] bg-white/70 border border-border-warm/60 p-5 md:col-span-1 lg:col-span-2">
            <TrendingTopicsWidget />
          </div>
          <div className="rounded-[18px] bg-white/70 border border-border-warm/60 p-5">
            <ReadingStreakWidget />
          </div>
        </div>

        {/* New research header */}
        <h2 className="mt-10 font-heading text-[22px] text-espresso tracking-heading flex items-center gap-2">
          {t("home.newResearch")}
          <span className="text-orange">→</span>
        </h2>

        {/* Card grid */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[14px]">
          {papers.map((paper) => (
            <FeedCard key={paper.id} paper={paper} />
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/home-mockup/views/HomeView.tsx
git commit -m "feat(home-mockup): add HomeView with tabs, widgets, and card grid"
```

---

### Task 6: NewChatView

**Files:**
- Create: `src/components/sections/home-mockup/views/NewChatView.tsx`

- [ ] **Step 1: Create `NewChatView.tsx`** — chip click populates textarea with a 200ms ring-flash

```tsx
"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Search, ArrowUp, Plus, GitCompare, FileText, Scale } from "lucide-react";

export function NewChatView() {
  const t = useTranslations("homeMockup.chat");
  const [query, setQuery] = useState("");
  const [flash, setFlash] = useState(false);

  const suggestions = [
    { key: "chipCompare", icon: GitCompare },
    { key: "chipSummarize", icon: FileText },
    { key: "chipGuidelines", icon: Search },
    { key: "chipRisk", icon: Scale },
  ];

  function handleChip(label: string) {
    setQuery(label);
    setFlash(true);
    setTimeout(() => setFlash(false), 200);
  }

  return (
    <div className="flex items-center justify-center min-h-[560px]">
      <div className="w-full max-w-[640px] px-6 text-center">
        <h1 className="font-heading text-[44px] md:text-[56px] text-espresso tracking-heading-tight leading-none">
          SciSpark
        </h1>
        <p className="text-[14px] text-muted-text tracking-body mt-1">{t("tagline")}</p>

        {/* Search box — matches AI agent demo input styling */}
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
                className="flex-1 text-[15px] text-espresso tracking-body placeholder:text-muted-text bg-transparent focus:outline-none resize-none"
              />
            </div>
            <div className="flex items-center justify-between mt-3">
              <Plus size={16} className="text-muted-text" />
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                  query.trim() ? "bg-orange text-white" : "bg-card-surface text-muted-text"
                }`}
              >
                <ArrowUp size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Suggestion chips */}
        <div className="flex flex-wrap justify-center gap-2 mt-5">
          {suggestions.map((s) => {
            const Icon = s.icon;
            const label = t(s.key);
            return (
              <button
                key={s.key}
                onClick={() => handleChip(label)}
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

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/home-mockup/views/NewChatView.tsx
git commit -m "feat(home-mockup): add NewChatView with chip-to-textarea interaction"
```

---

### Task 7: ProjectsView

**Files:**
- Create: `src/components/sections/home-mockup/views/ProjectsView.tsx`

- [ ] **Step 1: Create `ProjectsView.tsx`** — search is visual-only (no filter logic)

```tsx
"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, FolderOpen, FileText, MessageSquare, MoreHorizontal, Search } from "lucide-react";
import { MOCK_PROJECTS } from "../mock-data";

export function ProjectsView() {
  const t = useTranslations("homeMockup.projects");
  const [search, setSearch] = useState("");

  return (
    <div className="p-7">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-[28px] text-espresso tracking-heading">{t("title")}</h1>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-orange text-white rounded-[10px] text-[14px] font-medium hover:bg-orange/90 transition-colors">
          <Plus size={16} />
          {t("newProject")}
        </button>
      </div>
      <p className="text-[14px] text-muted-text tracking-body mt-1">{t("description")}</p>

      <div className="mt-5">
        <div className="flex items-center gap-2 bg-white border border-border-warm rounded-[10px] px-3 py-2.5">
          <Search size={16} className="text-muted-text flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="flex-1 text-[14px] text-espresso placeholder:text-muted-text bg-transparent focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
        {MOCK_PROJECTS.map((project) => (
          <div
            key={project.id}
            className="bg-white border border-border-warm/30 rounded-[14px] p-5 hover:shadow-sm transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-[8px] flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: project.color + "18" }}
                >
                  <FolderOpen size={18} style={{ color: project.color }} />
                </div>
                <h3 className="font-heading text-[16px] text-espresso tracking-heading-card leading-[1.35] line-clamp-2">
                  {project.name}
                </h3>
              </div>
              <MoreHorizontal
                size={16}
                className="text-muted-text opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1"
              />
            </div>

            <p className="text-[13px] text-muted-text leading-[1.5] mt-3 line-clamp-2">
              {project.description}
            </p>

            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border-warm/30">
              <span className="flex items-center gap-1.5 text-[12px] text-muted-text">
                <FileText size={13} />
                {project.papersCount} {t("papersLabel")}
              </span>
              <span className="flex items-center gap-1.5 text-[12px] text-muted-text">
                <MessageSquare size={13} />
                {project.chatsCount} {t("chatsLabel")}
              </span>
              <span className="text-[12px] text-muted-text/60 ml-auto">{project.updatedAt}</span>
            </div>
          </div>
        ))}

        {/* Dashed "Create new project" card */}
        <div className="border-2 border-dashed border-border-warm/50 rounded-[14px] p-5 flex flex-col items-center justify-center gap-2 min-h-[180px] hover:border-orange/40 hover:bg-orange/[0.02] transition-colors group">
          <div className="w-10 h-10 rounded-full bg-card-surface flex items-center justify-center group-hover:bg-orange/10 transition-colors">
            <Plus size={20} className="text-muted-text group-hover:text-orange transition-colors" />
          </div>
          <span className="text-[14px] text-muted-text group-hover:text-espresso transition-colors">
            {t("createNew")}
          </span>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/home-mockup/views/ProjectsView.tsx
git commit -m "feat(home-mockup): add ProjectsView"
```

---

### Task 8: LibraryView

**Files:**
- Create: `src/components/sections/home-mockup/views/LibraryView.tsx`

- [ ] **Step 1: Create `LibraryView.tsx`**

```tsx
"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { StarsRating } from "../StarsRating";
import { MOCK_PAPERS, type Paper } from "../mock-data";

type Tab = "saved" | "liked" | "readLater";

export function LibraryView() {
  const t = useTranslations("homeMockup.library");
  const [activeTab, setActiveTab] = useState<Tab>("saved");

  const tabs: { id: Tab; key: string }[] = [
    { id: "saved", key: "tabSaved" },
    { id: "liked", key: "tabLiked" },
    { id: "readLater", key: "tabReadLater" },
  ];

  const filteredPapers = MOCK_PAPERS.filter((paper: Paper) => {
    if (activeTab === "saved") return paper.saved;
    if (activeTab === "liked") return paper.liked;
    if (activeTab === "readLater") return paper.readLater;
    return false;
  });

  return (
    <div className="p-7">
      <h1 className="font-heading text-[28px] text-espresso tracking-heading">{t("title")}</h1>

      <div className="flex gap-2 mt-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-[7px] text-[13px] font-medium rounded-pill transition-colors ${
              activeTab === tab.id ? "bg-orange text-white" : "bg-card-surface text-muted-text"
            }`}
          >
            {t(tab.key)}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-0">
        {filteredPapers.map((paper: Paper) => (
          <div
            key={paper.id}
            className="flex items-center gap-4 py-4 border-b border-border-warm/30 hover:bg-light-surface/50 transition-colors px-2 -mx-2 rounded-[8px]"
          >
            <div
              className="w-1 h-10 rounded-[2px] flex-shrink-0"
              style={{ backgroundColor: paper.specialtyColor }}
            />
            <div className="flex-1 min-w-0">
              <p className="font-heading text-[16px] text-espresso tracking-heading-card leading-[1.35]">
                {paper.title}
              </p>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <span className="text-[12px] text-muted-text tracking-body">
                  {paper.journal} · {paper.year} · {paper.specialty}
                </span>
                <StarsRating rating={paper.evidenceRating} size={11} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/home-mockup/views/LibraryView.tsx
git commit -m "feat(home-mockup): add LibraryView"
```

---

### Task 9: HistoryView

**Files:**
- Create: `src/components/sections/home-mockup/views/HistoryView.tsx`

- [ ] **Step 1: Create `HistoryView.tsx`**

```tsx
"use client";
import { useTranslations } from "next-intl";
import { MOCK_HISTORY } from "../mock-data";

const GROUP_ORDER: (keyof typeof MOCK_HISTORY)[] = ["Today", "Yesterday", "This Week", "Earlier"];
const GROUP_KEYS: Record<keyof typeof MOCK_HISTORY, string> = {
  Today: "groupToday",
  Yesterday: "groupYesterday",
  "This Week": "groupThisWeek",
  Earlier: "groupEarlier",
};

export function HistoryView() {
  const t = useTranslations("homeMockup.history");

  return (
    <div className="p-7">
      <h1 className="font-heading text-[28px] text-espresso tracking-heading">{t("title")}</h1>

      <div>
        {GROUP_ORDER.filter((g) => MOCK_HISTORY[g].length > 0).map((group, groupIndex) => (
          <div key={group}>
            <p
              className={`text-[12px] uppercase text-muted-text font-medium tracking-[0.06em] mb-2 ${
                groupIndex === 0 ? "mt-4" : "mt-6"
              }`}
            >
              {t(GROUP_KEYS[group])}
            </p>
            <div>
              {MOCK_HISTORY[group].map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between py-3 px-3 -mx-3 rounded-[10px] hover:bg-light-surface transition-colors"
                >
                  <span className="text-[14px] text-espresso tracking-body truncate mr-4">
                    {session.title}
                  </span>
                  <span className="text-[12px] text-muted-text shrink-0">{session.time}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/home-mockup/views/HistoryView.tsx
git commit -m "feat(home-mockup): add HistoryView"
```

---

### Task 10: MockSidebar

**Files:**
- Create: `src/components/sections/home-mockup/MockSidebar.tsx`

This component is presentational + receives an `activeView` and `onNavigate` callback. A single `ViewId` type is defined here and exported so `AppShell` can reuse it.

- [ ] **Step 1: Create `MockSidebar.tsx`**

```tsx
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
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/home-mockup/MockSidebar.tsx
git commit -m "feat(home-mockup): add MockSidebar"
```

---

### Task 11: MockMobileBar

**Files:**
- Create: `src/components/sections/home-mockup/MockMobileBar.tsx`

A thin top bar shown only on `<md` screens inside the mockup content area. It holds the hamburger trigger and a centered wordmark.

- [ ] **Step 1: Create `MockMobileBar.tsx`**

```tsx
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
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/home-mockup/MockMobileBar.tsx
git commit -m "feat(home-mockup): add mobile top bar with hamburger"
```

---

### Task 12: AppShell (view switcher + mobile overlay)

**Files:**
- Create: `src/components/sections/home-mockup/AppShell.tsx`

Owns the `activeView` state; renders `MockSidebar` (desktop rail), `MockMobileBar` + overlay (mobile), and the active view with `AnimatePresence` fade-in.

- [ ] **Step 1: Create `AppShell.tsx`**

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

export function AppShell() {
  const [activeView, setActiveView] = useState<ViewId>("home");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  function handleNavigate(id: ViewId) {
    setActiveView(id);
    setMobileSidebarOpen(false);
  }

  return (
    <div className="relative flex h-[640px] md:h-[720px] bg-page-bg">
      {/* md rail — icon-only */}
      <div className="hidden md:block lg:hidden w-[60px] flex-shrink-0 border-r border-border-warm overflow-hidden">
        <MockSidebar activeView={activeView} onNavigate={handleNavigate} compact />
      </div>

      {/* lg full sidebar */}
      <div className="hidden lg:block w-[240px] flex-shrink-0 border-r border-border-warm overflow-hidden">
        <MockSidebar activeView={activeView} onNavigate={handleNavigate} />
      </div>

      {/* Main pane (with mobile top bar stacked above the view) */}
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

**Note:** The md rail and lg full sidebars are two separate renders of `<MockSidebar />` — one with `compact`, one without. Only one is visible per breakpoint (`hidden md:block lg:hidden` vs `hidden lg:block`). `MockSidebar` is presentational, so duplicating it has negligible cost.

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/home-mockup/AppShell.tsx
git commit -m "feat(home-mockup): add AppShell with view switching and mobile overlay"
```

---

### Task 13: HomeMockup section wrapper + mount in page.tsx

**Files:**
- Create: `src/components/sections/home-mockup/index.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create `index.tsx` (section wrapper)**

```tsx
"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { BrowserMockup } from "../BrowserMockup";
import { AppShell } from "./AppShell";

export function HomeMockup() {
  const t = useTranslations("homeMockup");

  return (
    <section
      aria-label={t("ariaLabel")}
      className="bg-page-bg pt-0 pb-24 md:pb-32 px-6 lg:px-16"
    >
      <div className="max-w-[1120px] mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <BrowserMockup>
            <AppShell />
          </BrowserMockup>
        </motion.div>
      </div>
    </section>
  );
}
```

**Note:** `BrowserMockup` already applies `mockupReveal` variants internally, so wrapping it in `motion.div` with `initial/whileInView` triggers its reveal on scroll (variants propagate to children). The existing `BrowserMockup` sets `mt-16 max-w-4xl mx-auto` — we want to override `max-w` because our section is wider. See Step 2 for the override.

- [ ] **Step 2: Override BrowserMockup max-width with a wrapper**

The existing `BrowserMockup` forces `max-w-4xl`. Since we want `max-w-[1120px]` for the mockup, replace the `<BrowserMockup>` call in `index.tsx` with a local inline version that mirrors the same chrome but at full container width. Update `index.tsx`:

```tsx
"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { mockupReveal } from "@/components/motion/variants";
import { AppShell } from "./AppShell";

export function HomeMockup() {
  const t = useTranslations("homeMockup");

  return (
    <section
      aria-label={t("ariaLabel")}
      className="bg-page-bg pt-0 pb-24 md:pb-32 px-6 lg:px-16"
    >
      <div className="max-w-[1120px] mx-auto">
        <motion.div
          variants={mockupReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-8"
        >
          <div className="rounded-card shadow-lg border border-border-warm/30 overflow-hidden bg-white">
            {/* Browser title bar */}
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
            {/* Content */}
            <AppShell />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Mount in `src/app/page.tsx`**

Modify the file to insert `<HomeMockup />` between `<Hero />` and `<ProblemStatement />`:

```tsx
import { Navigation } from "@/components/sections/Navigation";
import { Hero } from "@/components/sections/Hero";
import { HomeMockup } from "@/components/sections/home-mockup";
import { ProblemStatement } from "@/components/sections/ProblemStatement";
import { ProductShowcase } from "@/components/sections/product-showcase";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { UseCases } from "@/components/sections/UseCases";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-page-bg">
      <Navigation />
      <Hero />
      <HomeMockup />
      <ProblemStatement />
      <ProductShowcase />
      <HowItWorks />
      <UseCases />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
```

- [ ] **Step 4: Type-check + lint**

Run:
```bash
npx tsc --noEmit
npm run lint
```
Expected: no errors from either.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/home-mockup/index.tsx src/app/page.tsx
git commit -m "feat(home-mockup): mount HomeMockup between Hero and ProblemStatement"
```

---

### Task 14: Verify end-to-end + polish pass

**Files:** No edits expected. If issues surface, fix inline and commit.

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`
Wait for "Ready on http://localhost:3000". Open the URL in a browser.

- [ ] **Step 2: Desktop (≥1024px) — functional checks**

Resize the browser window to ~1280px wide. Scroll to the mockup between Hero and ProblemStatement. Verify:

- Mockup renders inside the rounded browser-chrome frame (3 traffic-light dots + `scispark.ai/home` URL pill).
- Full sidebar (240px) shows logo, 5 nav items, "Recent Chats" header + 3 chat titles, user tile "Dr. Ana Chen" + email.
- Home view shows: sticky FeedTabs row, "Good morning, Ana" greeting (with "Ana" in orange), three widget cards in a single row, "New research →" heading, 6 feed cards.
- Click **New Chat** → main pane fades to the centered "SciSpark" + search + 4 suggestion chips. Click a chip (e.g. "Compare treatments") → textarea populates with "Compare treatments" and the textarea border briefly flashes orange.
- Click **Projects** → main pane fades to the projects page with 3 project cards + a dashed "Create new project" card.
- Click **Library** → main pane fades to library; click each pill (Saved / Liked / Read Later) and confirm the list updates.
- Click **History** → main pane fades to grouped history rows.
- Click **Home** → back to Home. Click tabs (For You / Trending / By Specialty) and confirm the card grid updates.

- [ ] **Step 3: Tablet (~768–1023px)**

Resize to ~900px. Verify:

- Sidebar collapses to a narrow rail (~60px). Icons remain visible; labels/user tile are clipped (as intended).
- Feed grid on Home drops to 2 columns (3 is only at xl).
- Tabs, widgets, and view switching still work.

- [ ] **Step 4: Mobile (<768px)**

Resize to ~390px (or use browser devtools' iPhone 14 preset). Verify:

- Desktop sidebar is hidden entirely.
- Mockup content area shows the 50px top bar (hamburger on left, "SciSpark" wordmark centered).
- Tap the hamburger → overlay sidebar slides in from the left; tapping a nav item both navigates the main pane and closes the overlay.
- Tap the backdrop outside the overlay → overlay closes.
- Home view: widgets stack vertically, feed grid is 1 column.

- [ ] **Step 5: Locale switch**

Toggle locale to Chinese (via whatever mechanism the site provides — typically a language toggle in the nav). Verify:

- All sidebar labels, tab labels, widget headers, page titles, chip labels, and placeholder text appear in Chinese.
- Paper titles, journal names, project names, recent-chat titles, user name, user email remain in English (this is intentional per spec).

- [ ] **Step 6: Page flow sanity check**

Scroll through the entire landing page top-to-bottom. Confirm:

- Hero → HomeMockup → ProblemStatement flows smoothly with no color-band seams.
- The later AI-agent ChatMockup in ProductShowcase still triggers its animation when scrolled into view (adding the HomeMockup above it shouldn't affect it, but confirm no regression).
- No console errors.

- [ ] **Step 7: Type-check + lint + build**

Run:
```bash
npx tsc --noEmit
npm run lint
npm run build
```
Expected: all succeed. The build output should include a successful Home route.

- [ ] **Step 8: Commit any polish fixes (if needed)**

If Steps 2–7 surfaced issues, fix them inline. For each fix, commit separately with a focused message:

```bash
git add <files>
git commit -m "fix(home-mockup): <what was fixed>"
```

If no fixes are needed, skip this step.

- [ ] **Step 9: Final confirmation**

Leave the dev server running, scroll the page from top to bottom once more, and confirm the complete experience matches the spec. Ready for review.

---

## Self-Review Summary

After writing the plan above, I verified:

1. **Spec coverage:**
   - Placement in `page.tsx` → Task 13
   - `bg-page-bg`, `pt-0 pb-24 md:pb-32 px-6 lg:px-16`, `max-w-[1120px]` → Task 13
   - File structure (5 views + widgets + FeedCard + mock-data + sidebar + mobile bar + shell) → Tasks 1–13
   - `useState<ViewId>` in AppShell → Task 12
   - Sidebar nav hover + active state → Task 10
   - HomeView FeedTabs (3 slices) → Task 5
   - LibraryView pill filter → Task 8
   - ProjectsView visual-only search → Task 7
   - NewChatView chip populates textarea + 200ms ring flash → Task 6
   - HistoryView presentational → Task 9
   - Paper type shape → Task 2
   - FeedCard display-only (no router, inert icons) → Task 3
   - Widgets (no ShareButton) → Task 4
   - Section-level reveal via existing `mockupReveal` variant → Task 13
   - View-swap `AnimatePresence` with opacity/y transition → Task 12
   - No infinite loops → verified no setInterval/infinite animations in Tasks 5–12
   - Responsive: lg full / md rail / mobile hamburger + overlay → Tasks 10, 11, 12
   - Basic a11y: `<button>` tags, `aria-label` on section, default focus rings — Tasks 10, 11, 13
   - i18n `homeMockup.*` keys for UI chrome, English-only paper/project/chat content → Tasks 1, 2
   - Exclusions (no routing, no real search, no dark mode, no keyboard nav, no submit) — honored by omitting these from tasks

2. **No placeholders:** All steps contain complete code. No "TBD" / "implement X" / "similar to Y" references.

3. **Type consistency:**
   - `ViewId` type is declared in `MockSidebar.tsx` (Task 10) and imported into `AppShell.tsx` (Task 12).
   - `Paper` type declared in `mock-data.ts` (Task 2), imported in `FeedCard.tsx` (Task 3), `HomeView.tsx` (Task 5), `LibraryView.tsx` (Task 8).
   - `MOCK_PAPERS`, `FEED_SLICES`, `MOCK_PROJECTS`, `MOCK_HISTORY`, `MOCK_RECENT_CHATS`, `MOCK_USER`, `MOCK_TRENDING_TOPICS`, `MOCK_WEEK_STATS`, `MOCK_STREAK` — all defined in Task 2, consumed with matching names in later tasks.
   - `NAV_ITEMS` with `{ id, labelKey, icon }` shape is only used inside `MockSidebar.tsx`; no cross-task drift.
   - i18n keys under `homeMockup.*` declared in Task 1 match the `useTranslations(...)` calls in every view.
