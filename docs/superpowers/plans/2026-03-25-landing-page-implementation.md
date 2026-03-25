# SciSpark Landing Page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a new SciSpark landing page from scratch with Next.js — a warm, animated, bilingual (EN/ZH) single-page site that showcases the clinical evidence product and captures early access signups.

**Architecture:** Next.js App Router with SSG, Tailwind CSS for styling, shadcn/ui for base components, Framer Motion for Bind/Claura-inspired scroll animations and micro-interactions, next-intl for i18n, Supabase for waitlist email collection. All content lives on a single page composed of 7 scroll sections.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS 4, shadcn/ui, Framer Motion, next-intl, Supabase JS client, Halant font (FontShare), Geist font (Google Fonts)

**Spec:** `docs/specs/2026-03-24-landing-page-design.md`
**Design tokens:** `docs/claura-reference-tokens.md` (PRIMARY), `docs/bind-reference-tokens.md` (layout/animation ref)

---

## File Structure

```
scispark-landing/           (NEW — separate from sci-spark-discover-2)
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root layout: fonts, metadata, i18n provider
│   │   ├── page.tsx                   # Landing page: composes all sections
│   │   └── globals.css                # Tailwind imports, CSS custom properties, selection color
│   ├── components/
│   │   ├── ui/                        # shadcn/ui components (Button, Accordion, Input, etc.)
│   │   ├── sections/
│   │   │   ├── Navigation.tsx         # Fixed header: logo, nav links, lang toggle, CTA
│   │   │   ├── MobileMenu.tsx         # Hamburger slide-out menu
│   │   │   ├── Hero.tsx               # Hero: kicker, headline (word reveal), subhead, CTAs
│   │   │   ├── BrowserMockup.tsx      # macOS-style window chrome wrapping product content
│   │   │   ├── ProblemStatement.tsx    # Stats + narrative quote
│   │   │   ├── product-showcase/
│   │   │   │   ├── index.tsx          # Showcase wrapper: Feed → Flywheel → Agent → Intel
│   │   │   │   ├── EvidenceFeed.tsx   # Text left + scrollable feed mockup right
│   │   │   │   ├── PaperCard.tsx      # Individual feed card with header, body, actions
│   │   │   │   ├── PaperDigest.tsx    # Expanded digest view (AI summary, figures, methods)
│   │   │   │   ├── FlyWheelDivider.tsx # "Feed informs AI ⇄ AI informs Feed" divider
│   │   │   │   ├── AIAgent.tsx        # Chat mockup left + text description right
│   │   │   │   ├── ChatMockup.tsx     # Chat UI: header, messages, typing indicator, input
│   │   │   │   └── IntelligenceLayer.tsx # 4 differentiator cards
│   │   │   ├── HowItWorks.tsx         # 3 numbered steps
│   │   │   ├── UseCases.tsx           # 3 persona cards
│   │   │   ├── FAQ.tsx                # Accordion
│   │   │   ├── FinalCTA.tsx           # Email capture
│   │   │   └── Footer.tsx             # Minimal footer
│   │   ├── motion/
│   │   │   ├── AnimatedSection.tsx    # Scroll-triggered fade+slide wrapper
│   │   │   ├── WordReveal.tsx         # Per-word blur reveal for headlines
│   │   │   ├── AnimatedStat.tsx       # Count-up number animation
│   │   │   ├── StaggerContainer.tsx   # Stagger children on scroll
│   │   │   └── variants.ts           # Shared Framer Motion variant objects + easing curves
│   │   └── EmailCapture.tsx           # Reusable email input + submit (used in Hero + FinalCTA)
│   ├── lib/
│   │   ├── supabase.ts               # Supabase client init + waitlist insert function
│   │   ├── fonts.ts                   # next/font loader for Halant + Geist
│   │   └── design-tokens.ts          # Color/spacing/radius constants as TS
│   └── i18n/
│       ├── config.ts                  # Supported locales, default locale
│       └── request.ts                 # next-intl getRequestConfig
├── messages/
│   ├── en.json                        # English translations (namespaced by section)
│   └── zh.json                        # Chinese translations
├── public/
│   ├── textures/
│   │   └── grain.png                  # Distressed grain overlay (~50KB)
│   ├── logo.svg                       # SciSpark logo
│   └── og-image.png                   # Open Graph social share image
├── docs/                              # Existing spec + token files (keep as-is)
├── package.json
├── next.config.ts                     # next-intl plugin, image config
├── tailwind.config.ts                 # Custom colors, fonts, spacing, animations
├── tsconfig.json
├── components.json                    # shadcn/ui config
└── .env.local                         # NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
```

---

## Phase 1: Foundation

### Task 1: Scaffold Next.js Project

**Files:**
- Create: `scispark-landing/package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`

- [ ] **Step 1: Create Next.js project**

```bash
cd ~/Documents
npx create-next-app@latest scispark-landing \
  --typescript --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --use-npm
```

- [ ] **Step 2: Install core dependencies**

```bash
cd ~/Documents/scispark-landing
npm install framer-motion @supabase/supabase-js next-intl
npm install -D @types/node
```

- [ ] **Step 3: Initialize shadcn/ui**

```bash
npx shadcn@latest init
# Select: New York style, Zinc base color, CSS variables: yes
```

- [ ] **Step 4: Add needed shadcn components**

```bash
npx shadcn@latest add button input accordion
```

- [ ] **Step 5: Verify dev server starts**

```bash
npm run dev
# Expected: Next.js dev server on http://localhost:3000, default page renders
```

- [ ] **Step 6: Verify docs directory is in project**

The spec and reference token files should already exist at `docs/` in this project (they were created during brainstorming). Verify they're present:

```bash
ls ~/Documents/scispark-landing/docs/specs/2026-03-24-landing-page-design.md
ls ~/Documents/scispark-landing/docs/claura-reference-tokens.md
ls ~/Documents/scispark-landing/docs/bind-reference-tokens.md
```

- [ ] **Step 7: Commit**

```bash
git init
git add .
git commit -m "feat: scaffold Next.js project with Tailwind, shadcn/ui, Framer Motion"
```

---

### Task 2: Design System — Fonts, Colors, Tokens

**Files:**
- Create: `src/lib/fonts.ts`, `src/lib/design-tokens.ts`
- Modify: `tailwind.config.ts`, `src/app/globals.css`, `src/app/layout.tsx`

**Reference:** `docs/claura-reference-tokens.md` (PRIMARY color/font source), `docs/bind-reference-tokens.md` (layout/spacing)

- [ ] **Step 1: Set up font loading**

Create `src/lib/fonts.ts`:

```ts
import localFont from "next/font/local";
import { Geist } from "next/font/google";

export const halant = localFont({
  src: [
    { path: "../../public/fonts/Halant-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/Halant-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-halant",
  display: "swap",
});

export const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});
```

Download Halant from FontShare and place `Halant-Regular.woff2` + `Halant-Bold.woff2` in `public/fonts/`.

- [ ] **Step 2: Create design tokens**

Create `src/lib/design-tokens.ts`:

```ts
// Colors — from Claura reference tokens (PRIMARY visual reference)
export const colors = {
  // Backgrounds
  pageBg: "#fcf6ef",           // Root page background
  sectionWarmBg: "#f6f0e9",    // Alternating section background
  cardSurface: "#efe7dd",      // Cards, inputs
  lightSurface: "#faf6f2",     // Badges, light elements

  // Text
  espresso: "#2b180a",         // Primary dark — headings, buttons
  secondaryDark: "#3e2407",    // Alt dark text
  muted: "#94877c",            // Body text, de-emphasized heading words

  // Accents
  orange: "#f97316",           // SciSpark primary
  warmTan: "#dab697",          // Stars, decorative
  borderWarm: "#e8d3c0",       // Selection highlight, borders
  gold: "#fde68a",             // Soft gold accent

  // Utility
  white: "#ffffff",
} as const;

// Spacing — from Claura/Bind
export const spacing = {
  containerMax: "1200px",
  contentMax: "1072px",
  sectionPadding: { desktop: "80px 64px", tablet: "80px 32px", mobile: "80px 24px" },
  heroPaddingTop: { desktop: "160px", mobile: "120px" },
  sectionGap: "64px",
  cardPadding: "24px",
} as const;

// Radii — from Claura
export const radii = {
  card: "28px",
  badge: "8px",
  button: "12px",
  buttonPill: "50px",
  faq: "16px",
  input: "12px",
  image: "28px",
} as const;
```

- [ ] **Step 3: Configure Tailwind with design tokens**

Update `tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-halant)", "Georgia", "serif"],
        body: ["var(--font-geist)", "system-ui", "sans-serif"],
      },
      colors: {
        page: { bg: "#fcf6ef", warm: "#f6f0e9" },
        card: { surface: "#efe7dd" },
        light: { surface: "#faf6f2" },
        espresso: "#2b180a",
        "secondary-dark": "#3e2407",
        muted: "#94877c",
        orange: { DEFAULT: "#f97316", light: "#fb923c" },
        "warm-tan": "#dab697",
        "border-warm": "#e8d3c0",
        gold: "#fde68a",
      },
      maxWidth: {
        container: "1200px",
        content: "1072px",
      },
      borderRadius: {
        card: "28px",
        badge: "8px",
        btn: "12px",
        pill: "50px",
        faq: "16px",
      },
      letterSpacing: {
        "heading-tight": "-0.07em",
        "heading": "-0.06em",
        "heading-card": "-0.05em",
        "body": "-0.04em",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
```

- [ ] **Step 4: Set up globals.css with custom properties and selection color**

Update `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --page-bg: 252 246 239;
    --section-warm-bg: 246 240 233;
    --card-surface: 239 231 221;
    --espresso: 43 24 10;
    --muted: 148 135 124;
    --orange: 249 115 22;
  }

  body {
    background-color: #fcf6ef;
    color: #2b180a;
    font-family: var(--font-geist), system-ui, sans-serif;
  }

  ::selection {
    background-color: #e8d3c0;
    color: #2b180a;
  }
}
```

- [ ] **Step 5: Wire fonts into root layout**

Update `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { halant, geist } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "SciSpark — Never miss a breakthrough that could save lives",
  description: "AI-powered clinical evidence assistant. Personalized research delivered daily, AI-summarized, always grounded in source papers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${halant.variable} ${geist.variable}`}>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 6: Verify fonts render**

Update `src/app/page.tsx` with a test heading and body text:

```tsx
export default function Home() {
  return (
    <main className="min-h-screen bg-page-bg p-16">
      <h1 className="font-heading text-[70px] font-normal tracking-heading-tight leading-[110%] text-espresso">
        Never miss a breakthrough
      </h1>
      <p className="font-body text-xl text-muted tracking-body leading-[150%] mt-4">
        Personalized evidence delivered daily.
      </p>
    </main>
  );
}
```

Run `npm run dev`, verify Halant heading + Geist body render with correct colors.

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: design system — Halant/Geist fonts, Claura color tokens, Tailwind config"
```

---

### Task 3: Animation Utilities

**Files:**
- Create: `src/components/motion/variants.ts`, `src/components/motion/AnimatedSection.tsx`, `src/components/motion/WordReveal.tsx`, `src/components/motion/AnimatedStat.tsx`, `src/components/motion/StaggerContainer.tsx`

**Reference:** Spec Section 12, `docs/bind-reference-tokens.md` (animation values)

- [ ] **Step 1: Create shared motion variants and easing curves**

Create `src/components/motion/variants.ts`:

```ts
// Easing curves from Bind
export const EASE_HERO = [0.55, 0, 0, 1] as const;
export const EASE_MOCKUP = [0.68, 0, 0, 0.99] as const;
export const EASE_CARD = [0.22, 1, 0.36, 1] as const;

// Hero elements: badge, subhead, CTAs
export const heroElement = {
  hidden: { opacity: 0.001, y: 40, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: 1.0, duration: 1.5, ease: [...EASE_HERO] },
  },
};

// Browser mockup reveal
export const mockupReveal = {
  hidden: { opacity: 1, y: 95, scale: 1.4 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: 0.95, duration: 1.3, ease: [...EASE_MOCKUP] },
  },
};

// Scroll-triggered section reveal (148px travel like Bind)
export const sectionReveal = {
  hidden: { opacity: 0, y: 148 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [...EASE_HERO] },
  },
};

// Card stagger container
export const cardContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

// Individual card reveal
export const cardReveal = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [...EASE_CARD] },
  },
};

// Feed cards stagger in from right
export const feedContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

export const feedCardReveal = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [...EASE_CARD] },
  },
};

// Chat message appear
export const chatSequence = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 1.2, delayChildren: 0.8 },
  },
};

export const messageAppear = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};
```

- [ ] **Step 2: Create AnimatedSection wrapper**

Create `src/components/motion/AnimatedSection.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { sectionReveal } from "./variants";

export function AnimatedSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      variants={sectionReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className={className}
    >
      {children}
    </motion.section>
  );
}
```

- [ ] **Step 3: Create WordReveal component**

Create `src/components/motion/WordReveal.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { EASE_HERO } from "./variants";

interface WordRevealProps {
  text: string;
  className?: string;
  mutedWords?: string[]; // Words to render in muted color
  delay?: number;
}

const wordVariant = {
  hidden: { opacity: 0.001, filter: "blur(6px)", y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { delay: 1.0 + i * 0.08, duration: 0.8, ease: [...EASE_HERO] },
  }),
};

export function WordReveal({ text, className, mutedWords = [], delay = 0 }: WordRevealProps) {
  const words = text.split(" ");

  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={{
            ...wordVariant,
            visible: (idx: number) => ({
              opacity: 1,
              filter: "blur(0px)",
              y: 0,
              transition: {
                delay: delay + idx * 0.08,
                duration: 0.8,
                ease: [...EASE_HERO],
              },
            }),
          }}
          style={{ display: "inline-block" }}
          className={mutedWords.includes(word.replace(/[.,!?]/, "")) ? "text-muted" : ""}
        >
          {word}&nbsp;
        </motion.span>
      ))}
    </span>
  );
}
```

- [ ] **Step 4: Create AnimatedStat component**

Create `src/components/motion/AnimatedStat.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";

interface AnimatedStatProps {
  target: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export function AnimatedStat({ target, suffix = "", prefix = "", className }: AnimatedStatProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => prefix + Math.round(v).toLocaleString() + suffix);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      animate(count, target, { duration: 1.5, ease: "easeOut" });
    }
  }, [inView, count, target]);

  return <motion.span ref={ref} className={className}>{rounded}</motion.span>;
}
```

- [ ] **Step 5: Create StaggerContainer component**

Create `src/components/motion/StaggerContainer.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { cardContainer } from "./variants";

export function StaggerContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={cardContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 6: Verify animations work — add test to page.tsx**

Temporarily update `src/app/page.tsx` to render AnimatedSection + WordReveal + AnimatedStat. Scroll through the page in the browser to verify:
- Word reveal animates with blur
- Stat counts up on scroll
- Section fades in from below

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: animation utilities — section reveals, word blur, stat counter, stagger"
```

---

### Task 4: i18n Setup

**Files:**
- Create: `src/i18n/config.ts`, `src/i18n/request.ts`, `messages/en.json`, `messages/zh.json`
- Modify: `next.config.ts`, `src/app/layout.tsx`

**Reference:** Spec Section 7

- [ ] **Step 1: Configure next-intl**

Create `src/i18n/config.ts`:

```ts
export const locales = ["en", "zh"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
```

Create `src/i18n/request.ts`:

```ts
import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { defaultLocale } from "./config";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 2: Create English translation file**

Create `messages/en.json`:

```json
{
  "nav": {
    "product": "Product",
    "howItWorks": "How It Works",
    "useCases": "Use Cases",
    "faq": "FAQ",
    "cta": "Get Early Access"
  },
  "hero": {
    "kicker": "AI-Powered Clinical Evidence",
    "headline": "Never miss a breakthrough that could save lives",
    "subhead": "Personalized evidence delivered daily. AI-summarized. Always grounded in source papers.",
    "ctaPrimary": "Get Early Access",
    "ctaSecondary": "See how it works",
    "microcopy": "Free to start. No credit card required."
  },
  "problem": {
    "headline": "Clinicians are drowning in research they can't keep up with",
    "stat1": { "value": "3,000+", "label": "medical papers published daily" },
    "stat2": { "value": "17", "label": "years average delay for breakthroughs to reach patients" },
    "stat3": { "value": "250,000", "label": "American lives lost annually to outdated practices" },
    "quote": "A patient suffered for 10 years with treatment-resistant depression. The Stanford SAINT protocol achieved 90% remission in 5 days — but her doctor never knew it existed."
  },
  "showcase": {
    "feed": {
      "headline": "Your Personalized Evidence Feed",
      "desc1": "Thousands of papers filtered to what matters to you",
      "desc2": "AI-summarized TL;DR on every card",
      "desc3": "Click any card for a full paper digest",
      "desc4": "Learns from your behavior — gets smarter every day",
      "desc5": "Auto-evaluates study rigor and trustworthiness",
      "digestTooltip": "Click to see the full paper digest"
    },
    "flywheel": "Feed informs AI ⇄ AI informs Feed",
    "agent": {
      "headline": "Your AI Clinical Agent",
      "desc1": "Persistent memory across sessions",
      "desc2": "Every claim grounded with citations",
      "desc3": "Understands your clinical context",
      "desc4": "Learns from your feed interactions too",
      "online": "ONLINE",
      "remembers": "Remembers your context"
    },
    "intel": {
      "headline": "Intelligence you can trust",
      "card1": { "title": "Evidence-Based", "desc": "Auto-evaluates scientific rigor, methodology quality, and clinical trustworthiness" },
      "card2": { "title": "Precision-Personalized", "desc": "Tailored to your specialty, patients, and clinical context" },
      "card3": { "title": "Always Up-to-Date", "desc": "Continuously tracking latest research worldwide, new studies indexed as they publish" },
      "card4": { "title": "Self-Improving", "desc": "Feed behavior informs AI, AI conversations refine feed — the flywheel gets smarter" }
    }
  },
  "howItWorks": {
    "headline": "How It Works",
    "step1": { "title": "Tell us your focus", "desc": "Set your specialty, interests, and clinical questions" },
    "step2": { "title": "Get your daily digest", "desc": "AI curates and summarizes the evidence that matters to you" },
    "step3": { "title": "Ask anything", "desc": "Dive deeper with AI Q&A grounded in cited sources" }
  },
  "useCases": {
    "headline": "Built for Every Clinician",
    "case1": { "title": "Attending Physicians", "quote": "Balancing 30+ patients a week, I need to catch new treatments and updated guidelines — without reading 50 papers." },
    "case2": { "title": "Residents & Fellows", "quote": "Staying current across multiple rotations with limited time. SciSpark keeps me informed without the overwhelm." },
    "case3": { "title": "Clinical Researchers", "quote": "Tracking breakthroughs across adjacent fields and disciplines — I can't afford to miss what's happening outside my niche." }
  },
  "faq": {
    "headline": "Frequently Asked Questions",
    "q1": { "q": "How does SciSpark personalize my feed?", "a": "SciSpark learns from your specialty, interests, and behavior — what you read, like, save, and skip. The more you use it, the more relevant your feed becomes." },
    "q2": { "q": "Is the AI content reliable for clinical decisions?", "a": "Every AI-generated summary and response is grounded in cited source papers. We auto-evaluate study rigor, methodology quality, and clinical trustworthiness so you can assess the evidence yourself." },
    "q3": { "q": "What specialties are supported?", "a": "SciSpark covers all major medical specialties and indexes research from thousands of journals worldwide. You can customize your interests at any granularity." },
    "q4": { "q": "How is this different from PubMed or UpToDate?", "a": "PubMed is a search engine — you have to know what to look for. UpToDate is expert-curated but slow to update. SciSpark is a personalized feed that comes to you, powered by AI that learns your context and evaluates evidence quality in real time." }
  },
  "finalCta": {
    "headline": "Better evidence. Better care.",
    "subhead": "Join hundreds of clinicians getting early access to SciSpark.",
    "cta": "Join Early Access"
  },
  "email": {
    "placeholder": "Enter your email",
    "success": "You're on the list! We'll be in touch soon.",
    "errorInvalid": "Please enter a valid email",
    "errorDuplicate": "This email is already on the waitlist."
  },
  "footer": {
    "copyright": "© 2026 SciSpark. All rights reserved.",
    "privacy": "Privacy",
    "terms": "Terms",
    "contact": "Contact"
  }
}
```

- [ ] **Step 3: Create Chinese translation file**

Create `messages/zh.json` with the same structure, translated to Chinese. (Full translation provided — all keys mirrored from en.json.)

```json
{
  "nav": {
    "product": "产品",
    "howItWorks": "使用方法",
    "useCases": "使用场景",
    "faq": "常见问题",
    "cta": "获取早期访问"
  },
  "hero": {
    "kicker": "AI驱动的临床证据",
    "headline": "不再错过任何可能挽救生命的医学突破",
    "subhead": "每日为您推送个性化的医学证据，AI总结，始终以原始论文为依据。",
    "ctaPrimary": "获取早期访问",
    "ctaSecondary": "了解运作方式",
    "microcopy": "免费开始，无需信用卡。"
  },
  "problem": {
    "headline": "临床医生正在被无法跟上的研究淹没",
    "stat1": { "value": "3,000+", "label": "每天发表的医学论文" },
    "stat2": { "value": "17", "label": "年——突破性研究到达患者的平均延迟" },
    "stat3": { "value": "250,000", "label": "美国人每年因过时的诊疗方案失去生命" },
    "quote": "一位患者被难治性抑郁症折磨了10年。斯坦福SAINT协议在5天内实现了90%的缓解率——但她的医生从不知道它的存在。"
  },
  "showcase": {
    "feed": {
      "headline": "您的个性化证据流",
      "desc1": "数千篇论文，筛选出与您相关的内容",
      "desc2": "每张卡片都有AI生成的摘要",
      "desc3": "点击任意卡片查看完整论文解析",
      "desc4": "从您的行为中学习——每天都更智能",
      "desc5": "自动评估研究的严谨性和可信度",
      "digestTooltip": "点击查看完整论文解析"
    },
    "flywheel": "推荐流驱动AI ⇄ AI优化推荐流",
    "agent": {
      "headline": "您的AI临床助手",
      "desc1": "跨会话持久记忆",
      "desc2": "每个观点都有引文支撑",
      "desc3": "理解您的临床背景",
      "desc4": "从您的阅读行为中持续学习",
      "online": "在线",
      "remembers": "记住您的背景"
    },
    "intel": {
      "headline": "值得信赖的智能",
      "card1": { "title": "循证医学", "desc": "自动评估科学严谨性、方法学质量和临床可信度" },
      "card2": { "title": "精准个性化", "desc": "根据您的专科、患者和临床情境量身定制" },
      "card3": { "title": "始终最新", "desc": "持续追踪全球最新研究，新论文发表即收录" },
      "card4": { "title": "自我进化", "desc": "阅读行为优化AI，AI对话优化推荐——飞轮效应持续增强" }
    }
  },
  "howItWorks": {
    "headline": "使用方法",
    "step1": { "title": "设定关注领域", "desc": "设置您的专科、兴趣和临床问题" },
    "step2": { "title": "获取每日精选", "desc": "AI为您筛选并总结最重要的医学证据" },
    "step3": { "title": "随时提问", "desc": "通过AI问答深入探索，所有回答均有引文支撑" }
  },
  "useCases": {
    "headline": "为每一位临床医生打造",
    "case1": { "title": "主治医师", "quote": "每周管理30多位患者，我需要及时了解新疗法和更新的指南——但不可能读50篇论文。" },
    "case2": { "title": "住院医师和研究员", "quote": "在有限的时间内跟进多个轮转科室的最新进展。SciSpark让我不再手忙脚乱。" },
    "case3": { "title": "临床研究人员", "quote": "追踪邻近领域和学科的突破——我不能错过专业之外的重要发现。" }
  },
  "faq": {
    "headline": "常见问题",
    "q1": { "q": "SciSpark如何个性化我的推荐？", "a": "SciSpark从您的专科、兴趣和行为中学习——包括您阅读、收藏、点赞和跳过的内容。使用越多，推荐越精准。" },
    "q2": { "q": "AI内容可以用于临床决策吗？", "a": "每一条AI生成的摘要和回复都基于引用的原始论文。我们自动评估研究的严谨性、方法学质量和临床可信度，帮助您自行判断证据质量。" },
    "q3": { "q": "支持哪些专科？", "a": "SciSpark覆盖所有主要医学专科，收录来自全球数千种期刊的研究。您可以按任意粒度自定义关注领域。" },
    "q4": { "q": "这与PubMed或UpToDate有何不同？", "a": "PubMed是搜索引擎——您需要知道搜什么。UpToDate由专家编写但更新较慢。SciSpark是个性化的推荐流，主动推送给您，由理解您临床背景并实时评估证据质量的AI驱动。" }
  },
  "finalCta": {
    "headline": "更好的证据，更好的医疗。",
    "subhead": "加入数百位正在获取SciSpark早期访问的临床医生。",
    "cta": "加入早期访问"
  },
  "email": {
    "placeholder": "输入您的邮箱",
    "success": "您已加入等待名单！我们会尽快联系您。",
    "errorInvalid": "请输入有效的邮箱地址",
    "errorDuplicate": "该邮箱已在等待名单中。"
  },
  "footer": {
    "copyright": "© 2026 SciSpark. 保留所有权利。",
    "privacy": "隐私政策",
    "terms": "服务条款",
    "contact": "联系我们"
  }
}
```

- [ ] **Step 4: Update next.config.ts for next-intl**

```ts
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig = {};

export default withNextIntl(nextConfig);
```

- [ ] **Step 5: Wrap layout with NextIntlClientProvider**

Update `src/app/layout.tsx` to include the provider:

```tsx
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
// ... existing imports

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${halant.variable} ${geist.variable}`}>
      <body className="font-body antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 6: Verify i18n renders — test useTranslations in page.tsx**

Update `page.tsx` to use `useTranslations("hero")` and render headline. Switch locale cookie manually to verify Chinese renders.

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: i18n setup with next-intl — EN + ZH translations for all sections"
```

---

## Phase 2: Page Shell

### Task 5: Root Layout + Navigation

**Files:**
- Create: `src/components/sections/Navigation.tsx`, `src/components/sections/MobileMenu.tsx`
- Modify: `src/app/page.tsx`

**Reference:** Spec Section 5.1, Bind nav tokens (glassmorphism, 65px height)

- [ ] **Step 1: Build Navigation component**

Create `src/components/sections/Navigation.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { MobileMenu } from "./MobileMenu";

export function Navigation() {
  const t = useTranslations("nav");
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: t("product"), href: "#product-showcase" },
    { label: t("howItWorks"), href: "#how-it-works" },
    { label: t("useCases"), href: "#use-cases" },
    { label: t("faq"), href: "#faq" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-[65px] backdrop-blur-[5px] bg-[rgba(252,246,239,0.16)] border-b border-border-warm/20">
        <div className="max-w-container mx-auto h-full flex items-center justify-between px-6 lg:px-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <span className="font-heading text-2xl text-espresso tracking-heading">SciSpark</span>
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-body text-muted hover:text-espresso transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right: language toggle + CTA */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageToggle />
            <a
              href="#final-cta"
              className="bg-espresso text-white text-sm font-medium px-5 py-2.5 rounded-btn hover:opacity-90 transition-opacity"
            >
              {t("cta")}
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6 text-espresso" />
          </button>
        </div>
      </nav>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} links={navLinks} />
    </>
  );
}

function LanguageToggle() {
  const switchLocale = (locale: string) => {
    document.cookie = `locale=${locale};path=/;max-age=31536000`;
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-1 text-sm text-muted">
      <button onClick={() => switchLocale("en")} className="hover:text-espresso transition-colors">
        EN
      </button>
      <span>|</span>
      <button onClick={() => switchLocale("zh")} className="hover:text-espresso transition-colors">
        中文
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Build MobileMenu component**

Create `src/components/sections/MobileMenu.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  links: { label: string; href: string }[];
}

export function MobileMenu({ open, onClose, links }: MobileMenuProps) {
  const t = useTranslations("nav");

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-page-bg"
        >
          <div className="flex justify-end p-6">
            <button onClick={onClose} aria-label="Close menu">
              <X className="w-6 h-6 text-espresso" />
            </button>
          </div>
          <div className="flex flex-col items-center gap-8 pt-12">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="font-heading text-3xl text-espresso tracking-heading"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#final-cta"
              onClick={onClose}
              className="mt-4 bg-espresso text-white text-lg font-medium px-8 py-3 rounded-btn"
            >
              {t("cta")}
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 3: Wire Navigation into page.tsx**

Update `src/app/page.tsx`:

```tsx
import { Navigation } from "@/components/sections/Navigation";

export default function Home() {
  return (
    <main className="min-h-screen bg-page-bg">
      <Navigation />
      <div className="pt-[65px]">
        {/* Sections will go here */}
        <div className="h-screen flex items-center justify-center">
          <p className="text-muted">Sections coming soon...</p>
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Verify navigation**

Run `npm run dev`. Verify:
- Fixed header with glassmorphism blur
- Nav links visible on desktop, hidden on mobile
- Hamburger opens mobile menu
- Language toggle switches locale cookie + reloads

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: navigation — fixed header with glassmorphism, mobile menu, language toggle"
```

---

### Task 6: Hero Section

**Files:**
- Create: `src/components/sections/Hero.tsx`, `src/components/sections/BrowserMockup.tsx`, `src/components/EmailCapture.tsx`

**Reference:** Spec Section 5.2, Animation Sections 12.1-12.2

- [ ] **Step 1: Build EmailCapture reusable component**

Create `src/components/EmailCapture.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { submitToWaitlist } from "@/lib/supabase";

interface EmailCaptureProps {
  source: "hero" | "footer-cta";
  buttonLabel: string;
  className?: string;
}

export function EmailCapture({ source, buttonLabel, className }: EmailCaptureProps) {
  const t = useTranslations("email");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setErrorMsg(t("errorInvalid"));
      return;
    }

    setStatus("loading");
    const result = await submitToWaitlist(email, source);

    if (result.success) {
      setStatus("success");
      setEmail("");
    } else {
      setStatus("error");
      setErrorMsg(result.duplicate ? t("errorDuplicate") : t("errorInvalid"));
    }
  };

  if (status === "success") {
    return (
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-espresso font-medium"
      >
        {t("success")}
      </motion.p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`flex gap-3 ${className}`}>
      <input
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setStatus("idle");
        }}
        placeholder={t("placeholder")}
        className="flex-1 px-4 py-3 rounded-input bg-white text-espresso placeholder:text-muted/60 border border-border-warm/40 focus:outline-none focus:border-orange transition-colors"
      />
      <motion.button
        type="submit"
        disabled={status === "loading"}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-orange text-white font-medium px-6 py-3 rounded-pill whitespace-nowrap disabled:opacity-60"
      >
        {status === "loading" ? "..." : buttonLabel}
      </motion.button>
      {status === "error" && (
        <p className="absolute -bottom-6 left-0 text-sm text-red-500">{errorMsg}</p>
      )}
    </form>
  );
}
```

- [ ] **Step 2: Build BrowserMockup component**

Create `src/components/sections/BrowserMockup.tsx`:

```tsx
interface BrowserMockupProps {
  children: React.ReactNode;
  className?: string;
}

export function BrowserMockup({ children, className }: BrowserMockupProps) {
  return (
    <div className={`bg-white rounded-card shadow-lg border border-border-warm/30 overflow-hidden ${className}`}>
      {/* macOS-style title bar */}
      <div className="flex items-center gap-[6px] px-4 py-3 bg-light-surface border-b border-border-warm/20">
        <div className="w-3 h-3 rounded-full bg-[#fd5754] border border-[#e04b49]" />
        <div className="w-3 h-3 rounded-full bg-[#febb40] border border-[#dea634]" />
        <div className="w-3 h-3 rounded-full bg-[#34c848] border border-[#2bac3c]" />
        <div className="ml-3 flex-1 h-6 bg-card-surface/50 rounded-md" />
      </div>
      {/* Content area */}
      <div className="p-0">{children}</div>
    </div>
  );
}
```

- [ ] **Step 3: Build Hero section**

Create `src/components/sections/Hero.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { heroElement, mockupReveal } from "@/components/motion/variants";
import { WordReveal } from "@/components/motion/WordReveal";
import { BrowserMockup } from "./BrowserMockup";
import { EmailCapture } from "@/components/EmailCapture";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="bg-page-bg pt-[160px] pb-20 md:pt-[180px] px-6 lg:px-16">
      <div className="max-w-content mx-auto text-center">
        <motion.div initial="hidden" animate="visible">
          {/* Kicker badge */}
          <motion.div variants={heroElement} className="mb-6">
            <span className="inline-block px-4 py-1.5 rounded-badge bg-light-surface text-sm font-body font-medium text-muted backdrop-blur-[32px]">
              {t("kicker")}
            </span>
          </motion.div>

          {/* Headline with word reveal */}
          <h1 className="font-heading text-[48px] md:text-[56px] lg:text-[70px] font-normal tracking-heading-tight leading-[110%] text-espresso mb-6">
            <WordReveal
              text={t("headline")}
              mutedWords={["that", "could"]}
              delay={1.0}
            />
          </h1>

          {/* Subhead */}
          <motion.p
            variants={heroElement}
            className="font-body text-lg md:text-xl text-muted tracking-body leading-[150%] max-w-2xl mx-auto mb-8"
          >
            {t("subhead")}
          </motion.p>

          {/* CTAs */}
          <motion.div variants={heroElement} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-3">
            <EmailCapture source="hero" buttonLabel={t("ctaPrimary")} className="max-w-md w-full" />
          </motion.div>

          {/* Secondary CTA */}
          <motion.div variants={heroElement} className="mt-3">
            <a
              href="#product-showcase"
              className="inline-flex items-center gap-2 text-sm font-medium text-espresso border border-espresso/20 px-5 py-2.5 rounded-pill hover:bg-espresso/5 transition-colors"
            >
              {t("ctaSecondary")}
            </a>
          </motion.div>

          {/* Microcopy */}
          <motion.p variants={heroElement} className="text-sm text-muted/70">
            {t("microcopy")}
          </motion.p>
        </motion.div>

        {/* Browser mockup below the fold */}
        <motion.div
          variants={mockupReveal}
          initial="hidden"
          animate="visible"
          className="mt-16 max-w-4xl mx-auto"
        >
          <BrowserMockup>
            {/* Placeholder for feed mockup — will be replaced in Task 9 */}
            <div className="h-[400px] bg-page-bg flex items-center justify-center text-muted">
              Product mockup
            </div>
          </BrowserMockup>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Wire Hero into page.tsx**

```tsx
import { Navigation } from "@/components/sections/Navigation";
import { Hero } from "@/components/sections/Hero";

export default function Home() {
  return (
    <main className="min-h-screen bg-page-bg">
      <Navigation />
      <Hero />
    </main>
  );
}
```

- [ ] **Step 5: Verify Hero renders**

Run `npm run dev`. Verify:
- Kicker badge fades in
- Headline animates per-word with blur
- Subhead + CTAs fade up
- Browser mockup slides up and scales down
- Email input visible with orange submit button
- Responsive: stacks vertically on mobile

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: hero section — word reveal, browser mockup, email capture"
```

---

## Phase 3: Content Sections

### Task 7: Problem Statement Section

**Files:**
- Create: `src/components/sections/ProblemStatement.tsx`
- Modify: `src/app/page.tsx`

**Reference:** Spec Section 5.3

- [ ] **Step 1: Build ProblemStatement component**

Create `src/components/sections/ProblemStatement.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/motion/AnimatedSection";
import { AnimatedStat } from "@/components/motion/AnimatedStat";
import { StaggerContainer } from "@/components/motion/StaggerContainer";
import { cardReveal } from "@/components/motion/variants";

const stats = [
  { target: 3000, suffix: "+", key: "stat1" },
  { target: 17, suffix: "", key: "stat2" },
  { target: 250000, suffix: "", key: "stat3" },
] as const;

export function ProblemStatement() {
  const t = useTranslations("problem");

  return (
    <AnimatedSection className="bg-page-warm py-20 md:py-[80px] px-6 lg:px-16">
      <div className="max-w-content mx-auto">
        <h2 className="font-heading text-[36px] md:text-[48px] lg:text-[56px] font-normal tracking-heading leading-[110%] text-espresso text-center mb-16">
          {t("headline")}
        </h2>

        {/* Stat cards */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {stats.map((stat) => (
            <motion.div
              key={stat.key}
              variants={cardReveal}
              className="bg-card-surface rounded-card p-8 text-center"
            >
              <div className="font-heading text-[48px] md:text-[56px] font-normal tracking-heading text-espresso leading-tight">
                <AnimatedStat target={stat.target} suffix={stat.suffix} />
              </div>
              <p className="font-body text-base text-muted mt-2">
                {t(`${stat.key}.label`)}
              </p>
            </motion.div>
          ))}
        </StaggerContainer>

        {/* Narrative quote */}
        <motion.blockquote
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.55, 0, 0, 1] }}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="font-body text-lg md:text-xl text-muted italic leading-[170%]">
            &ldquo;{t("quote")}&rdquo;
          </p>
        </motion.blockquote>
      </div>
    </AnimatedSection>
  );
}
```

- [ ] **Step 2: Add to page.tsx**

```tsx
import { ProblemStatement } from "@/components/sections/ProblemStatement";
// ... add <ProblemStatement /> after <Hero />
```

- [ ] **Step 3: Verify**

Scroll to Problem section. Verify stat cards stagger in, numbers count up, quote fades in.

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: problem statement — animated stat cards + narrative quote"
```

---

### Task 8: Product Showcase — Evidence Feed + Paper Cards

**Files:**
- Create: `src/components/sections/product-showcase/index.tsx`, `src/components/sections/product-showcase/EvidenceFeed.tsx`, `src/components/sections/product-showcase/PaperCard.tsx`
- Modify: `src/app/page.tsx`

**Reference:** Spec Section 5.4 Part A, card design from brainstorming

- [ ] **Step 1: Create sample paper data**

Create `src/components/sections/product-showcase/paper-data.ts`:

```ts
export interface PaperCardData {
  id: string;
  specialty: string;
  specialtyColor: string; // Header bar color
  icon: string; // Placeholder — will be line icon
  title: string;
  journal: string;
  date: string;
  summary: string;
  tags: string[];
  evidenceRating: number; // 1-5 stars
  badges: string[];
}

export const samplePapers: PaperCardData[] = [
  {
    id: "1",
    specialty: "Psychiatry",
    specialtyColor: "#6b7280", // slate
    icon: "brain",
    title: "Stanford's 5-Day Brain Stimulation Protocol Achieves 90% Remission",
    journal: "Am J Psychiatry",
    date: "2020",
    summary: "A revolutionary 5-day protocol using fMRI-guided TMS achieved 90.5% remission in treatment-resistant depression patients.",
    tags: ["TMS", "Depression", "Neuromodulation"],
    evidenceRating: 5,
    badges: ["Breakthrough", "High Impact"],
  },
  {
    id: "2",
    specialty: "Cardiology",
    specialtyColor: "#ea580c", // warm orange
    icon: "heart",
    title: "GLP-1 Receptor Agonists Reduce Major Adverse Cardiac Events by 14%",
    journal: "NEJM",
    date: "2025",
    summary: "Large-scale trial demonstrates semaglutide significantly reduces MACE in patients with established cardiovascular disease.",
    tags: ["GLP-1", "MACE", "Semaglutide"],
    evidenceRating: 5,
    badges: ["New This Week", "Guideline Update"],
  },
  {
    id: "3",
    specialty: "Oncology",
    specialtyColor: "#d97706", // amber
    icon: "dna",
    title: "CAR-T Therapy Shows Durable Remission in Relapsed Lymphoma",
    journal: "Lancet Oncol",
    date: "2025",
    summary: "5-year follow-up confirms sustained complete response in 40% of patients with relapsed/refractory large B-cell lymphoma.",
    tags: ["CAR-T", "Lymphoma", "Immunotherapy"],
    evidenceRating: 4,
    badges: ["Clinically Actionable"],
  },
  {
    id: "4",
    specialty: "Pediatrics",
    specialtyColor: "#f59e0b", // soft peach/amber
    icon: "baby",
    title: "Early Peanut Introduction Reduces Allergy Risk by 77%",
    journal: "NEJM",
    date: "2024",
    summary: "LEAP follow-up study confirms lasting protection from peanut allergy with early introduction in high-risk infants.",
    tags: ["Allergy", "Prevention", "Pediatrics"],
    evidenceRating: 5,
    badges: ["High Impact"],
  },
  {
    id: "5",
    specialty: "Neurology",
    specialtyColor: "#4b5563", // dark slate
    icon: "brain",
    title: "Lecanemab Slows Cognitive Decline by 27% in Early Alzheimer's",
    journal: "NEJM",
    date: "2025",
    summary: "Phase 3 confirms anti-amyloid antibody moderately slows progression in early-stage Alzheimer's disease over 18 months.",
    tags: ["Alzheimer's", "Anti-amyloid", "Phase 3"],
    evidenceRating: 4,
    badges: ["New This Week"],
  },
];
```

- [ ] **Step 2: Build PaperCard component**

Create `src/components/sections/product-showcase/PaperCard.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { Star, Heart, Bookmark, Clock, MoreHorizontal } from "lucide-react";
import type { PaperCardData } from "./paper-data";

interface PaperCardProps {
  paper: PaperCardData;
  onCardClick?: (paper: PaperCardData) => void;
  showTooltip?: boolean;
}

export function PaperCard({ paper, onCardClick, showTooltip }: PaperCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onClick={() => onCardClick?.(paper)}
      className="relative flex-shrink-0 w-[320px] bg-white rounded-card overflow-hidden border border-border-warm/30 cursor-pointer group"
    >
      {/* Tooltip on hover */}
      {showTooltip !== false && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
          <div className="bg-espresso text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap">
            Click to see the full paper digest
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-espresso" />
          </div>
        </div>
      )}

      {/* Colored header bar with grain overlay */}
      <div
        className="h-12 relative overflow-hidden"
        style={{ backgroundColor: paper.specialtyColor }}
      >
        {/* Grain texture overlay */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "url(/textures/grain.png)",
            backgroundSize: "200px",
            mixBlendMode: "multiply",
          }}
        />
        <div className="relative z-10 flex items-center justify-between h-full px-4">
          <span className="text-white/90 text-xs font-medium uppercase tracking-wider">
            {paper.specialty}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="p-5">
        {/* Badges */}
        <div className="flex gap-1.5 mb-3 flex-wrap">
          {paper.badges.map((badge) => (
            <span
              key={badge}
              className="text-[10px] font-medium px-2 py-0.5 rounded-badge bg-light-surface text-muted"
            >
              {badge}
            </span>
          ))}
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-badge bg-light-surface text-muted">
            {paper.journal}
          </span>
        </div>

        {/* Title */}
        <h4 className="font-heading text-lg font-normal tracking-heading-card leading-[130%] text-espresso mb-2 line-clamp-2">
          {paper.title}
        </h4>

        {/* Journal + date */}
        <p className="text-xs text-muted mb-3">
          {paper.journal} · {paper.date}
        </p>

        {/* Summary (TL;DR) */}
        <p className="text-sm text-muted leading-[160%] mb-4 line-clamp-3">
          {paper.summary}
        </p>

        {/* Tags */}
        <div className="flex gap-1.5 mb-4 flex-wrap">
          {paper.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2.5 py-1 rounded-full bg-card-surface text-secondary-dark"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Evidence rating + actions */}
        <div className="flex items-center justify-between pt-3 border-t border-border-warm/30">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < paper.evidenceRating ? "fill-warm-tan text-warm-tan" : "text-border-warm"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-3 text-muted">
            <Heart className="w-4 h-4" />
            <Bookmark className="w-4 h-4" />
            <Clock className="w-4 h-4" />
            <MoreHorizontal className="w-4 h-4" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 3: Build EvidenceFeed component**

Create `src/components/sections/product-showcase/EvidenceFeed.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { feedContainer, feedCardReveal } from "@/components/motion/variants";
import { PaperCard } from "./PaperCard";
import { PaperDigest } from "./PaperDigest";
import { samplePapers, type PaperCardData } from "./paper-data";

export function EvidenceFeed() {
  const t = useTranslations("showcase.feed");
  const [selectedPaper, setSelectedPaper] = useState<PaperCardData | null>(null);

  return (
    <div className="py-20 px-6 lg:px-16" id="product-showcase">
      <div className="max-w-container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: description */}
          <motion.div
            initial={{ opacity: 0, x: -148 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.55, 0, 0, 1] }}
          >
            <h2 className="font-heading text-[36px] md:text-[48px] font-normal tracking-heading leading-[110%] text-espresso mb-6">
              {t("headline")}
            </h2>
            <ul className="space-y-4">
              {(["desc1", "desc2", "desc3", "desc4", "desc5"] as const).map((key) => (
                <li key={key} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange mt-2.5 flex-shrink-0" />
                  <span className="font-body text-lg text-muted leading-[150%]">{t(key)}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right: scrollable feed mockup */}
          <motion.div
            initial={{ opacity: 0, x: 148 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.55, 0, 0, 1] }}
            className="relative"
          >
            <div className="overflow-x-auto pb-4 -mr-6 lg:-mr-16 scrollbar-hide">
              <motion.div
                variants={feedContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex gap-5 pr-6 lg:pr-16"
              >
                {samplePapers.map((paper) => (
                  <motion.div key={paper.id} variants={feedCardReveal}>
                    <PaperCard paper={paper} onCardClick={setSelectedPaper} />
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Mobile hint */}
            <p className="text-xs text-muted/50 mt-2 text-center lg:hidden">
              Swipe to see more →
            </p>
          </motion.div>
        </div>
      </div>

      {/* Paper Digest overlay */}
      <AnimatePresence>
        {selectedPaper && (
          <PaperDigest paper={selectedPaper} onClose={() => setSelectedPaper(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 4: Add to page.tsx and verify**

Wire `<EvidenceFeed />` after `<ProblemStatement />`. Verify horizontal scroll, card hover with tooltip, stagger animation.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: evidence feed — scrollable paper cards with hover tooltips"
```

---

### Task 9: Card → Digest Interactive Transition

**Files:**
- Create: `src/components/sections/product-showcase/PaperDigest.tsx`

**Reference:** Spec Section 5.4 "Card → Digest interaction", paper detail screenshots from prototype

- [ ] **Step 1: Build PaperDigest component**

Create `src/components/sections/product-showcase/PaperDigest.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { X, ArrowLeft, Heart, Bookmark, Clock, Share2 } from "lucide-react";
import type { PaperCardData } from "./paper-data";

interface PaperDigestProps {
  paper: PaperCardData;
  onClose: () => void;
}

export function PaperDigest({ paper, onClose }: PaperDigestProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-espresso/30 backdrop-blur-sm" />

      {/* Digest card */}
      <motion.div
        layoutId={`paper-card-${paper.id}`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-card max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
      >
        {/* Header bar (same color as card) */}
        <div
          className="h-14 relative overflow-hidden sticky top-0 z-10"
          style={{ backgroundColor: paper.specialtyColor }}
        >
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: "url(/textures/grain.png)",
              backgroundSize: "200px",
              mixBlendMode: "multiply",
            }}
          />
          <div className="relative z-10 flex items-center justify-between h-full px-6">
            <button onClick={onClose} className="flex items-center gap-2 text-white/90 text-sm hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to feed
            </button>
            <button onClick={onClose} className="text-white/70 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 md:p-8">
          {/* Title */}
          <h3 className="font-heading text-[28px] md:text-[32px] font-normal tracking-heading-card leading-[120%] text-espresso mb-2">
            {paper.title}
          </h3>

          {/* Journal + date */}
          <p className="text-sm text-muted mb-4">
            {paper.journal} · {paper.date}
          </p>

          {/* Action bar */}
          <div className="flex items-center gap-4 mb-8 pb-4 border-b border-border-warm/30">
            <button className="flex items-center gap-1.5 text-sm text-muted hover:text-orange transition-colors">
              <Heart className="w-4 h-4" /> Like
            </button>
            <button className="flex items-center gap-1.5 text-sm text-muted hover:text-orange transition-colors">
              <Bookmark className="w-4 h-4" /> Save
            </button>
            <button className="flex items-center gap-1.5 text-sm text-muted hover:text-orange transition-colors">
              <Clock className="w-4 h-4" /> Read Later
            </button>
            <button className="flex items-center gap-1.5 text-sm text-muted hover:text-orange transition-colors">
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>

          {/* AI Summary */}
          <div className="bg-light-surface rounded-faq p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-orange">✦</span>
              <h4 className="font-heading text-xl font-normal text-espresso">AI Summary</h4>
            </div>
            <div className="flex gap-2 mb-4">
              <button className="text-sm font-medium px-4 py-1.5 rounded-badge bg-card-surface text-espresso">
                Lay Summary
              </button>
              <button className="text-sm font-medium px-4 py-1.5 rounded-badge text-muted hover:bg-card-surface/50 transition-colors">
                Original Abstract
              </button>
            </div>
            <p className="font-body text-base text-muted leading-[170%]">
              {paper.summary}
            </p>
          </div>

          {/* Key Breakpoints & Methods */}
          <div className="bg-light-surface rounded-faq p-6 mb-6">
            <h4 className="font-heading text-xl font-normal text-espresso mb-4">Key Breakpoints & Methods</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-orange/10 text-orange text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                <div>
                  <p className="text-sm font-medium text-secondary-dark">Research Question</p>
                  <p className="text-sm text-muted mt-1">Key research question extracted from the paper...</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-orange/10 text-orange text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                <div>
                  <p className="text-sm font-medium text-secondary-dark">Data & Sample</p>
                  <p className="text-sm text-muted mt-1">Study population and methodology details...</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-orange/10 text-orange text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                <div>
                  <p className="text-sm font-medium text-secondary-dark">Key Results</p>
                  <p className="text-sm text-muted mt-1">Primary outcomes and statistical significance...</p>
                </div>
              </div>
            </div>
          </div>

          {/* Figure Digest placeholder */}
          <div className="bg-light-surface rounded-faq p-6 mb-6">
            <h4 className="font-heading text-xl font-normal text-espresso mb-4">Figure Digest</h4>
            <div className="h-32 bg-card-surface rounded-btn flex items-center justify-center text-muted text-sm">
              Figure analysis preview
            </div>
          </div>

          {/* Floating Ask AI button */}
          <div className="sticky bottom-4 flex justify-end">
            <button className="bg-orange text-white font-medium px-5 py-2.5 rounded-pill shadow-lg flex items-center gap-2 text-sm hover:bg-orange-light transition-colors">
              <span className="text-white">✦</span>
              Ask AI about this paper
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Add `layoutId` to PaperCard for shared element transition**

In `PaperCard.tsx`, add `layoutId={`paper-card-${paper.id}`}` to the root motion.div.

- [ ] **Step 3: Verify the interaction**

Click a paper card → digest overlays with spring animation. Click "Back to feed" or backdrop → animates closed. Verify scroll works within digest.

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: paper digest — interactive card-to-digest transition with AI summary preview"
```

---

### Task 10: Product Showcase — Flywheel + AI Agent + Intelligence Layer

**Files:**
- Create: `src/components/sections/product-showcase/FlyWheelDivider.tsx`, `src/components/sections/product-showcase/AIAgent.tsx`, `src/components/sections/product-showcase/ChatMockup.tsx`, `src/components/sections/product-showcase/IntelligenceLayer.tsx`, `src/components/sections/product-showcase/index.tsx`
- Modify: `src/app/page.tsx`

**Reference:** Spec Sections 5.4 Parts B+C, Animation Section 12.3

- [ ] **Step 1: Build FlyWheelDivider**

Create `src/components/sections/product-showcase/FlyWheelDivider.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export function FlyWheelDivider() {
  const t = useTranslations("showcase");

  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0.5 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.55, 0, 0, 1] }}
      className="py-12 px-6 lg:px-16"
    >
      <div className="max-w-content mx-auto flex items-center gap-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange to-transparent" />
        <p className="font-body text-sm md:text-base font-medium text-muted whitespace-nowrap">
          {t("flywheel")}
        </p>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange to-transparent" />
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Build ChatMockup component**

Create `src/components/sections/product-showcase/ChatMockup.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { chatSequence, messageAppear } from "@/components/motion/variants";
import { Send } from "lucide-react";

const chatMessages = [
  {
    role: "user" as const,
    text: "What's the latest evidence on TMS protocols for treatment-resistant depression? My patient has failed two SSRIs and one SNRI.",
  },
  {
    role: "ai" as const,
    text: "Based on recent evidence, the **Stanford SAINT protocol** shows the strongest results for treatment-resistant depression. Key findings:\n\n• **90.5% remission rate** in an open-label study (Cole et al. 2020, Am J Psychiatry)\n• Uses fMRI-guided targeting of left DLPFC\n• 5-day accelerated protocol (50 sessions total)\n• Significantly faster than standard rTMS (6 weeks)",
  },
  {
    role: "user" as const,
    text: "How does it compare to standard rTMS in terms of durability?",
  },
];

export function ChatMockup() {
  const t = useTranslations("showcase.agent");

  return (
    <div className="bg-card-surface rounded-card overflow-hidden border border-border-warm/30 shadow-lg">
      {/* Chat header */}
      <div className="flex items-center justify-between px-5 py-3 bg-light-surface border-b border-border-warm/20">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-orange flex items-center justify-center">
            <span className="text-white text-xs font-bold">S</span>
          </div>
          <div>
            <span className="text-sm font-medium text-espresso">SciSpark AI</span>
            <span className="text-[10px] text-muted ml-2">{t("remembers")}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-[10px] font-medium text-muted uppercase">{t("online")}</span>
        </div>
      </div>

      {/* Messages */}
      <motion.div
        variants={chatSequence}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="p-4 space-y-4 min-h-[320px]"
      >
        {chatMessages.map((msg, i) => (
          <motion.div
            key={i}
            variants={messageAppear}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-[170%] ${
                msg.role === "user"
                  ? "bg-card-surface text-espresso rounded-br-md"
                  : "bg-white text-espresso rounded-bl-md shadow-sm"
              }`}
            >
              {msg.role === "ai" ? (
                <div
                  className="whitespace-pre-line"
                  dangerouslySetInnerHTML={{
                    __html: msg.text
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-espresso">$1</strong>')
                      .replace(/• /g, '<span class="text-orange mr-1">•</span> '),
                  }}
                />
              ) : (
                msg.text
              )}
            </div>
          </motion.div>
        ))}

        {/* Typing indicator */}
        <motion.div variants={messageAppear} className="flex justify-start">
          <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm flex gap-1">
            <span className="w-2 h-2 rounded-full bg-muted/40 animate-bounce [animation-delay:0ms]" />
            <span className="w-2 h-2 rounded-full bg-muted/40 animate-bounce [animation-delay:150ms]" />
            <span className="w-2 h-2 rounded-full bg-muted/40 animate-bounce [animation-delay:300ms]" />
          </div>
        </motion.div>
      </motion.div>

      {/* Input bar */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 bg-light-surface rounded-btn px-4 py-2.5 border border-border-warm/20">
          <span className="text-sm text-muted/50 flex-1">Ask a follow-up question...</span>
          <div className="w-8 h-8 rounded-full bg-orange flex items-center justify-center">
            <Send className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Build AIAgent section**

Create `src/components/sections/product-showcase/AIAgent.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ChatMockup } from "./ChatMockup";

export function AIAgent() {
  const t = useTranslations("showcase.agent");

  return (
    <div className="py-20 px-6 lg:px-16">
      <div className="max-w-container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: chat mockup */}
          <motion.div
            initial={{ opacity: 0, x: -148 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.55, 0, 0, 1] }}
          >
            <ChatMockup />
          </motion.div>

          {/* Right: description */}
          <motion.div
            initial={{ opacity: 0, x: 148 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.55, 0, 0, 1] }}
          >
            <h2 className="font-heading text-[36px] md:text-[48px] font-normal tracking-heading leading-[110%] text-espresso mb-6">
              {t("headline")}
            </h2>
            <ul className="space-y-4">
              {(["desc1", "desc2", "desc3", "desc4"] as const).map((key) => (
                <li key={key} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange mt-2.5 flex-shrink-0" />
                  <span className="font-body text-lg text-muted leading-[150%]">{t(key)}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Build IntelligenceLayer**

Create `src/components/sections/product-showcase/IntelligenceLayer.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/motion/AnimatedSection";
import { StaggerContainer } from "@/components/motion/StaggerContainer";
import { cardReveal } from "@/components/motion/variants";

const cardKeys = ["card1", "card2", "card3", "card4"] as const;

export function IntelligenceLayer() {
  const t = useTranslations("showcase.intel");

  return (
    <AnimatedSection className="bg-page-warm py-20 px-6 lg:px-16 relative">
      {/* Grain overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "url(/textures/grain.png)",
          backgroundSize: "200px",
          mixBlendMode: "multiply",
        }}
      />

      <div className="max-w-content mx-auto relative z-10">
        <h2 className="font-heading text-[36px] md:text-[48px] font-normal tracking-heading leading-[110%] text-espresso text-center mb-16">
          {t("headline")}
        </h2>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cardKeys.map((key) => (
            <motion.div
              key={key}
              variants={cardReveal}
              className="bg-card-surface rounded-card p-8"
            >
              <h3 className="font-heading text-2xl font-normal tracking-heading-card text-espresso mb-3">
                {t(`${key}.title`)}
              </h3>
              <p className="font-body text-base text-muted leading-[160%]">
                {t(`${key}.desc`)}
              </p>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </AnimatedSection>
  );
}
```

- [ ] **Step 5: Create ProductShowcase wrapper**

Create `src/components/sections/product-showcase/index.tsx`:

```tsx
import { EvidenceFeed } from "./EvidenceFeed";
import { FlyWheelDivider } from "./FlyWheelDivider";
import { AIAgent } from "./AIAgent";
import { IntelligenceLayer } from "./IntelligenceLayer";

export function ProductShowcase() {
  return (
    <section>
      <EvidenceFeed />
      <FlyWheelDivider />
      <AIAgent />
      <IntelligenceLayer />
    </section>
  );
}
```

- [ ] **Step 6: Wire into page.tsx and verify**

Add `<ProductShowcase />` after `<ProblemStatement />`. Verify all four sub-sections render, chat messages stagger in, differentiator cards stagger on scroll.

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: product showcase — AI agent chat mockup, flywheel divider, intelligence layer"
```

---

### Task 11: How It Works + Use Cases

**Files:**
- Create: `src/components/sections/HowItWorks.tsx`, `src/components/sections/UseCases.tsx`
- Modify: `src/app/page.tsx`

**Reference:** Spec Sections 5.5 and 5.6

- [ ] **Step 1: Build HowItWorks**

Create `src/components/sections/HowItWorks.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/motion/AnimatedSection";
import { StaggerContainer } from "@/components/motion/StaggerContainer";
import { cardReveal } from "@/components/motion/variants";

const steps = ["step1", "step2", "step3"] as const;

export function HowItWorks() {
  const t = useTranslations("howItWorks");

  return (
    <AnimatedSection className="bg-[#fef7f0] py-20 px-6 lg:px-16" id="how-it-works">
      <div className="max-w-content mx-auto">
        <h2 className="font-heading text-[36px] md:text-[48px] font-normal tracking-heading leading-[110%] text-espresso text-center mb-16">
          {t("headline")}
        </h2>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((key, i) => (
            <motion.div key={key} variants={cardReveal} className="text-center">
              {/* Numbered circle */}
              <div className="w-12 h-12 rounded-full bg-orange text-white font-heading text-xl flex items-center justify-center mx-auto mb-6">
                {i + 1}
              </div>

              <h3 className="font-heading text-2xl font-normal tracking-heading-card text-espresso mb-3">
                {t(`${key}.title`)}
              </h3>
              <p className="font-body text-base text-muted leading-[160%]">
                {t(`${key}.desc`)}
              </p>

              {/* Arrow (desktop only, not on last step) */}
              {i < 2 && (
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 text-orange text-2xl">
                  →
                </div>
              )}
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </AnimatedSection>
  );
}
```

Note: The arrow positioning needs a relative container on each grid item. Adjust by wrapping each step in a `relative` div.

- [ ] **Step 2: Build UseCases**

Create `src/components/sections/UseCases.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/motion/AnimatedSection";
import { StaggerContainer } from "@/components/motion/StaggerContainer";
import { cardReveal } from "@/components/motion/variants";

const cases = ["case1", "case2", "case3"] as const;

export function UseCases() {
  const t = useTranslations("useCases");

  return (
    <AnimatedSection className="py-20 px-6 lg:px-16" id="use-cases">
      <div className="max-w-content mx-auto">
        <h2 className="font-heading text-[36px] md:text-[48px] font-normal tracking-heading leading-[110%] text-espresso text-center mb-16">
          {t("headline")}
        </h2>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cases.map((key) => (
            <motion.div
              key={key}
              variants={cardReveal}
              className="bg-white rounded-card p-8 border-l-4 border-orange"
            >
              <h3 className="font-heading text-xl font-normal tracking-heading-card text-espresso mb-4">
                {t(`${key}.title`)}
              </h3>
              <p className="font-body text-base text-muted leading-[170%] italic">
                &ldquo;{t(`${key}.quote`)}&rdquo;
              </p>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </AnimatedSection>
  );
}
```

- [ ] **Step 3: Wire both into page.tsx**

Add `<HowItWorks />` and `<UseCases />` after `<ProductShowcase />`.

- [ ] **Step 4: Verify**

Scroll through both sections. Check numbered circles, stagger animation, orange left-border on use case cards, responsive stacking on mobile.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: how it works (3 steps) + use cases (3 personas)"
```

---

### Task 12: FAQ Section

**Files:**
- Create: `src/components/sections/FAQ.tsx`
- Modify: `src/app/page.tsx`

**Reference:** Spec Section 5.7

- [ ] **Step 1: Build FAQ with shadcn Accordion**

Create `src/components/sections/FAQ.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/motion/AnimatedSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqKeys = ["q1", "q2", "q3", "q4"] as const;

export function FAQ() {
  const t = useTranslations("faq");

  return (
    <AnimatedSection className="bg-page-warm py-20 px-6 lg:px-16" id="faq">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-heading text-[36px] md:text-[48px] font-normal tracking-heading leading-[110%] text-espresso text-center mb-16">
          {t("headline")}
        </h2>

        <Accordion type="single" collapsible className="space-y-3">
          {faqKeys.map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.1,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <AccordionItem
                value={key}
                className="bg-card-surface rounded-faq px-6 border-none"
              >
                <AccordionTrigger className="font-heading text-lg font-normal text-espresso tracking-heading-card hover:no-underline py-5">
                  {t(`${key}.q`)}
                </AccordionTrigger>
                <AccordionContent className="font-body text-base text-muted leading-[170%] pb-5">
                  {t(`${key}.a`)}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </AnimatedSection>
  );
}
```

- [ ] **Step 2: Wire into page.tsx and verify**

Accordion items animate in on scroll, open/close smoothly, warm card surfaces.

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat: FAQ section — animated accordion with Claura-style card surfaces"
```

---

### Task 13: Final CTA + Footer

**Files:**
- Create: `src/components/sections/FinalCTA.tsx`, `src/components/sections/Footer.tsx`, `src/lib/supabase.ts`
- Create: `.env.local`
- Modify: `src/app/page.tsx`

**Reference:** Spec Sections 5.8, 5.9, Section 8 (email signup)

- [ ] **Step 1: Create Supabase client + waitlist function**

Create `src/lib/supabase.ts`:

```ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function submitToWaitlist(
  email: string,
  source: "hero" | "footer-cta"
): Promise<{ success: boolean; duplicate?: boolean }> {
  const { error } = await supabase
    .from("waitlist")
    .insert({ email, source });

  if (error) {
    if (error.code === "23505") {
      // Unique constraint violation — duplicate email
      return { success: false, duplicate: true };
    }
    return { success: false };
  }

  return { success: true };
}
```

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://piqucmeufhplabfsqtby.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<copy from sci-spark-discover-2/.env>
```

- [ ] **Step 2: Build FinalCTA**

Create `src/components/sections/FinalCTA.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/motion/AnimatedSection";
import { EmailCapture } from "@/components/EmailCapture";

export function FinalCTA() {
  const t = useTranslations("finalCta");

  return (
    <AnimatedSection className="bg-page-bg py-20 px-6 lg:px-16" id="final-cta">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="font-heading text-[36px] md:text-[48px] font-normal tracking-heading leading-[110%] text-espresso mb-4">
          {t("headline")}
        </h2>
        <p className="font-body text-lg text-muted leading-[150%] mb-8">
          {t("subhead")}
        </p>
        <EmailCapture source="footer-cta" buttonLabel={t("cta")} className="max-w-md mx-auto" />
      </div>
    </AnimatedSection>
  );
}
```

- [ ] **Step 3: Build Footer**

Create `src/components/sections/Footer.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-page-bg border-t border-border-warm/30 py-8 px-6 lg:px-16">
      <div className="max-w-content mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-heading text-lg text-espresso">SciSpark</span>
          <span className="text-sm text-muted">{t("copyright")}</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-muted">
          <a href="#" className="hover:text-espresso transition-colors">{t("privacy")}</a>
          <a href="#" className="hover:text-espresso transition-colors">{t("terms")}</a>
          <a href="#" className="hover:text-espresso transition-colors">{t("contact")}</a>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Wire into page.tsx**

Add `<FinalCTA />` and `<Footer />` as the last sections.

- [ ] **Step 5: Test email submission**

Submit a test email in the hero and final CTA. Verify:
- Success message shows on valid email
- Duplicate error shows on re-submission
- Invalid email shows validation error

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: final CTA with Supabase waitlist + minimal footer"
```

---

## Phase 4: Polish

### Task 14: Assemble Full Page + Scroll Navigation

**Files:**
- Modify: `src/app/page.tsx`, `src/components/sections/Navigation.tsx`

- [ ] **Step 1: Compose all sections in page.tsx**

```tsx
import { Navigation } from "@/components/sections/Navigation";
import { Hero } from "@/components/sections/Hero";
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

- [ ] **Step 2: Add smooth scroll behavior**

In `globals.css`:

```css
html {
  scroll-behavior: smooth;
}
```

- [ ] **Step 3: Verify nav link scrolling**

Click each nav link. Verify smooth scroll to the correct section anchor.

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: assemble full page with smooth scroll navigation"
```

---

### Task 15: Hero Browser Mockup Content

**Files:**
- Modify: `src/components/sections/Hero.tsx`

Replace the placeholder in the BrowserMockup with a mini version of the evidence feed (3 small paper cards side by side) to give visitors an immediate sense of the product.

- [ ] **Step 1: Create a simplified mini-feed for the hero mockup**

Add a `HeroMockupContent` component inside `Hero.tsx` that shows 3 condensed paper cards in a row — just header color bar, title, journal, and star rating. No full detail or scroll.

- [ ] **Step 2: Verify the mockup looks polished inside the browser chrome**

The cards should be small enough to fit 3 across in the mockup container. Warm backgrounds, grain texture on headers.

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat: hero browser mockup with mini evidence feed preview"
```

---

### Task 16: SEO + Performance + Grain Texture

**Files:**
- Modify: `src/app/layout.tsx` (metadata)
- Create: `public/textures/grain.png`
- Modify: `next.config.ts` (if needed)

**Reference:** Spec Section 10

- [ ] **Step 1: Add comprehensive metadata**

Update `layout.tsx` metadata:

```ts
export const metadata: Metadata = {
  title: "SciSpark — Never miss a breakthrough that could save lives",
  description: "AI-powered clinical evidence assistant for healthcare professionals. Personalized research delivered daily, AI-summarized, always grounded in source papers.",
  openGraph: {
    title: "SciSpark — AI Clinical Evidence Assistant",
    description: "Personalized evidence delivered daily. AI-summarized. Always grounded in source papers.",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "SciSpark — Never miss a breakthrough that could save lives",
    description: "AI-powered clinical evidence for healthcare professionals.",
  },
};
```

- [ ] **Step 2: Create or source grain texture**

Create a distressed grain PNG texture (~50KB, 200x200px, tileable) and place at `public/textures/grain.png`. Can be generated from any grain texture generator or extracted from a stock resource.

- [ ] **Step 3: Add `scrollbar-hide` utility**

In `globals.css`:

```css
@layer utilities {
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

- [ ] **Step 4: Test build and performance**

```bash
npm run build
npm run start
```

Open Chrome DevTools Lighthouse. Target: 90+ on Performance, SEO, Best Practices.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: SEO metadata, grain texture, performance optimizations"
```

---

### Task 17: Final Verification + Cleanup

- [ ] **Step 1: Full scroll-through test**

Visit `http://localhost:3000` and scroll through the entire page. Verify every section renders, all animations trigger, no console errors.

- [ ] **Step 2: Mobile test**

Open Chrome DevTools device toolbar. Test at 375px (iPhone) and 768px (iPad). Verify:
- Navigation collapses to hamburger
- Hero stacks vertically
- Feed cards scroll horizontally
- All sections stack cleanly
- Paper digest overlay works on mobile

- [ ] **Step 3: Language toggle test**

Switch to Chinese. Verify all text changes, no missing translation keys.

- [ ] **Step 4: Email submission test**

Submit email in both hero and footer CTA. Verify Supabase receives entries with correct `source` field.

- [ ] **Step 5: Clean up test code**

Remove any temporary test content from `page.tsx` or other files.

- [ ] **Step 6: Final commit**

```bash
git add .
git commit -m "chore: final cleanup and verification pass"
```
