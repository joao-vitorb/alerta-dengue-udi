import { env } from "../config/env";
import { ApiError } from "../errors/ApiError";
import type { PreventiveAlertsResponse } from "../types/preventiveAlert";

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

export async function getPreventiveAlerts(neighborhood: string) {
  const query = new URLSearchParams({
    neighborhood,
  });

  const response = await fetch(
    `${apiBaseUrl}/preventive-alerts?${query.toString()}`,
  );

  return parseResponse<PreventiveAlertsResponse>(response);
}
