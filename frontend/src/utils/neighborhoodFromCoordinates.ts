import type {
  NeighborhoodGeoJsonFeature,
  NeighborhoodGeoJsonFeatureCollection,
} from "../types/neighborhoodGeoJson";

type GeoCoordinate = {
  latitude: number;
  longitude: number;
};

type RingPoint = [number, number];

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
] as const;

export function detectNeighborhoodFromCoordinates(
  coordinate: GeoCoordinate,
  geojson: NeighborhoodGeoJsonFeatureCollection | null,
): string | null {
  if (!geojson) return null;

  const point: RingPoint = [coordinate.longitude, coordinate.latitude];

  for (const feature of geojson.features) {
    if (!isPointInsideFeature(point, feature)) continue;

    const name = extractFeatureName(feature);
    if (name) return name;
  }

  return null;
}

function isPointInsideFeature(
  point: RingPoint,
  feature: NeighborhoodGeoJsonFeature,
): boolean {
  if (feature.geometry.type === "Polygon") {
    return isPointInsidePolygon(point, feature.geometry.coordinates);
  }

  return feature.geometry.coordinates.some((polygon) =>
    isPointInsidePolygon(point, polygon),
  );
}

function isPointInsidePolygon(
  point: RingPoint,
  polygonRings: number[][][],
): boolean {
  if (polygonRings.length === 0) return false;

  const [outerRing, ...holes] = polygonRings;

  if (!isPointInsideRing(point, outerRing as RingPoint[])) return false;

  return !holes.some((hole) => isPointInsideRing(point, hole as RingPoint[]));
}

function isPointInsideRing(point: RingPoint, ring: RingPoint[]): boolean {
  const [x, y] = point;
  let isInside = false;

  for (let current = 0, previous = ring.length - 1; current < ring.length; previous = current, current += 1) {
    const [xi, yi] = ring[current];
    const [xj, yj] = ring[previous];

    const intersectsRay =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    if (intersectsRay) {
      isInside = !isInside;
    }
  }

  return isInside;
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
