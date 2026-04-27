import { buildWeatherSignals } from "./weatherSignals";

type WeatherSnapshotRecord = {
  neighborhood: string;
  latitude: number;
  longitude: number;
  source: string;
  currentTemperature: number | null;
  currentRain: number | null;
  currentRelativeHumidity: number | null;
  currentWeatherCode: number | null;
  todayPrecipitationProbabilityMax: number | null;
  todayPrecipitationSum: number | null;
  todayTemperatureMax: number | null;
  todayTemperatureMin: number | null;
  tomorrowPrecipitationProbabilityMax: number | null;
  tomorrowPrecipitationSum: number | null;
  pastThreeDaysPrecipitationSum: number;
  preventionWindowScore: number;
  rawPayload: unknown;
  fetchedAt: Date;
};

export function extractCurrentWindSpeedKmh(rawPayload: unknown): number | null {
  if (!rawPayload || typeof rawPayload !== "object") {
    return null;
  }

  const current = (rawPayload as { current?: unknown }).current;

  if (!current || typeof current !== "object") {
    return null;
  }

  const windSpeed = (current as { wind_speed_10m?: unknown }).wind_speed_10m;

  return typeof windSpeed === "number" ? windSpeed : null;
}

export function mapWeatherSnapshotToResponse(snapshot: WeatherSnapshotRecord) {
  const signals = buildWeatherSignals({
    todayProbability: snapshot.todayPrecipitationProbabilityMax,
    todayPrecipitation: snapshot.todayPrecipitationSum,
    pastThreeDaysPrecipitation: snapshot.pastThreeDaysPrecipitationSum,
    currentTemperature: snapshot.currentTemperature,
    currentRelativeHumidity: snapshot.currentRelativeHumidity,
  });

  return {
    neighborhood: snapshot.neighborhood,
    coordinates: {
      latitude: snapshot.latitude,
      longitude: snapshot.longitude,
    },
    source: snapshot.source,
    fetchedAt: snapshot.fetchedAt.toISOString(),
    current: {
      temperatureC: snapshot.currentTemperature,
      rainMm: snapshot.currentRain,
      relativeHumidity: snapshot.currentRelativeHumidity,
      weatherCode: snapshot.currentWeatherCode,
      windSpeedKmh: extractCurrentWindSpeedKmh(snapshot.rawPayload),
    },
    today: {
      precipitationProbabilityMax: snapshot.todayPrecipitationProbabilityMax,
      precipitationSumMm: snapshot.todayPrecipitationSum,
      temperatureMaxC: snapshot.todayTemperatureMax,
      temperatureMinC: snapshot.todayTemperatureMin,
    },
    tomorrow: {
      precipitationProbabilityMax: snapshot.tomorrowPrecipitationProbabilityMax,
      precipitationSumMm: snapshot.tomorrowPrecipitationSum,
    },
    recent: {
      pastThreeDaysPrecipitationSumMm: snapshot.pastThreeDaysPrecipitationSum,
    },
    signals,
    preventionWindowScore: snapshot.preventionWindowScore,
  };
}

export type WeatherContextResponse = ReturnType<
  typeof mapWeatherSnapshotToResponse
>;
