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
  // Optional rich fields — present on the first paper for the cursor demo
  // digest view; absent on the others (which only appear as feed cards).
  originalTitle?: string;
  citations?: number;
  authors?: string[];
  laySummary?: string;
  originalAbstract?: string;
  paperUrl?: string;
  figureDigest?: {
    caption: string;
    findings: string[];
  };
  breakpoints?: {
    label: string;
    content: string;
    evidence?: string;
  }[];
  relatedPapers?: {
    title: string;
    journal: string;
    year: number;
  }[];
  dataLinks?: {
    code?: string;
    data?: string;
  };
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
    originalTitle:
      "Trial of Psilocybin versus Escitalopram for Major Depressive Disorder with Six-Week Primary Endpoint and Twelve-Month Open-Label Follow-Up",
    citations: 184,
    authors: ["Carhart-Harris RL", "Goodwin GM", "Nutt DJ"],
    paperUrl: "#",
    laySummary:
      "In a head-to-head trial in adults with moderate-to-severe depression, two guided psilocybin sessions and six weeks of the SSRI escitalopram both produced meaningful symptom reduction by week six. Psilocybin acted faster, achieved higher rates of full remission, and improved quality-of-life and connectedness scales more than escitalopram. Side effects in the psilocybin arm were brief and confined to the dosing day; the escitalopram arm reported more sustained drowsiness, sexual dysfunction, and emotional blunting.",
    originalAbstract:
      "We report a phase II, double-blind, randomized, controlled trial of psilocybin versus escitalopram in 59 adults with moderate-to-severe major depressive disorder. Participants received either two doses of psilocybin 25 mg three weeks apart plus daily placebo, or escitalopram 10 mg daily (titrated to 20 mg at week 3) plus two doses of psilocybin 1 mg (active placebo) three weeks apart. The primary outcome was change from baseline in the 16-item Quick Inventory of Depressive Symptoms-Self-Report (QIDS-SR-16) at week 6. Both groups showed clinically significant reductions; the between-group difference favored psilocybin by 2.0 points (95% CI −5.0 to 0.9; not statistically significant on the primary endpoint) but reached significance on multiple secondary measures including the Beck Depression Inventory-1A, Snaith-Hamilton Pleasure Scale, and the Work and Social Adjustment Scale. Remission (QIDS-SR-16 ≤5) at week 6 was 57% in the psilocybin arm versus 28% in the escitalopram arm. Adverse events were transient and dosing-day-limited in the psilocybin arm.",
    figureDigest: {
      caption: "Figure 1 · QIDS-SR-16 trajectory",
      findings: [
        "Mean QIDS-SR-16 score dropped 8.0 points in the psilocybin arm versus 6.0 points in the escitalopram arm at week 6, with separation visible by day 1 post-first-dose.",
        "57% of psilocybin participants reached full remission (QIDS-SR-16 ≤5) at week 6 versus 28% on escitalopram; the curves remain separated at week 12 follow-up.",
        "Snaith-Hamilton Pleasure Scale and quality-of-life metrics favored psilocybin across all measured time points (p<0.05 throughout).",
        "Adverse-event timeline shows psilocybin AEs cluster in the 24 h dosing window; escitalopram AEs persist across weeks 1–6.",
      ],
    },
    breakpoints: [
      {
        label: "Research Question",
        content:
          "Does two guided sessions of psilocybin 25 mg produce greater six-week reduction in QIDS-SR-16 than a standard six-week course of escitalopram in adults with moderate-to-severe MDD?",
        evidence: "Evidence: Objectives, p.1402",
      },
      {
        label: "Data & Sample",
        content:
          "59 adults aged 18–80 with moderate-to-severe MDD (HAM-D ≥17), recruited across two UK academic centers; balanced for age, sex, and baseline symptom severity; median age 41; 33% female.",
        evidence: "Evidence: Participants, p.1403",
      },
      {
        label: "Method Highlights",
        content:
          "Double-blind, randomized, active-placebo controlled. Psilocybin arm: 25 mg × 2 sessions three weeks apart + daily placebo SSRI. Escitalopram arm: 10 mg daily (escalated to 20 mg) + 1 mg psilocybin × 2 (active placebo). Both arms received supportive psychotherapy.",
        evidence: "Evidence: Trial Design, p.1404–1405",
      },
      {
        label: "Key Results",
        content:
          "Primary endpoint not statistically significant. Secondary outcomes (remission rate, BDI, Snaith-Hamilton, WSAS, connectedness) all favored psilocybin. Remission at week 6: 57% vs 28%. Effect sizes for psilocybin were larger and emerged sooner.",
        evidence: "Evidence: Results, p.1406–1409, Figures 1–3",
      },
      {
        label: "Implications & Limitations",
        content:
          "Suggests psilocybin merits direct comparison with first-line SSRIs in larger trials. Limitations: small sample size, blinding integrity given perceptible psilocybin effects, short follow-up window, single-center population not generalizable to all comorbidities.",
        evidence: "Evidence: Discussion, p.1410–1412",
      },
    ],
    relatedPapers: [
      {
        title: "Single-Dose Psilocybin for a Treatment-Resistant Episode of Major Depression",
        journal: "New England Journal of Medicine",
        year: 2023,
      },
      {
        title: "Efficacy of Psilocybin in Treatment-Resistant Depression: A Randomized Clinical Trial",
        journal: "JAMA Psychiatry",
        year: 2025,
      },
      {
        title: "Default Mode Network Modulation by Psilocybin: A Mechanism for Therapeutic Effect",
        journal: "PNAS",
        year: 2022,
      },
    ],
    dataLinks: {
      code: "https://github.com/carhart-harris-lab/psilo-escit-2024",
      data: "De-identified individual participant data available via the UK Data Service (reference SN-855207).",
    },
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
    specialtyColor: "#9333ea",
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
    tags: ["Focused Ultrasound"],
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
