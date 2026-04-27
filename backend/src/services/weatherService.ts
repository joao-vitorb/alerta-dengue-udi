import type { Prisma } from "../generated/prisma/client";
import {
  getNeighborhoodWeatherCoordinate,
  listSupportedWeatherNeighborhoods,
} from "../data/neighborhoodWeatherCoordinates";
import { AppError } from "../errors/AppError";
import { prisma } from "../lib/prisma";
import { fetchOpenMeteoForecast } from "./openMeteoService";
import { buildWeatherSignals } from "./weatherSignals";
import {
  extractCurrentWindSpeedKmh,
  mapWeatherSnapshotToResponse,
  type WeatherContextResponse,
} from "./weatherSnapshotMapper";

const SNAPSHOT_CACHE_DURATION_MS = 30 * 60 * 1000;
const WEATHER_SOURCE = "OPEN_METEO";

type Coordinate = {
  name: string;
  latitude: number;
  longitude: number;
};

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

async function findFreshSnapshot(neighborhoodName: string) {
  const cacheThreshold = new Date(Date.now() - SNAPSHOT_CACHE_DURATION_MS);

  return prisma.weatherSnapshot.findFirst({
    where: {
      neighborhood: neighborhoodName,
      fetchedAt: { gte: cacheThreshold },
    },
    orderBy: { fetchedAt: "desc" },
  });
}

async function buildSnapshotFromForecast(coordinate: Coordinate) {
  const weatherData = await fetchOpenMeteoForecast(
    coordinate.latitude,
    coordinate.longitude,
  );

  if (!weatherData.daily || !weatherData.current) {
    throw new AppError("Weather provider returned an invalid payload", 502);
  }

  const { daily, current } = weatherData;
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

  const signals = buildWeatherSignals({
    todayProbability: todayPrecipitationProbabilityMax,
    todayPrecipitation: todayPrecipitationSum,
    pastThreeDaysPrecipitation: pastThreeDaysPrecipitationSum,
    currentTemperature: current.temperature_2m ?? null,
    currentRelativeHumidity: current.relative_humidity_2m ?? null,
  });

  return prisma.weatherSnapshot.create({
    data: {
      neighborhood: coordinate.name,
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      source: WEATHER_SOURCE,
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
}

export function getSupportedWeatherNeighborhoods() {
  const items = listSupportedWeatherNeighborhoods();

  return {
    items,
    total: items.length,
  };
}

export async function getWeatherPreventionContext(
  neighborhood: string,
): Promise<WeatherContextResponse> {
  const coordinate = getNeighborhoodWeatherCoordinate(neighborhood);

  if (!coordinate) {
    throw new AppError(
      "Neighborhood is not supported for weather context",
      404,
    );
  }

  const cachedSnapshot = await findFreshSnapshot(coordinate.name);

  if (
    cachedSnapshot &&
    extractCurrentWindSpeedKmh(cachedSnapshot.rawPayload) !== null
  ) {
    return mapWeatherSnapshotToResponse(cachedSnapshot);
  }

  const freshSnapshot = await buildSnapshotFromForecast(coordinate);

  return mapWeatherSnapshotToResponse(freshSnapshot);
}
