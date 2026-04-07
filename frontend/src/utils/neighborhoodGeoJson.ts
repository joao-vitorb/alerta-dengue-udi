import type {
  NeighborhoodGeoJsonFeature,
  NeighborhoodGeoJsonFeatureCollection,
} from "../types/neighborhoodGeoJson";

type LeafletPosition = [number, number];

function normalizeNeighborhoodName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export function getNeighborhoodFeatureName(
  feature: NeighborhoodGeoJsonFeature,
) {
  const properties = feature.properties as Record<string, unknown>;

  const possibleName =
    (properties.name as string | undefined) ??
    (properties.Name as string | undefined) ??
    (properties.nome as string | undefined) ??
    (properties.NOME as string | undefined) ??
    (properties.bairro as string | undefined) ??
    (properties.BAIRRO as string | undefined) ??
    (properties.NOME_BAIRRO as string | undefined) ??
    (properties.NM_BAIRRO as string | undefined) ??
    (properties.bairro_nome as string | undefined) ??
    (properties.layer as string | undefined) ??
    (properties.Layer as string | undefined) ??
    (properties.text as string | undefined) ??
    "";

  return typeof possibleName === "string" ? possibleName : "";
}

export function findNeighborhoodFeature(
  collection: NeighborhoodGeoJsonFeatureCollection | null,
  neighborhoodName?: string,
) {
  if (!collection || !neighborhoodName) {
    return null;
  }

  const aliases: Record<string, string[]> = {
    roosevelt: ["roosevelt", "presidente roosevelt"],
  };

  const normalizedSelectedName = normalizeNeighborhoodName(neighborhoodName);

  const acceptedNames = new Set([
    normalizedSelectedName,
    ...(aliases[normalizedSelectedName] ?? []),
  ]);

  return (
    collection.features.find((feature) => {
      const featureName = normalizeNeighborhoodName(
        getNeighborhoodFeatureName(feature),
      );

      return acceptedNames.has(featureName);
    }) ?? null
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
