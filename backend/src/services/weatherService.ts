import type { Prisma } from "../generated/prisma/client";
import { AppError } from "../errors/AppError";
import {
  getNeighborhoodWeatherCoordinate,
  listSupportedWeatherNeighborhoods,
} from "../data/neighborhoodWeatherCoordinates";
import { prisma } from "../lib/prisma";
import { fetchOpenMeteoForecast } from "./openMeteoService";

function getNumberAtIndex(
  values: Array<number | null> | undefined,
  index: number,
): number | null {
  if (!values || index < 0 || index >= values.length) {
    return null;
  }

  return values[index] ?? null;
}

function sumNumbers(values: Array<number | null>): number {
  return values.reduce<number>((total, value) => total + (value ?? 0), 0);
}

function buildSignals(input: {
  todayProbability: number | null;
  todayPrecipitation: number | null;
  pastThreeDaysPrecipitation: number;
  currentTemperature: number | null;
  currentRelativeHumidity: number | null;
}) {
  const rainExpectedToday =
    (input.todayProbability ?? 0) >= 50 || (input.todayPrecipitation ?? 0) >= 5;

  const recentRainDetected = input.pastThreeDaysPrecipitation >= 8;

  const warmAndHumidNow =
    (input.currentTemperature ?? 0) >= 27 &&
    (input.currentRelativeHumidity ?? 0) >= 70;

  const stagnantWaterFavorable =
    rainExpectedToday || recentRainDetected || warmAndHumidNow;

  const preventionWindowScore = [
    rainExpectedToday,
    recentRainDetected,
    warmAndHumidNow,
    stagnantWaterFavorable,
  ].filter(Boolean).length;

  return {
    rainExpectedToday,
    recentRainDetected,
    warmAndHumidNow,
    stagnantWaterFavorable,
    preventionWindowScore,
  };
}

function mapSnapshotToResponse(snapshot: {
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
  fetchedAt: Date;
}) {
  const signals = buildSignals({
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

export function getSupportedWeatherNeighborhoods() {
  const items = listSupportedWeatherNeighborhoods();

  return {
    items,
    total: items.length,
  };
}

export async function getWeatherPreventionContext(neighborhood: string) {
  const coordinate = getNeighborhoodWeatherCoordinate(neighborhood);

  if (!coordinate) {
    throw new AppError(
      "Neighborhood is not supported for weather context",
      404,
    );
  }

  const cacheThreshold = new Date(Date.now() - 30 * 60 * 1000);

  const cachedSnapshot = await prisma.weatherSnapshot.findFirst({
    where: {
      neighborhood: coordinate.name,
      fetchedAt: {
        gte: cacheThreshold,
      },
    },
    orderBy: {
      fetchedAt: "desc",
    },
  });

  if (cachedSnapshot) {
    return mapSnapshotToResponse(cachedSnapshot);
  }

  const weatherData = await fetchOpenMeteoForecast(
    coordinate.latitude,
    coordinate.longitude,
  );

  if (!weatherData.daily || !weatherData.current) {
    throw new AppError("Weather provider returned an invalid payload", 502);
  }

  const daily = weatherData.daily;
  const current = weatherData.current;

  const todayDate = current.time.slice(0, 10);
  const todayIndex = daily.time.findIndex((item) => item === todayDate);

  if (todayIndex === -1) {
    throw new AppError(
      "Weather provider returned inconsistent daily data",
      502,
    );
  }

  const pastSliceStart = Math.max(0, todayIndex - 3);
  const pastThreeDaysPrecipitationSum = sumNumbers(
    (daily.precipitation_sum ?? []).slice(pastSliceStart, todayIndex),
  );

  const todayPrecipitationProbabilityMax = getNumberAtIndex(
    daily.precipitation_probability_max,
    todayIndex,
  );

  const todayPrecipitationSum = getNumberAtIndex(
    daily.precipitation_sum,
    todayIndex,
  );

  const todayTemperatureMax = getNumberAtIndex(
    daily.temperature_2m_max,
    todayIndex,
  );

  const todayTemperatureMin = getNumberAtIndex(
    daily.temperature_2m_min,
    todayIndex,
  );

  const tomorrowPrecipitationProbabilityMax = getNumberAtIndex(
    daily.precipitation_probability_max,
    todayIndex + 1,
  );

  const tomorrowPrecipitationSum = getNumberAtIndex(
    daily.precipitation_sum,
    todayIndex + 1,
  );

  const signals = buildSignals({
    todayProbability: todayPrecipitationProbabilityMax,
    todayPrecipitation: todayPrecipitationSum,
    pastThreeDaysPrecipitation: pastThreeDaysPrecipitationSum,
    currentTemperature: current.temperature_2m ?? null,
    currentRelativeHumidity: current.relative_humidity_2m ?? null,
  });

  const createdSnapshot = await prisma.weatherSnapshot.create({
    data: {
      neighborhood: coordinate.name,
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      source: "OPEN_METEO",
      currentTemperature: current.temperature_2m ?? null,
      currentRain: current.rain ?? null,
      currentRelativeHumidity: current.relative_humidity_2m ?? null,
      currentWeatherCode: current.weather_code ?? null,
      todayPrecipitationProbabilityMax,
      todayPrecipitationSum,
      todayTemperatureMax,
      todayTemperatureMin,
      tomorrowPrecipitationProbabilityMax,
      tomorrowPrecipitationSum,
      pastThreeDaysPrecipitationSum,
      preventionWindowScore: signals.preventionWindowScore,
      rawPayload: weatherData as Prisma.InputJsonValue,
    },
  });

  return mapSnapshotToResponse(createdSnapshot);
}
