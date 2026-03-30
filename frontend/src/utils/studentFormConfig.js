// ─── EduRisk AI – Student Form Config ────────────────────────────────────────
// Single source of truth for every payload field the backend expects.
// Keys match the /predict endpoint schema exactly.

export const CATEGORICAL_FIELDS = [
  {
    key: "school",
    label: "School",
    options: [
      { value: "GP", label: "Gabriel Pereira (GP)" },
      { value: "MS", label: "Mousinho da Silveira (MS)" },
    ],
  },
  {
    key: "sex",
    label: "Sex",
    options: [
      { value: "F", label: "Female" },
      { value: "M", label: "Male" },
    ],
  },
  {
    key: "address",
    label: "Address Type",
    options: [
      { value: "U", label: "Urban" },
      { value: "R", label: "Rural" },
    ],
  },
  {
    key: "famsize",
    label: "Family Size",
    options: [
      { value: "LE3", label: "≤ 3 members" },
      { value: "GT3", label: "> 3 members" },
    ],
  },
  {
    key: "Pstatus",
    label: "Parent Cohabitation",
    options: [
      { value: "T", label: "Living Together" },
      { value: "A", label: "Apart" },
    ],
  },
  {
    key: "Mjob",
    label: "Mother's Job",
    options: [
      { value: "teacher", label: "Teacher" },
      { value: "health", label: "Health" },
      { value: "services", label: "Civil Services" },
      { value: "at_home", label: "At Home" },
      { value: "other", label: "Other" },
    ],
  },
  {
    key: "Fjob",
    label: "Father's Job",
    options: [
      { value: "teacher", label: "Teacher" },
      { value: "health", label: "Health" },
      { value: "services", label: "Civil Services" },
      { value: "at_home", label: "At Home" },
      { value: "other", label: "Other" },
    ],
  },
  {
    key: "reason",
    label: "Reason to Choose School",
    options: [
      { value: "home", label: "Close to Home" },
      { value: "reputation", label: "School Reputation" },
      { value: "course", label: "Course Preference" },
      { value: "other", label: "Other" },
    ],
  },
  {
    key: "guardian",
    label: "Guardian",
    options: [
      { value: "mother", label: "Mother" },
      { value: "father", label: "Father" },
      { value: "other", label: "Other" },
    ],
  },
  {
    key: "subject",
    label: "Subject",
    options: [
      { value: "mat", label: "Mathematics" },
      { value: "por", label: "Portuguese" },
    ],
  },
];

export const BOOLEAN_FIELDS = [
  { key: "schoolsup", label: "Extra School Support" },
  { key: "famsup", label: "Family Educational Support" },
  { key: "paid", label: "Extra Paid Classes" },
  { key: "activities", label: "Extra-curricular Activities" },
  { key: "nursery", label: "Attended Nursery School" },
  { key: "higher", label: "Wants Higher Education" },
  { key: "internet", label: "Internet Access at Home" },
  { key: "romantic", label: "In a Romantic Relationship" },
];

export const NUMERIC_FIELDS = [
  { key: "age",        label: "Age",                       min: 15, max: 22, hint: "15 – 22" },
  { key: "Medu",       label: "Mother's Education",        min: 0,  max: 4,  hint: "0 (none) – 4 (higher)" },
  { key: "Fedu",       label: "Father's Education",        min: 0,  max: 4,  hint: "0 (none) – 4 (higher)" },
  { key: "traveltime", label: "Travel Time to School",     min: 1,  max: 4,  hint: "1 (< 15 min) – 4 (> 1 hr)" },
  { key: "studytime",  label: "Weekly Study Time",         min: 1,  max: 4,  hint: "1 (< 2 hrs) – 4 (> 10 hrs)" },
  { key: "failures",   label: "Past Class Failures",       min: 0,  max: 3,  hint: "0 – 3" },
  { key: "famrel",     label: "Family Relationship Quality",min: 1, max: 5,  hint: "1 (very bad) – 5 (excellent)" },
  { key: "freetime",   label: "Free Time After School",    min: 1,  max: 5,  hint: "1 (very low) – 5 (very high)" },
  { key: "goout",      label: "Going Out with Friends",    min: 1,  max: 5,  hint: "1 (very low) – 5 (very high)" },
  { key: "Dalc",       label: "Workday Alcohol Use",       min: 1,  max: 5,  hint: "1 (very low) – 5 (very high)" },
  { key: "Walc",       label: "Weekend Alcohol Use",       min: 1,  max: 5,  hint: "1 (very low) – 5 (very high)" },
  { key: "health",     label: "Current Health Status",     min: 1,  max: 5,  hint: "1 (very bad) – 5 (very good)" },
  { key: "absences",   label: "Number of Absences",        min: 0,  max: 93, hint: "0+" },
  { key: "G1",         label: "First Period Grade",        min: 0,  max: 20, hint: "0 – 20" },
  { key: "G2",         label: "Second Period Grade",       min: 0,  max: 20, hint: "0 – 20" },
];

// ─── Default values for the form ─────────────────────────────────────────────
export const DEFAULT_VALUES = {
  // Categorical
  school: "GP",
  sex: "F",
  address: "U",
  famsize: "GT3",
  Pstatus: "T",
  Mjob: "other",
  Fjob: "other",
  reason: "course",
  guardian: "mother",
  subject: "mat",
  // Boolean
  schoolsup: "no",
  famsup: "yes",
  paid: "no",
  activities: "no",
  nursery: "yes",
  higher: "yes",
  internet: "yes",
  romantic: "no",
  // Numeric
  age: 17,
  Medu: 2,
  Fedu: 2,
  traveltime: 1,
  studytime: 2,
  failures: 0,
  famrel: 4,
  freetime: 3,
  goout: 3,
  Dalc: 1,
  Walc: 2,
  health: 3,
  absences: 4,
  G1: 10,
  G2: 10,
};

// ─── Risk badge colour helper ─────────────────────────────────────────────────
export const getRiskColor = (riskLevel) => {
  if (!riskLevel) return { bg: "#334155", text: "#94a3b8", border: "#475569" };
  const lower = riskLevel.toLowerCase();
  if (lower.includes("high"))
    return { bg: "rgba(239,68,68,0.15)", text: "#f87171", border: "#ef4444" };
  if (lower.includes("medium"))
    return { bg: "rgba(245,158,11,0.15)", text: "#fbbf24", border: "#f59e0b" };
  if (lower.includes("low"))
    return { bg: "rgba(34,197,94,0.15)", text: "#4ade80", border: "#22c55e" };
  return { bg: "#334155", text: "#94a3b8", border: "#475569" };
};
