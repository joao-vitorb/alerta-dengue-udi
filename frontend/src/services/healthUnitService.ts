import { env } from "../config/env";
import { ApiError } from "../errors/ApiError";
import type { HealthUnitsResponse } from "../types/healthUnit";

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
