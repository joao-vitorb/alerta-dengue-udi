export type NeighborhoodGeoJsonProperties = {
  name?: string;
  NOME?: string;
  bairro?: string;
  BAIRRO?: string;
  [key: string]: unknown;
};

export type NeighborhoodGeoJsonPolygonGeometry = {
  type: "Polygon";
  coordinates: number[][][];
};

export type NeighborhoodGeoJsonMultiPolygonGeometry = {
  type: "MultiPolygon";
  coordinates: number[][][][];
};

export type NeighborhoodGeoJsonFeature = {
  type: "Feature";
  properties: NeighborhoodGeoJsonProperties;
  geometry:
    | NeighborhoodGeoJsonPolygonGeometry
    | NeighborhoodGeoJsonMultiPolygonGeometry;
};

export type NeighborhoodGeoJsonFeatureCollection = {
  type: "FeatureCollection";
  features: NeighborhoodGeoJsonFeature[];
};
