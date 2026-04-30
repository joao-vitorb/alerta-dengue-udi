import { apiClient } from "../lib/apiClient";
import type {
  HealthCareLevel,
  HealthUnitsResponse,
  RecommendedHealthUnitsResponse,
} from "../types/healthUnit";

type RecommendedHealthUnitsInput = {
  neighborhood?: string;
  careLevel?: HealthCareLevel;
  latitude?: number;
  longitude?: number;
  limit?: number;
};

export function listHealthUnits() {
  return apiClient.get<HealthUnitsResponse>("/health-units");
}

export function listRecommendedHealthUnits(input: RecommendedHealthUnitsInput) {
  return apiClient.get<RecommendedHealthUnitsResponse>(
    "/health-units/recommended",
    { query: input },
  );
}
