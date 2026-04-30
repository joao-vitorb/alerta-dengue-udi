import { apiClient } from "../lib/apiClient";
import type { WeatherContextResponse } from "../types/weather";

export function getWeatherContext(neighborhood: string) {
  return apiClient.get<WeatherContextResponse>("/weather/prevention-context", {
    query: { neighborhood },
  });
}
