import type { SymptomCheckerRequestInput } from "../schemas/symptomCheckerSchemas";

type SymptomCheckerSeverity = "LOW" | "MEDIUM" | "HIGH";

type SymptomCheckerCategory =
  | "LOW_COMPATIBILITY"
  | "COMPATIBLE_SYMPTOMS"
  | "WARNING_SIGNS";

type SymptomCheckerAdviceLevel =
  | "SELF_MONITORING"
  | "MEDICAL_EVALUATION"
  | "IMMEDIATE_CARE";

type SymptomCheckerResult = {
  category: SymptomCheckerCategory;
  severity: SymptomCheckerSeverity;
  adviceLevel: SymptomCheckerAdviceLevel;
  headline: string;
  summary: string;
  recommendation: string;
  warningSignsDetected: string[];
  compatibleSymptomsDetected: string[];
  score: {
    compatibilityScore: number;
    warningSignScore: number;
  };
  disclaimer: string;
};

const disclaimerText =
  "Este resultado é apenas educativo e não substitui avaliação médica, exames ou diagnóstico profissional.";

function getCompatibleSymptoms(input: SymptomCheckerRequestInput) {
  const compatibleSymptoms: string[] = [];

  if (input.fever) {
    compatibleSymptoms.push("Febre");
  }

  if (input.headache) {
    compatibleSymptoms.push("Dor de cabeça");
  }

  if (input.painBehindEyes) {
    compatibleSymptoms.push("Dor atrás dos olhos");
  }

  if (input.bodyAche) {
    compatibleSymptoms.push("Dor no corpo");
  }

  if (input.jointPain) {
    compatibleSymptoms.push("Dor nas articulações");
  }

  if (input.nausea) {
    compatibleSymptoms.push("Náusea");
  }

  if (input.vomiting) {
    compatibleSymptoms.push("Vômito");
  }

  if (input.rash) {
    compatibleSymptoms.push("Manchas vermelhas na pele");
  }

  return compatibleSymptoms;
}

function getWarningSigns(input: SymptomCheckerRequestInput) {
  const warningSigns: string[] = [];

  if (input.abdominalPain) {
    warningSigns.push("Dor abdominal");
  }

  if (input.persistentVomiting) {
    warningSigns.push("Vômitos persistentes");
  }

  if (input.bleeding) {
    warningSigns.push("Sangramento");
  }

  if (input.dizzinessOrFainting) {
    warningSigns.push("Tontura ou desmaio");
  }

  if (input.breathingDifficulty) {
    warningSigns.push("Dificuldade para respirar");
  }

  if (input.extremeTirednessOrIrritability) {
    warningSigns.push("Cansaço intenso ou irritabilidade");
  }

  return warningSigns;
}

export function evaluateSymptoms(
  input: SymptomCheckerRequestInput,
): SymptomCheckerResult {
  const compatibleSymptomsDetected = getCompatibleSymptoms(input);
  const warningSignsDetected = getWarningSigns(input);

  const compatibilityScore = compatibleSymptomsDetected.length;
  const warningSignScore = warningSignsDetected.length;

  if (warningSignScore > 0) {
    return {
      category: "WARNING_SIGNS",
      severity: "HIGH",
      adviceLevel: "IMMEDIATE_CARE",
      headline: "Sinais de alerta detectados",
      summary:
        "Os sintomas informados incluem sinais que merecem avaliação presencial rápida.",
      recommendation:
        "Procure atendimento imediatamente, principalmente se os sintomas estiverem piorando ou se você se sentir mais fraco do que o normal.",
      warningSignsDetected,
      compatibleSymptomsDetected,
      score: {
        compatibilityScore,
        warningSignScore,
      },
      disclaimer: disclaimerText,
    };
  }

  const hasStrongCompatibilityPattern =
    input.fever &&
    compatibilityScore >= 4 &&
    (input.bodyAche || input.jointPain || input.painBehindEyes);

  if (hasStrongCompatibilityPattern) {
    return {
      category: "COMPATIBLE_SYMPTOMS",
      severity: "MEDIUM",
      adviceLevel: "MEDICAL_EVALUATION",
      headline: "Sintomas compatíveis com dengue",
      summary:
        "O conjunto de sintomas informado é compatível com um quadro que merece avaliação profissional.",
      recommendation:
        "Busque avaliação em uma unidade de saúde, principalmente se os sintomas persistirem, piorarem ou surgirem sinais de alerta.",
      warningSignsDetected,
      compatibleSymptomsDetected,
      score: {
        compatibilityScore,
        warningSignScore,
      },
      disclaimer: disclaimerText,
    };
  }

  return {
    category: "LOW_COMPATIBILITY",
    severity: "LOW",
    adviceLevel: "SELF_MONITORING",
    headline: "Poucos sinais compatíveis no momento",
    summary:
      "Os sintomas informados não formam um padrão forte neste checador educativo.",
    recommendation:
      "Continue observando a evolução dos sintomas e procure avaliação se houver piora, persistência ou aparecimento de sinais de alerta.",
    warningSignsDetected,
    compatibleSymptomsDetected,
    score: {
      compatibilityScore,
      warningSignScore,
    },
    disclaimer: disclaimerText,
  };
}
