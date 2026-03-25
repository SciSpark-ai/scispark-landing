export interface PaperCardData {
  id: string;
  specialty: string;
  specialtyColor: string;
  title: string;
  journal: string;
  date: string;
  summary: string;
  tags: string[];
  evidenceRating: number;
  badges: string[];
}

export const samplePapers: PaperCardData[] = [
  {
    id: "1", specialty: "Psychiatry", specialtyColor: "#6b7280",
    title: "Stanford's 5-Day Brain Stimulation Protocol Achieves 90% Remission",
    journal: "Am J Psychiatry", date: "2020",
    summary: "A revolutionary 5-day protocol using fMRI-guided TMS achieved 90.5% remission in treatment-resistant depression patients.",
    tags: ["TMS", "Depression", "Neuromodulation"], evidenceRating: 5,
    badges: ["Breakthrough", "High Impact"],
  },
  {
    id: "2", specialty: "Cardiology", specialtyColor: "#ea580c",
    title: "GLP-1 Receptor Agonists Reduce Major Adverse Cardiac Events by 14%",
    journal: "NEJM", date: "2025",
    summary: "Large-scale trial demonstrates semaglutide significantly reduces MACE in patients with established cardiovascular disease.",
    tags: ["GLP-1", "MACE", "Semaglutide"], evidenceRating: 5,
    badges: ["New This Week", "Guideline Update"],
  },
  {
    id: "3", specialty: "Oncology", specialtyColor: "#d97706",
    title: "CAR-T Therapy Shows Durable Remission in Relapsed Lymphoma",
    journal: "Lancet Oncol", date: "2025",
    summary: "5-year follow-up confirms sustained complete response in 40% of patients with relapsed/refractory large B-cell lymphoma.",
    tags: ["CAR-T", "Lymphoma", "Immunotherapy"], evidenceRating: 4,
    badges: ["Clinically Actionable"],
  },
  {
    id: "4", specialty: "Pediatrics", specialtyColor: "#f59e0b",
    title: "Early Peanut Introduction Reduces Allergy Risk by 77%",
    journal: "NEJM", date: "2024",
    summary: "LEAP follow-up study confirms lasting protection from peanut allergy with early introduction in high-risk infants.",
    tags: ["Allergy", "Prevention", "Pediatrics"], evidenceRating: 5,
    badges: ["High Impact"],
  },
  {
    id: "5", specialty: "Neurology", specialtyColor: "#4b5563",
    title: "Lecanemab Slows Cognitive Decline by 27% in Early Alzheimer's",
    journal: "NEJM", date: "2025",
    summary: "Phase 3 confirms anti-amyloid antibody moderately slows progression in early-stage Alzheimer's disease over 18 months.",
    tags: ["Alzheimer's", "Anti-amyloid", "Phase 3"], evidenceRating: 4,
    badges: ["New This Week"],
  },
];
