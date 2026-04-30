import { useMemo, useState } from "react";
import { checkSymptoms } from "../services/symptomCheckerService";
import type {
  SymptomCheckerPayload,
  SymptomCheckerResponse,
} from "../types/symptomChecker";
import { getErrorMessage } from "../utils/errorMessage";

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

const FALLBACK_ERROR_MESSAGE = "Não foi possível analisar os sintomas agora.";

function createInitialPayload(): SymptomCheckerPayload {
  return SYMPTOM_KEYS.reduce((payload, key) => {
    payload[key] = false;
    return payload;
  }, {} as SymptomCheckerPayload);
}

export function useSymptomChecker() {
  const [payload, setPayload] = useState<SymptomCheckerPayload>(
    createInitialPayload(),
  );
  const [result, setResult] = useState<SymptomCheckerResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedSymptomsCount = useMemo(
    () => Object.values(payload).filter(Boolean).length,
    [payload],
  );

  function setSymptomValue(key: keyof SymptomCheckerPayload, value: boolean) {
    setPayload((current) => ({ ...current, [key]: value }));
  }

  async function submit() {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await checkSymptoms(payload);
      setResult(response);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, FALLBACK_ERROR_MESSAGE));
      setResult(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  function reset() {
    setPayload(createInitialPayload());
    setResult(null);
    setErrorMessage(null);
  }

  return {
    payload,
    result,
    isSubmitting,
    errorMessage,
    selectedSymptomsCount,
    setSymptomValue,
    submit,
    reset,
  };
}
