import { env } from "../config/env";
import { AppError } from "../errors/AppError";

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
    wind_speed_10m?: number;
  };
  daily?: {
    time: string[];
    temperature_2m_max?: Array<number | null>;
    temperature_2m_min?: Array<number | null>;
    precipitation_sum?: Array<number | null>;
    precipitation_probability_max?: Array<number | null>;
  };
};

const FORECAST_DAYS = 3;
const PAST_DAYS = 3;

export async function fetchOpenMeteoForecast(
  latitude: number,
  longitude: number,
) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current:
      "temperature_2m,rain,relative_humidity_2m,weather_code,wind_speed_10m",
    daily:
      "temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max",
    timezone: env.weather.timezone,
    forecast_days: String(FORECAST_DAYS),
    past_days: String(PAST_DAYS),
  });

  const response = await fetch(
    `${env.weather.apiBaseUrl}/forecast?${params.toString()}`,
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
