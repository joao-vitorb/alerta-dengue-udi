import { apiClient } from "../lib/apiClient";
import type {
  SymptomCheckerPayload,
  SymptomCheckerResponse,
} from "../types/symptomChecker";

const SYMPTOM_KEYS: Array<keyof SymptomCheckerPayload> = [
  "fever",
  "headache",
  "painBehindEyes",
  "bodyAches",
  "jointPain",
  "nausea",
  "vomiting",
  "rash",
  "fatigue",
  "abdominalPain",
  "persistentVomiting",
  "bleedingSigns",
  "drowsiness",
  "dehydrationSigns",
];

function normalizePayload(
  payload: SymptomCheckerPayload,
): SymptomCheckerPayload {
  return SYMPTOM_KEYS.reduce((normalized, key) => {
    normalized[key] = Boolean(payload[key]);
    return normalized;
  }, {} as SymptomCheckerPayload);
}

export function checkSymptoms(payload: SymptomCheckerPayload) {
  return apiClient.post<SymptomCheckerResponse>(
    "/symptom-checker",
    normalizePayload(payload),
  );
}
