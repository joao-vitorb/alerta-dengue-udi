import { generatedNeighborhoodWeatherCoordinates } from "./generatedNeighborhoodWeatherCoordinates";

type NeighborhoodWeatherCoordinate = {
  name: string;
  latitude: number;
  longitude: number;
};

function normalizeNeighborhoodName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

const aliases: Record<string, string> = {
  roosevelt: "roosevelt",
  "presidente roosevelt": "roosevelt",
};

const coordinatesMap = new Map<string, NeighborhoodWeatherCoordinate>(
  generatedNeighborhoodWeatherCoordinates.map((item) => [
    normalizeNeighborhoodName(item.name),
    {
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
    },
  ]),
);

export function getNeighborhoodWeatherCoordinate(name?: string) {
  if (!name) {
    return null;
  }

  const normalizedName = normalizeNeighborhoodName(name);
  const canonicalName = aliases[normalizedName] ?? normalizedName;

  return coordinatesMap.get(canonicalName) ?? null;
}

export function listSupportedWeatherNeighborhoods() {
  return generatedNeighborhoodWeatherCoordinates.map((item) => item.name);
}
