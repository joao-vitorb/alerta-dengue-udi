export type SymptomCheckerPayload = {
  fever: boolean;
  headache: boolean;
  painBehindEyes: boolean;
  bodyAches: boolean;
  jointPain: boolean;
  nausea: boolean;
  vomiting: boolean;
  rash: boolean;
  fatigue: boolean;
  abdominalPain: boolean;
  persistentVomiting: boolean;
  bleedingSigns: boolean;
  drowsiness: boolean;
  dehydrationSigns: boolean;
};

export type SymptomCheckerClassification =
  | "FEW_COMPATIBLE_SIGNS"
  | "COMPATIBLE_SYMPTOMS"
  | "WARNING_SIGNS";

export type RecommendedCareLevel = "PRIMARY_CARE" | "URGENT_CARE";

export type SymptomCheckerResponse = {
  classification: SymptomCheckerClassification;
  headline: string;
  message: string;
  recommendation: string;
  recommendedCareLevel: RecommendedCareLevel;
  compatibleSymptomsCount: number;
  warningSignsCount: number;
  detectedSymptoms: string[];
  disclaimer: string;
};

export type SymptomChecklistItem = {
  key: keyof SymptomCheckerPayload;
  label: string;
  description: string;
  category: "compatible" | "warning";
};
