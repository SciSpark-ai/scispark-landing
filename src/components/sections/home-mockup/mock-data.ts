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
