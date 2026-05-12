import { neighborhoodOptions } from "../data/neighborhoodOptions";
import type {
  NeighborhoodGeoJsonFeature,
  NeighborhoodGeoJsonFeatureCollection,
} from "../types/neighborhoodGeoJson";
import {
  isPointInsidePolygon,
  squaredDistance,
  type Point,
} from "./pointInPolygon";

type GeoCoordinate = {
  latitude: number;
  longitude: number;
};

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

const RAW_NAME_ALIASES: Record<string, string> = {
  "presidente roosevelt": "Roosevelt",
};

export function detectNeighborhoodFromCoordinates(
  coordinate: GeoCoordinate,
  geojson: NeighborhoodGeoJsonFeatureCollection | null,
): string | null {
  if (!geojson) return null;

  const point: Point = [coordinate.longitude, coordinate.latitude];
  const matchingFeatures = findFeaturesContainingPoint(point, geojson.features);

  if (matchingFeatures.length === 0) return null;

  const closestFeature = pickFeatureClosestToPoint(matchingFeatures, point);
  const rawName = extractFeatureName(closestFeature);
  if (!rawName) return null;

  return matchKnownNeighborhoodName(rawName);
}

function findFeaturesContainingPoint(
  point: Point,
  features: NeighborhoodGeoJsonFeature[],
): NeighborhoodGeoJsonFeature[] {
  return features.filter((feature) => isPointInsideFeature(point, feature));
}

function isPointInsideFeature(
  point: Point,
  feature: NeighborhoodGeoJsonFeature,
): boolean {
  if (feature.geometry.type === "Polygon") {
    return isPointInsidePolygon(point, feature.geometry.coordinates);
  }

  return feature.geometry.coordinates.some((polygon) =>
    isPointInsidePolygon(point, polygon),
  );
}

function pickFeatureClosestToPoint(
  features: NeighborhoodGeoJsonFeature[],
  point: Point,
): NeighborhoodGeoJsonFeature {
  return features.reduce((closest, candidate) => {
    const closestDistance = squaredDistance(point, computeFeatureCentroid(closest));
    const candidateDistance = squaredDistance(point, computeFeatureCentroid(candidate));
    return candidateDistance < closestDistance ? candidate : closest;
  });
}

function computeFeatureCentroid(feature: NeighborhoodGeoJsonFeature): Point {
  const rings: number[][][] =
    feature.geometry.type === "Polygon"
      ? feature.geometry.coordinates
      : feature.geometry.coordinates.flat();

  let sumX = 0;
  let sumY = 0;
  let count = 0;

  for (const ring of rings) {
    for (const [x, y] of ring) {
      sumX += x;
      sumY += y;
      count += 1;
    }
  }

  if (count === 0) return [0, 0];

  return [sumX / count, sumY / count];
}

function extractFeatureName(feature: NeighborhoodGeoJsonFeature): string | null {
  const properties = feature.properties as Record<string, unknown>;

  for (const key of NAME_PROPERTY_KEYS) {
    const value = properties[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }

  return null;
}

function matchKnownNeighborhoodName(rawName: string): string | null {
  const normalizedRaw = normalizeNeighborhoodName(rawName);

  const aliasMatch = RAW_NAME_ALIASES[normalizedRaw];
  if (aliasMatch) return aliasMatch;

  return (
    neighborhoodOptions.find(
      (option) => normalizeNeighborhoodName(option) === normalizedRaw,
    ) ?? null
  );
}

function normalizeNeighborhoodName(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}
