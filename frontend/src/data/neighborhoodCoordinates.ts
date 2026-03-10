import type { LatLngBoundsExpression, LatLngExpression } from "leaflet";

export type NeighborhoodCoordinate = {
  name: string;
  position: LatLngExpression;
};

export const uberlandiaCenter: LatLngExpression = [-18.9186, -48.2772];

export const uberlandiaBounds: LatLngBoundsExpression = [
  [-19.05, -48.4],
  [-18.82, -48.14],
];

export const neighborhoodCoordinates: NeighborhoodCoordinate[] = [
  {
    name: "Centro",
    position: [-18.9143, -48.2743],
  },
  {
    name: "Tibery",
    position: [-18.8892, -48.2508],
  },
  {
    name: "Santa Mônica",
    position: [-18.9182, -48.245],
  },
  {
    name: "Patrimônio",
    position: [-18.9308, -48.285],
  },
  {
    name: "Luizote",
    position: [-18.906, -48.317],
  },
  {
    name: "Martins",
    position: [-18.9125, -48.288],
  },
  {
    name: "Morumbi",
    position: [-18.952, -48.244],
  },
  {
    name: "Roosevelt",
    position: [-18.887, -48.3],
  },
];

export function getNeighborhoodCoordinate(name?: string) {
  if (!name) {
    return null;
  }

  return neighborhoodCoordinates.find((item) => item.name === name) ?? null;
}
