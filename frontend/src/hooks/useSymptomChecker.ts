import { useMemo, useState } from "react";
import { checkSymptoms } from "../services/symptomCheckerService";
import type {
  SymptomCheckerPayload,
  SymptomCheckerResponse,
} from "../types/symptomChecker";

function createInitialPayload(): SymptomCheckerPayload {
  return {
    fever: false,
    headache: false,
    painBehindEyes: false,
    bodyAches: false,
    jointPain: false,
    nausea: false,
    vomiting: false,
    rash: false,
    fatigue: false,
    abdominalPain: false,
    persistentVomiting: false,
    bleedingSigns: false,
    drowsiness: false,
    dehydrationSigns: false,
  };
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Não foi possível analisar os sintomas agora.";
}

export function useSymptomChecker() {
  const [payload, setPayload] = useState<SymptomCheckerPayload>(
    createInitialPayload(),
  );
  const [result, setResult] = useState<SymptomCheckerResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedSymptomsCount = useMemo(() => {
    return Object.values(payload).filter(Boolean).length;
  }, [payload]);

  function setSymptomValue(key: keyof SymptomCheckerPayload, value: boolean) {
    setPayload((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function submit() {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await checkSymptoms(payload);
      setResult(response);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
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
