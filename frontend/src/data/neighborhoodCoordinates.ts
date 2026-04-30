import type { LatLngBoundsExpression, LatLngTuple } from "leaflet";

type NeighborhoodCoordinate = {
  name: string;
  position: LatLngTuple;
};

export const uberlandiaCenter: LatLngTuple = [-18.9186, -48.2772];

export const uberlandiaBounds: LatLngBoundsExpression = [
  [-19.05, -48.45],
  [-18.78, -48.12],
];

const neighborhoodCoordinates: NeighborhoodCoordinate[] = [
  {
    name: "Tibery",
    position: [-18.8892, -48.2508],
  },
  {
    name: "Santa Mônica",
    position: [-18.9115, -48.2554],
  },
  {
    name: "Martins",
    position: [-18.9162, -48.2867],
  },
  {
    name: "Morumbi",
    position: [-18.9566, -48.2417],
  },
  {
    name: "Luizote de Freitas",
    position: [-18.9088, -48.3148],
  },
  {
    name: "Centro",
    position: [-18.9143, -48.2759],
  },
  {
    name: "Patrimônio",
    position: [-18.9341, -48.2846],
  },
  {
    name: "Roosevelt",
    position: [-18.8917, -48.2965],
  },
  {
    name: "Custódio Pereira",
    position: [-18.8894, -48.2353],
  },
  {
    name: "Brasil",
    position: [-18.9091, -48.2664],
  },
  {
    name: "Bom Jesus",
    position: [-18.9072, -48.2745],
  },
  {
    name: "Planalto",
    position: [-18.9071, -48.3312],
  },
  {
    name: "Dona Zulmira",
    position: [-18.9085, -48.3041],
  },
];

function normalizeNeighborhoodName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export function getNeighborhoodCoordinate(name?: string) {
  if (!name) {
    return null;
  }

  const normalizedName = normalizeNeighborhoodName(name);

  return (
    neighborhoodCoordinates.find(
      (item) => normalizeNeighborhoodName(item.name) === normalizedName,
    ) ?? null
  );
}
