# SciSpark Landing Page — Design Spec

**Date:** 2026-03-24
**Status:** Approved for implementation planning
**Project:** SciSpark clinical evidence platform — new landing page

---

## 1. Context & Decision

SciSpark is pivoting from general research literature recommendation to an **AI-driven clinical evidence assistant** for healthcare professionals. The current landing page (React + Vite + Tailwind + shadcn/ui, built with Lovable) was designed for the old product and cannot be retrofitted — the messaging, audience, visual identity, and information architecture are fundamentally different.

**Decision:** Build a new landing page from scratch in a new repository.

## 2. Goals

- **Primary:** Showcase SciSpark's capabilities and convert visitors into early access signups
- **Audience:** Healthcare professionals broadly (not narrowed to one specialty)
- **Tone:** Product-led with narrative support (not story-first, not data-only)

## 3. Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | **Next.js** | SSR/SSG for SEO (clinicians will Google us), clean routing for future pages |
| Styling | **Tailwind CSS** | Utility-first, fast iteration |
| Components | **shadcn/ui** | Radix primitives, consistent with team experience |
| Language | **TypeScript** | Type safety |
| i18n | **English + Chinese** | Bilingual from launch |
| Deployment | Vercel/Netlify | Trivial Next.js deployment |

## 4. Brand Direction: "Living Evidence"

### Visual Identity

| Element | Specification |
|---------|--------------|
| **Typography** | **Halant** (FontShare) for headings at weight 400 (regular, NOT bold) — this is the exact font from Claura. Elegant, warm serif with slightly exotic character. + **Geist** (Google Fonts) for body text at weights 400/500. Headings use tight letter-spacing (-0.06 to -0.07em). Key words in headings highlighted in muted tan color for emphasis (like Claura's "typical", "without" pattern). |
| **Primary Color** | Orange (#f97316) — SciSpark's signature color |
| **Palette** | Orange primary (#f97316), warm cream/blush backgrounds (#f5efe7), dark chocolate brown (#3b2a1a) for text and buttons (NOT pure black), warm beige (#ede8e0) for card surfaces, muted tan/taupe for de-emphasized heading words, soft gold (#fde68a) accent. All sections use light warm backgrounds — no dark sections. Dark mode will be added later. |
| **Motif** | Spark / starburst marks — small, bright accent shapes representing moments of discovery. Used as scattered background decoration and potentially as a recognizable brand mark. Exact shape, weight, and placement TBD in Figma. |
| **Texture** | Heavy distressed grain (real texture image overlay, not SVG noise). Rounded corners (14px cards), pill-shaped buttons, warm backgrounds, soft organic shapes |
| **Buttons** | Pill-shaped, orange primary with subtle shadow |
| **Tone** | Claude-like warmth but with more orange energy. Clinical authority + modern warmth. More styled than Elicit — a full brand system, not just clean minimal. |
| **Layout Reference** | Bind (bind.framer.ai) — adopt its spaciousness, generous whitespace, browser-window-style product mockups, airy section rhythm, and scroll animations. |
| **Visual/Brand Reference** | Claura (claura.framer.ai) — adopt its warm cream/brown palette, light-weight serif headings with muted highlight words, warm beige card surfaces (not white), dark brown text (not black), dreamy blurred imagery, large rounded corners (20px+), and overall editorial warmth. This is the primary visual reference. |
| **Typography Reference** | Elicit (elicit.com) — scholarly serif headings that feel classic and trustworthy, appropriate for a research/clinical tool. Claura's heading style is very similar. |
| **Backgrounds** | Warm cream/blush page background (#f5efe7), warm beige card surfaces (#ede8e0) — NOT pure white (like Claura). All sections light — alternate between page bg and slightly warmer section bg for rhythm. |
| **Cards/Surfaces** | Warm beige (#ede8e0) with ultra-subtle borders, large rounded corners (16-20px like Claura), generous internal padding (24-32px). White only for input fields and specific UI elements. |

### Brand System Requirements
- **Richer visual texture:** Subtle gradients, soft shadows, layered depth, grain texture overlays — not flat
- **Distinctive typography:** Halant serif headings at weight 400 (from FontShare) with muted-color keyword highlighting (like Claura's "typical", "without" in lighter tone). Geist sans-serif for body text. Makes SciSpark feel scholarly and editorial.
- **Warm brown palette:** Dark chocolate brown (#3b2a1a) for text and buttons instead of pure black. Warm beige cards instead of white. Everything feels warmer and more human than typical SaaS sites.
- **Signature visual motif:** Spark/starburst marks recurring across the site — the "spark" in SciSpark made visual
- **Consistency:** Design language should feel cohesive across every touchpoint (like Claude/Anthropic)

## 5. Page Structure

Seven sections in scroll order:

### 5.1 Navigation (Fixed Header)
- Logo + "SciSpark" wordmark
- Nav links: Product (scrolls to Product Showcase), How It Works, Use Cases, FAQ
- Language toggle (EN | 中文)
- CTA button: "Get Early Access"

### 5.2 Section 1: Hero
- Kicker: "AI-Powered Clinical Evidence"
- Headline: "Never miss a breakthrough that could save lives"
- Subhead: "Personalized evidence delivered daily. AI-summarized. Always grounded in source papers."
- Dual CTAs: "Get Early Access" (solid orange pill) + "See how it works" (outlined pill)
- Email capture can be on a secondary step or in a modal after clicking CTA
- Micro-copy: "Free to start. No credit card required."
- Background: Warm ivory with generous whitespace
- **Below the fold: Browser-window product mockup** (like Bind's hero) — a white card with macOS-style traffic light dots, showing either the evidence feed or AI agent chat in action. This is the hero visual — it shows the product immediately.

### 5.3 Section 2: Problem Statement
- Warm background section (#f6f0e9 or similar) for subtle contrast from hero
- Headline: "The Problem" / "Clinicians are drowning in research they can't keep up with"
- Three stat cards:
  - **3,000+** medical papers published daily
  - **17 years** average delay for breakthroughs to reach patients
  - **250,000** American lives lost annually to outdated practices
- Narrative quote (abbreviated Maria's story): *"A patient suffered for 10 years with treatment-resistant depression. The Stanford SAINT protocol achieved 90% remission in 5 days — but her doctor never knew it existed."*

### 5.4 Section 3: Product Showcase

**This is the centerpiece of the page.** Three-part narrative layout:

#### Part A: Personalized Evidence Feed (Pillar 1)
- Layout: Text description left, scrollable feed mockup right
- Description highlights:
  - Home screen experience — thousands of papers filtered to what matters
  - AI-summarized TL;DR on every card so you can scan fast
  - Click any card → detailed paper digest page (AI summary, figure analysis, key methods, related papers)
  - Learns from behavior (like, save, read, skip)
  - Auto-evaluates study rigor & trustworthiness
  - Gets smarter every day
- **Feed mockup:** Horizontal scrollable paper cards (visitor can scroll/swipe)
  - Each card has: colored header bar with grain texture + line icon, journal badge, category badge
  - Card body: serif title, journal/date, plain-language TL;DR summary, topic pill tags, evidence rating (stars), action bar (heart, bookmark, clock, more)
  - Cards span diverse specialties (cardiology, oncology, psychiatry, pediatrics, etc.)
  - Evidence badges: "Evidence: ★★★★★", "New This Week", "High Impact", "Clinically Actionable", "Guideline Update", "Breakthrough"
  - Specialty color coding per card header (warm orange for cardiology, dark slate for neuro/psych, amber/gold for oncology, soft peach for pediatrics — exact palette TBD in design)
  - Grain texture: Real distressed texture image overlay (PNG, ~50KB) with `mix-blend-mode: multiply`, not SVG noise
- **Card → Digest interaction (interactive mockup):**
  - On hover: card lifts slightly (y: -4px, shadow increase) and a tooltip bubble fades in above the cursor area — "Click to see the full paper digest" with a small arrow pointing down at the card
  - On click: card expands and morphs into a paper digest page view using Framer Motion `layoutId` for a smooth shared-element transition. The digest shows a condensed version of the real product page: AI Summary section, Figure Digest preview, Key Breakpoints list, and a "Back to feed" link
  - Back: clicking "Back to feed" or clicking outside reverses the animation — digest shrinks back into the card in the feed
  - Purpose: lets visitors experience the card→digest flow firsthand, making the product tangible without needing a signup
  - Mobile: on touch devices, first tap shows the tooltip, second tap opens the digest (or use a persistent "Tap any card" hint)

#### Flywheel Divider
- Visual bridge between the two pillars
- Text: "Feed informs AI ⇄ AI informs Feed"
- Styled as a horizontal rule with orange gradient lines

#### Part B: AI Clinical Agent (Pillar 2)
- Layout: Chat mockup left, text description right (alternating from Pillar 1)
- Chat mockup on warm beige background (#efe7dd) with subtle shadow
  - Header: SciSpark AI logo + "Remembers your context" + ONLINE indicator
  - Sample conversation about SAINT protocol vs standard TMS for treatment-resistant patients
  - **Animated agent reasoning process:** After the user's question appears, the mockup shows the agent conducting a fully automated, lightweight review in real time:
    1. **Searching** — "Searching 12,847 papers..." with a spinning/progress indicator
    2. **Screening** — "Screening 23 relevant results..." with papers briefly flashing/filtering
    3. **Extracting** — "Extracting data from 6 key studies..." with citation chips appearing one by one
    4. **Reasoning** — "Synthesizing evidence..." with a brief thinking indicator
    5. **Answer** — The final AI response types in with bold stats and citation chips (Cole et al. 2020, Am J Psychiatry)
  - Each step is a small status line that appears, stays briefly, then transitions to the next — creating a visible "agent at work" sequence before the answer appears
  - The whole sequence auto-plays when the section scrolls into view (triggered once)
  - Follow-up question visible, input field at bottom
- Description highlights:
  - Persistent memory across sessions
  - Every claim grounded with citations
  - Understands your clinical context
  - Learns from your feed interactions too
  - **Transparent reasoning** — watch the agent search, screen, and synthesize before answering

#### Part C: Intelligence Layer ("What Makes SciSpark Different")
- Warm cream background (#f6f0e9) with subtle grain overlay
- Headline: "Intelligence you can trust"
- Four differentiator cards:
  1. **Evidence-Based** — Auto-evaluates scientific rigor, methodology quality, and clinical trustworthiness
  2. **Precision-Personalized** — Tailored to your specialty, patients, and clinical context
  3. **Always Up-to-Date** — Continuously tracking latest research worldwide, new studies indexed as they publish
  4. **Self-Improving** — Feed behavior informs AI, AI conversations refine feed, flywheel gets smarter

### 5.5 Section 4: How It Works
- Warm background (#fef7f0)
- Three steps with numbered orange circles + arrows:
  1. **Tell us your focus** — Set your specialty, interests, and clinical questions
  2. **Get your daily digest** — AI curates and summarizes the evidence that matters to you
  3. **Ask anything** — Dive deeper with AI Q&A grounded in cited sources

### 5.6 Section 5: Use Cases ("Built for Every Clinician")
- Three persona cards with orange left-border accent:
  1. **Attending Physicians** — Balancing 30+ patients/week, need to catch new treatments and updated guidelines
  2. **Residents & Fellows** — Staying current across multiple rotations with limited time
  3. **Clinical Researchers** — Tracking breakthroughs across adjacent fields and disciplines
- Each card uses first-person quote voice for relatability

### 5.7 Section 6: FAQ
- Clean accordion component
- Key questions to address:
  - How does SciSpark personalize my feed?
  - Is the AI content reliable for clinical decisions?
  - What specialties are supported?
  - How is this different from PubMed or UpToDate?
  - (Additional questions TBD)

### 5.8 Section 7: Final CTA
- Warm blush background (#f5efe7) with orange accent elements
- Headline: "Better evidence. Better care."
- Subhead: "Join hundreds of clinicians getting early access to SciSpark."
- Email input + "Join Early Access" CTA button

### 5.9 Footer
- Minimal: Logo, copyright, Privacy, Terms, Contact links

## 6. Product Showcase — Detailed Product Model

The landing page must accurately represent SciSpark's actual product:

### Core Product Architecture
1. **Personalized Evidence Feed** (home screen) — Paper-centric cards, YouTube-like engagement (like, save, etc.), recommendation engine that learns from behavior
2. **AI Clinical Agent** — Persistent agent across the platform with memory layer. Not just Q&A — an AI colleague that knows your practice, similar to general-purpose AI assistants but specialized for clinical evidence.
3. **The Flywheel** — Both systems feed each other. Feed interactions inform the AI agent, AI conversations inform the recommendation engine. Shared user feature extraction.

### Key Differentiators (vs PubMed, UpToDate, Doximity)
- Recommendations grounded in **evidence-based medicine** (auto-evaluates study rigor, trustworthiness, clinical actionability)
- Recommendations grounded in **precision medicine** (personalized to each clinician's context)
- **Real-time** — Continuously tracking newly published research worldwide
- **Self-improving** — Data flywheel: more usage = better personalization

### Paper Card Deep-Dive Flow (product context, NOT part of landing page)
In the actual product, feed card → Paper detail digest page with:
- AI Summary section with Lay Summary / Original Abstract toggle tabs
- Figure Digest — extracted figures with AI-generated bullet-point explanations
- Key Breakpoints & Methods — numbered structured sections (Research Question, Data & Sample, Method Highlights, Key Results, Limitations) with evidence citations referencing specific pages
- Related & Extended papers — image cards linking to related research
- Quick Citation — Copy BibTeX, Copy APA, Export to Zotero
- Relevance feedback — "Is this paper relevant to you?" (Yes/No) to improve recommendations
- Floating "Ask AI about this paper" CTA — opens the AI agent in paper context
- Action bar: Like, Save, Read Later, Share

*Note: The landing page shows static mockups of the feed and chat. No interactive drill-down is implemented — these are decorative UI representations of the product.*

## 7. Bilingual (i18n)

- Full English + Chinese support from launch
- **Library:** `next-intl` (built for Next.js App Router, supports SSR/SSG)
- **Translation files:** JSON per locale (`messages/en.json`, `messages/zh.json`), namespaced by section (e.g., `hero.headline`, `problem.stat1`)
- **Routing:** No locale in URL path — toggle-only via language switcher (keeps URLs clean for SEO, primary audience is English)
- Language toggle in navigation persists choice via cookie

## 8. Email Signup Behavior

Both CTAs (Hero + Final CTA) collect an email for early access:

- **Submission:** POST to Supabase `waitlist` table (reuse existing Supabase project from current site)
- **Fields:** email (required), timestamp (auto), source ("hero" or "footer-cta")
- **Success state:** Inline confirmation message: "You're on the list! We'll be in touch soon."
- **Error state:** Inline error for invalid email or duplicate: "Please enter a valid email" / "This email is already on the waitlist."
- **No authentication required** — simple insert, no account creation

## 9. Mobile Responsiveness

- **Navigation:** Collapses to hamburger menu on mobile (<768px)
- **Hero:** Single column, email input stacks full-width
- **Problem stats:** Stack vertically (1 column)
- **Product Showcase Feed cards:** Remain horizontal scroll on mobile (natural swipe gesture)
- **Product Showcase AI chat mockup:** Full-width, stacked below description text
- **How It Works steps:** Stack vertically with connecting line instead of arrows
- **Use Case cards:** Stack vertically
- **FAQ:** Full-width accordion (already mobile-friendly)
- **All sections:** Max-width container on desktop (1200px), full-bleed backgrounds

## 10. SEO & Performance

- **Rendering:** Static Site Generation (SSG) — content is static, no need for SSR
- **Meta:** Page title "SciSpark — Never miss a breakthrough that could save lives", meta description summarizing the value prop, Open Graph image with brand visuals
- **Performance:** Target Lighthouse 90+ on all Core Web Vitals. Grain texture PNG must be optimized and lazy-loaded. Fonts loaded via `next/font` for zero layout shift.

## 11. What's NOT in Scope (for now)

- Credibility signals / team section (will add later)
- Pricing preview
- Comparison table vs competitors
- Blog or docs pages
- Authentication / actual signup backend
- Dark mode
- Accessibility audit (target WCAG 2.1 AA in a follow-up pass — note orange on ivory may need contrast adjustments)

## 12. Animation & Motion Design

**Library:** Framer Motion (built by the Framer team, first-class Next.js support)
**Reference:** bind.framer.ai — replicate the premium, alive feel of their scroll animations and micro-interactions
**Reference file:** See `docs/bind-reference-tokens.md` for exact extracted design tokens, spacing values, and animation parameters from the Bind Framer template source code.

### 12.1 Page Load — Hero Sequence

Elements fade up from 40px below with slight scale, matching Bind's exact values.

```tsx
// Bind-matched hero animation
const heroElement = {
  hidden: { opacity: 0.001, y: 40, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: 1.0, duration: 1.5, ease: [0.55, 0, 0, 1] }
  }
};

// Per-word blur reveal for headline (Bind's signature effect)
// Each word is wrapped in an inline-block span:
const wordReveal = {
  hidden: { opacity: 0.001, filter: "blur(6px)", y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { delay: 1.0 + i * 0.08, duration: 0.8, ease: [0.55, 0, 0, 1] }
  })
};

// Usage in Hero:
<motion.div initial="hidden" animate="visible">
  <motion.div variants={heroElement}>Badge</motion.div>
  <h1>
    {words.map((word, i) => (
      <motion.span key={i} custom={i} variants={wordReveal} style={{ display: "inline-block" }}>
        {word}&nbsp;
      </motion.span>
    ))}
  </h1>
  <motion.p variants={heroElement}>Subhead</motion.p>
  <motion.div variants={heroElement}>CTAs</motion.div>
</motion.div>
```

### 12.2 Hero Product Mockup — Slide Up

The browser-window mockup starts scaled up (1.4x) and pushed down, then settles into place. This creates a dramatic "rising into view" effect. Matched from Bind's exact values.

```tsx
const mockupReveal = {
  hidden: { opacity: 1, y: 95, scale: 1.4 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: 0.95, duration: 1.3, ease: [0.68, 0, 0, 0.99] }
  }
};

<motion.div variants={mockupReveal} initial="hidden" animate="visible">
  <BrowserMockup>
    {/* Feed or AI chat content inside */}
  </BrowserMockup>
</motion.div>
```

### 12.3 Chat Message Typing Simulation (AI Agent Mockup)

Chat messages appear one at a time with a typing indicator, simulating a real AI conversation.

```tsx
const chatSequence = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 1.2, delayChildren: 0.8 }
  }
};

const messageAppear = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

// Each chat bubble is a child with messageAppear variant
// Optional: show a "..." typing indicator before each AI response
// that fades out as the message fades in
```

### 12.4 Scroll-Triggered Section Reveals

Every major section fades in and slides up 148px when entering viewport. Bind uses a large travel distance for dramatic effect.

```tsx
const sectionReveal = {
  hidden: { opacity: 0, y: 148 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.55, 0, 0, 1] }
  }
};

// Reusable wrapper for any section
function AnimatedSection({ children }) {
  return (
    <motion.section
      variants={sectionReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {children}
    </motion.section>
  );
}
```

### 12.5 Card Stagger — Features, Use Cases, Differentiators

Cards within a section stagger in from the bottom, each delayed ~100ms from the previous.

```tsx
const cardContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const cardReveal = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

// Grid of cards
<motion.div
  variants={cardContainer}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-50px" }}
>
  {cards.map(card => (
    <motion.div key={card.id} variants={cardReveal}>
      <Card {...card} />
    </motion.div>
  ))}
</motion.div>
```

### 12.6 Feed Card Scroll Animation

Feed cards in the Product Showcase scroll in from the right with stagger, simulating a live feed loading.

```tsx
const feedContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const feedCardReveal = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};
```

### 12.7 Stat Counter Animation (Problem Section)

Numbers count up from 0 when the section enters the viewport.

```tsx
// Using framer-motion's useMotionValue + useTransform + animate
function AnimatedStat({ target, suffix = "" }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, v => Math.round(v).toLocaleString());
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      animate(count, target, { duration: 1.5, ease: "easeOut" });
    }
  }, [inView]);

  return <motion.span ref={ref}>{rounded}{suffix}</motion.span>;
}

// Usage: <AnimatedStat target={3000} suffix="+" />
//        <AnimatedStat target={17} suffix=" yrs" />
//        <AnimatedStat target={250000} />
```

### 12.8 Micro-Interactions

**Card hover:**
```tsx
<motion.div
  whileHover={{ y: -4, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
  transition={{ duration: 0.2, ease: "easeOut" }}
>
  <Card />
</motion.div>
```

**Button hover:**
```tsx
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.15 }}
>
  Get Early Access
</motion.button>
```

**Link/nav hover:**
```tsx
// Underline slides in from left
<motion.a whileHover="hovered">
  <span>Features</span>
  <motion.div
    style={{ height: 1, background: "#f97316", originX: 0 }}
    variants={{
      initial: { scaleX: 0 },
      hovered: { scaleX: 1 }
    }}
    transition={{ duration: 0.2 }}
  />
</motion.a>
```

### 12.9 Global Easing

Use a consistent custom easing curve across all animations for cohesion:

```tsx
// Two easing curves from Bind, use consistently:
const EASE_HERO = [0.55, 0, 0, 1];      // Hero elements — smooth with dramatic settle
const EASE_MOCKUP = [0.68, 0, 0, 0.99]; // Browser mockup — snappier start, smooth end

// Both are aggressive ease-out curves that start fast and decelerate slowly
// The near-zero values at positions 2-3 create the premium "floating into place" feel
```

### 12.10 Performance Guidelines

- All scroll animations use `viewport={{ once: true }}` — animate once, don't re-trigger
- Use `will-change: transform` sparingly — only on elements that actually animate
- Chat typing simulation should lazy-load and only start when the mockup is in view
- Stat counter animation triggers only when section enters viewport
- Keep total animated elements per viewport under 10 to maintain 60fps
- Test on mobile — reduce or simplify animations below 768px if needed

## 13. Open Design Questions (for Figma)

These details were discussed but need proper design iteration:
- Exact specialty color palette for card headers
- Line icon designs per specialty
- Grain texture intensity and exact PNG asset
- Spark/starburst motif: exact shape, weight, rotation, opacity, and placement across sections
- Typography scale and spacing system
- Mobile responsive breakpoints and card behavior on mobile
