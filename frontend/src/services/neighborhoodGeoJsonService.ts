import type { NeighborhoodGeoJsonFeatureCollection } from "../types/neighborhoodGeoJson";

const GEOJSON_PATH = "/data/uberlandia-neighborhoods.geojson";

export async function loadNeighborhoodGeoJson() {
  const response = await fetch(GEOJSON_PATH);

  if (!response.ok) {
    throw new Error("Não foi possível carregar o GeoJSON dos bairros.");
  }

  const data = (await response.json()) as NeighborhoodGeoJsonFeatureCollection;

  if (data.type !== "FeatureCollection" || !Array.isArray(data.features)) {
    throw new Error("O arquivo GeoJSON dos bairros está inválido.");
  }

  return data;
}
