import { AppError } from "../errors/AppError";
import { env } from "../config/env";

type OpenMeteoForecastResponse = {
  latitude: number;
  longitude: number;
  timezone: string;
  current?: {
    time: string;
    temperature_2m?: number;
    rain?: number;
    relative_humidity_2m?: number;
    weather_code?: number;
  };
  daily?: {
    time: string[];
    temperature_2m_max?: Array<number | null>;
    temperature_2m_min?: Array<number | null>;
    precipitation_sum?: Array<number | null>;
    precipitation_probability_max?: Array<number | null>;
  };
};

export async function fetchOpenMeteoForecast(
  latitude: number,
  longitude: number,
) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: "temperature_2m,rain,relative_humidity_2m,weather_code",
    daily:
      "temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max",
    timezone: env.weatherTimezone,
    forecast_days: "3",
    past_days: "3",
  });

  const response = await fetch(
    `${env.weatherApiBaseUrl}/forecast?${params.toString()}`,
  );

  if (!response.ok) {
    throw new AppError("Weather provider request failed", 502);
  }

  const data = (await response.json()) as OpenMeteoForecastResponse;

  if (!data.daily || !data.current || !Array.isArray(data.daily.time)) {
    throw new AppError("Weather provider returned an invalid payload", 502);
  }

  return data;
}
