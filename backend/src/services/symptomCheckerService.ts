import type { SymptomCheckerInput } from "../schemas/symptomCheckerSchemas";

type SymptomCheckerLevel =
  | "FEW_COMPATIBLE_SIGNS"
  | "COMPATIBLE_SYMPTOMS"
  | "WARNING_SIGNS";

type RecommendedCareLevel = "PRIMARY_CARE" | "URGENT_CARE";

type SymptomCheckerResult = {
  classification: SymptomCheckerLevel;
  headline: string;
  message: string;
  recommendation: string;
  recommendedCareLevel: RecommendedCareLevel;
  compatibleSymptomsCount: number;
  warningSignsCount: number;
  detectedSymptoms: string[];
  disclaimer: string;
};

const symptomLabels = {
  fever: "Febre",
  headache: "Dor de cabeça",
  painBehindEyes: "Dor atrás dos olhos",
  bodyAches: "Dor no corpo",
  jointPain: "Dor nas articulações",
  nausea: "Náusea",
  vomiting: "Vômito",
  rash: "Manchas na pele",
  fatigue: "Cansaço",
  lossOfAppetite: "Falta de apetite",
  abdominalPain: "Dor abdominal",
  persistentVomiting: "Vômito persistente",
  bleedingSigns: "Sinais de sangramento",
  drowsiness: "Sonolência ou prostração",
  dehydrationSigns: "Sinais de desidratação",
} as const;

const compatibleSymptomsKeys: Array<keyof SymptomCheckerInput> = [
  "fever",
  "headache",
  "painBehindEyes",
  "bodyAches",
  "jointPain",
  "nausea",
  "vomiting",
  "rash",
  "fatigue",
  "lossOfAppetite",
];

const warningSignsKeys: Array<keyof SymptomCheckerInput> = [
  "abdominalPain",
  "persistentVomiting",
  "bleedingSigns",
  "drowsiness",
  "dehydrationSigns",
];

function countTrueFlags(
  input: SymptomCheckerInput,
  keys: Array<keyof SymptomCheckerInput>,
) {
  return keys.reduce((total, key) => total + (input[key] ? 1 : 0), 0);
}

function getDetectedSymptoms(input: SymptomCheckerInput) {
  return Object.entries(input)
    .filter(([, value]) => value)
    .map(([key]) => symptomLabels[key as keyof typeof symptomLabels]);
}

export function checkSymptoms(
  input: SymptomCheckerInput,
): SymptomCheckerResult {
  const compatibleSymptomsCount = countTrueFlags(input, compatibleSymptomsKeys);
  const warningSignsCount = countTrueFlags(input, warningSignsKeys);
  const detectedSymptoms = getDetectedSymptoms(input);

  if (warningSignsCount >= 1) {
    return {
      classification: "WARNING_SIGNS",
      headline: "Sinais de alerta identificados",
      message:
        "Foram informados sintomas que exigem atenção imediata e avaliação presencial.",
      recommendation:
        "Procure atendimento imediatamente em uma unidade de urgência. Não espere os sintomas piorarem.",
      recommendedCareLevel: "URGENT_CARE",
      compatibleSymptomsCount,
      warningSignsCount,
      detectedSymptoms,
      disclaimer:
        "Este checador é apenas educativo e não substitui avaliação médica nem diagnóstico profissional.",
    };
  }

  const hasStrongCompatibility =
    (input.fever && compatibleSymptomsCount >= 4) ||
    compatibleSymptomsCount >= 5;

  if (hasStrongCompatibility) {
    return {
      classification: "COMPATIBLE_SYMPTOMS",
      headline: "Sintomas compatíveis com dengue",
      message:
        "Os sinais informados merecem avaliação de um profissional de saúde, principalmente se houver piora ou persistência.",
      recommendation:
        "Procure avaliação presencial em uma unidade de atenção primária ou serviço indicado pela rede de saúde.",
      recommendedCareLevel: "PRIMARY_CARE",
      compatibleSymptomsCount,
      warningSignsCount,
      detectedSymptoms,
      disclaimer:
        "Este checador é apenas educativo e não substitui avaliação médica nem diagnóstico profissional.",
    };
  }

  return {
    classification: "FEW_COMPATIBLE_SIGNS",
    headline: "Poucos sinais compatíveis no momento",
    message:
      "Os sintomas informados não indicam, por si só, uma compatibilidade forte, mas a observação continua importante.",
    recommendation:
      "Monitore a evolução dos sintomas e procure avaliação se houver piora, febre persistente ou surgimento de sinais de alerta.",
    recommendedCareLevel: "PRIMARY_CARE",
    compatibleSymptomsCount,
    warningSignsCount,
    detectedSymptoms,
    disclaimer:
      "Este checador é apenas educativo e não substitui avaliação médica nem diagnóstico profissional.",
  };
}
