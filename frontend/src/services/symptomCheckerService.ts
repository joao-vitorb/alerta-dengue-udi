import { env } from "../config/env";
import { ApiError } from "../errors/ApiError";
import type {
  SymptomCheckerPayload,
  SymptomCheckerResponse,
} from "../types/symptomChecker";

const apiBaseUrl = `${env.apiUrl}/api`;

async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      data?.message ?? "Request failed",
      response.status,
      data?.details ?? null,
    );
  }

  return data as T;
}

function normalizePayload(
  payload: SymptomCheckerPayload,
): SymptomCheckerPayload {
  return {
    fever: Boolean(payload.fever),
    headache: Boolean(payload.headache),
    painBehindEyes: Boolean(payload.painBehindEyes),
    bodyAches: Boolean(payload.bodyAches),
    jointPain: Boolean(payload.jointPain),
    nausea: Boolean(payload.nausea),
    vomiting: Boolean(payload.vomiting),
    rash: Boolean(payload.rash),
    fatigue: Boolean(payload.fatigue),
    abdominalPain: Boolean(payload.abdominalPain),
    persistentVomiting: Boolean(payload.persistentVomiting),
    bleedingSigns: Boolean(payload.bleedingSigns),
    drowsiness: Boolean(payload.drowsiness),
    dehydrationSigns: Boolean(payload.dehydrationSigns),
  };
}

export async function checkSymptoms(payload: SymptomCheckerPayload) {
  const response = await fetch(`${apiBaseUrl}/symptom-checker`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(normalizePayload(payload)),
  });

  return parseResponse<SymptomCheckerResponse>(response);
}
