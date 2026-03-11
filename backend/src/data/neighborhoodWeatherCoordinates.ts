export type NeighborhoodWeatherCoordinate = {
  name: string;
  latitude: number;
  longitude: number;
};

const supportedNeighborhoods: NeighborhoodWeatherCoordinate[] = [
  {
    name: "Centro",
    latitude: -18.9143,
    longitude: -48.2743,
  },
  {
    name: "Tibery",
    latitude: -18.8892,
    longitude: -48.2508,
  },
  {
    name: "Santa Mônica",
    latitude: -18.9182,
    longitude: -48.245,
  },
  {
    name: "Patrimônio",
    latitude: -18.9308,
    longitude: -48.285,
  },
  {
    name: "Luizote",
    latitude: -18.906,
    longitude: -48.317,
  },
  {
    name: "Martins",
    latitude: -18.9125,
    longitude: -48.288,
  },
  {
    name: "Morumbi",
    latitude: -18.952,
    longitude: -48.244,
  },
  {
    name: "Roosevelt",
    latitude: -18.887,
    longitude: -48.3,
  },
];

function normalizeNeighborhoodName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export function listSupportedWeatherNeighborhoods() {
  return supportedNeighborhoods;
}

export function getNeighborhoodWeatherCoordinate(name: string) {
  const normalizedName = normalizeNeighborhoodName(name);

  return (
    supportedNeighborhoods.find(
      (item) => normalizeNeighborhoodName(item.name) === normalizedName,
    ) ?? null
  );
}
