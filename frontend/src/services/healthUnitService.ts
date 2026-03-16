import { env } from "../config/env";
import { ApiError } from "../errors/ApiError";
import type {
  HealthCareLevel,
  HealthUnitsResponse,
  RecommendedHealthUnitsResponse,
} from "../types/healthUnit";

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

export async function listHealthUnits() {
  const response = await fetch(`${apiBaseUrl}/health-units`);

  return parseResponse<HealthUnitsResponse>(response);
}

export async function listRecommendedHealthUnits(input: {
  neighborhood?: string;
  careLevel?: HealthCareLevel;
  latitude?: number;
  longitude?: number;
  limit?: number;
}) {
  const query = new URLSearchParams();

  if (input.neighborhood) {
    query.set("neighborhood", input.neighborhood);
  }

  if (input.careLevel) {
    query.set("careLevel", input.careLevel);
  }

  if (input.latitude !== undefined) {
    query.set("latitude", String(input.latitude));
  }

  if (input.longitude !== undefined) {
    query.set("longitude", String(input.longitude));
  }

  if (input.limit !== undefined) {
    query.set("limit", String(input.limit));
  }

  const response = await fetch(
    `${apiBaseUrl}/health-units/recommended?${query.toString()}`,
  );

  return parseResponse<RecommendedHealthUnitsResponse>(response);
}
