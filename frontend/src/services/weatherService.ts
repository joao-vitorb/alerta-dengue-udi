import { env } from "../config/env";
import { ApiError } from "../errors/ApiError";
import type { WeatherContextResponse } from "../types/weather";

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

export async function getWeatherContext(neighborhood: string) {
  const query = new URLSearchParams({
    neighborhood,
  });

  const response = await fetch(
    `${apiBaseUrl}/weather/prevention-context?${query.toString()}`,
  );

  return parseResponse<WeatherContextResponse>(response);
}
