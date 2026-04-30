import type {
  NeighborhoodGeoJsonFeature,
  NeighborhoodGeoJsonFeatureCollection,
} from "../types/neighborhoodGeoJson";

type LeafletPosition = [number, number];

const NAME_PROPERTY_KEYS = [
  "name",
  "Name",
  "nome",
  "NOME",
  "bairro",
  "BAIRRO",
  "NOME_BAIRRO",
  "NM_BAIRRO",
  "bairro_nome",
  "layer",
  "Layer",
  "text",
] as const;

const NEIGHBORHOOD_NAME_ALIASES: Record<string, string[]> = {
  roosevelt: ["roosevelt", "presidente roosevelt"],
};

function normalizeNeighborhoodName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function getNeighborhoodFeatureName(feature: NeighborhoodGeoJsonFeature) {
  const properties = feature.properties as Record<string, unknown>;

  for (const key of NAME_PROPERTY_KEYS) {
    const value = properties[key];
    if (typeof value === "string" && value.length > 0) {
      return value;
    }
  }

  return "";
}

export function findNeighborhoodFeature(
  collection: NeighborhoodGeoJsonFeatureCollection | null,
  neighborhoodName?: string,
) {
  if (!collection || !neighborhoodName) {
    return null;
  }

  const normalizedSelectedName = normalizeNeighborhoodName(neighborhoodName);

  const acceptedNames = new Set([
    normalizedSelectedName,
    ...(NEIGHBORHOOD_NAME_ALIASES[normalizedSelectedName] ?? []),
  ]);

  return (
    collection.features.find((feature) =>
      acceptedNames.has(
        normalizeNeighborhoodName(getNeighborhoodFeatureName(feature)),
      ),
    ) ?? null
  );
}

function convertRingToLeafletPositions(ring: number[][]): LeafletPosition[] {
  return ring.map((position) => [position[1], position[0]]);
}

export function getFeaturePolygonSets(
  feature: NeighborhoodGeoJsonFeature | null,
): LeafletPosition[][] {
  if (!feature) {
    return [];
  }

  if (feature.geometry.type === "Polygon") {
    return feature.geometry.coordinates.length > 0
      ? [convertRingToLeafletPositions(feature.geometry.coordinates[0])]
      : [];
  }

  return feature.geometry.coordinates
    .filter((polygon) => polygon.length > 0)
    .map((polygon) => convertRingToLeafletPositions(polygon[0]));
}

export function getFeatureBoundsPositions(
  feature: NeighborhoodGeoJsonFeature | null,
) {
  return getFeaturePolygonSets(feature).flat();
}
