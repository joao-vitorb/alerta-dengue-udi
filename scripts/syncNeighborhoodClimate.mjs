import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const geoJsonPath = path.resolve(
  __dirname,
  "../frontend/public/data/uberlandia-neighborhoods.geojson",
);

const outputPath = path.resolve(
  __dirname,
  "../backend/src/data/generatedNeighborhoodWeatherCoordinates.ts",
);

const labelOverrides = new Map([
  ["TIBERY", "Tibery"],
  ["SANTA MONICA", "Santa Mônica"],
  ["MARTINS", "Martins"],
  ["MORUMBI", "Morumbi"],
  ["LUIZOTE DE FREITAS", "Luizote de Freitas"],
  ["CENTRO", "Centro"],
  ["PATRIMONIO", "Patrimônio"],
  ["PRESIDENTE ROOSEVELT", "Roosevelt"],
  ["ROOSEVELT", "Roosevelt"],
  ["CUSTODIO PEREIRA", "Custódio Pereira"],
  ["BRASIL", "Brasil"],
  ["BOM JESUS", "Bom Jesus"],
  ["PLANALTO", "Planalto"],
  ["DONA ZULMIRA", "Dona Zulmira"],
]);

const smallWords = new Set(["da", "de", "do", "das", "dos", "e"]);

function normalizeSpacing(value) {
  return value.replace(/\s+/g, " ").trim();
}

function normalizeKey(value) {
  return normalizeSpacing(value)
    .toUpperCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function toTitleCase(value) {
  return normalizeSpacing(value)
    .toLowerCase()
    .split(" ")
    .map((word, index) => {
      if (index > 0 && smallWords.has(word)) {
        return word;
      }

      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

function getFeatureNeighborhoodName(feature) {
  if (!feature || typeof feature !== "object") {
    return "";
  }

  const properties =
    "properties" in feature &&
    feature.properties &&
    typeof feature.properties === "object"
      ? feature.properties
      : {};

  const candidate =
    properties.name ??
    properties.Name ??
    properties.nome ??
    properties.NOME ??
    properties.bairro ??
    properties.BAIRRO ??
    properties.NOME_BAIRRO ??
    properties.NM_BAIRRO ??
    properties.bairro_nome ??
    properties.text ??
    "";

  return typeof candidate === "string" ? candidate : "";
}

function normalizeNeighborhoodLabel(rawName) {
  const normalizedKey = normalizeKey(rawName);

  if (labelOverrides.has(normalizedKey)) {
    return labelOverrides.get(normalizedKey);
  }

  return toTitleCase(rawName);
}

function getPolygonArea(ring) {
  if (!Array.isArray(ring) || ring.length < 3) {
    return 0;
  }

  let area = 0;

  for (let index = 0; index < ring.length; index += 1) {
    const [lng1, lat1] = ring[index];
    const [lng2, lat2] = ring[(index + 1) % ring.length];

    area += lng1 * lat2 - lng2 * lat1;
  }

  return area / 2;
}

function getPolygonCentroid(ring) {
  if (!Array.isArray(ring) || ring.length < 3) {
    return null;
  }

  let centroidLng = 0;
  let centroidLat = 0;
  let factorSum = 0;

  for (let index = 0; index < ring.length; index += 1) {
    const [lng1, lat1] = ring[index];
    const [lng2, lat2] = ring[(index + 1) % ring.length];

    const factor = lng1 * lat2 - lng2 * lat1;

    centroidLng += (lng1 + lng2) * factor;
    centroidLat += (lat1 + lat2) * factor;
    factorSum += factor;
  }

  if (factorSum === 0) {
    return null;
  }

  return {
    longitude: centroidLng / (3 * factorSum),
    latitude: centroidLat / (3 * factorSum),
  };
}

function getFeatureMainRing(feature) {
  if (!feature?.geometry || typeof feature.geometry !== "object") {
    return null;
  }

  if (feature.geometry.type === "Polygon") {
    return Array.isArray(feature.geometry.coordinates?.[0])
      ? feature.geometry.coordinates[0]
      : null;
  }

  if (feature.geometry.type === "MultiPolygon") {
    const polygons = Array.isArray(feature.geometry.coordinates)
      ? feature.geometry.coordinates
      : [];

    let selectedRing = null;
    let selectedArea = 0;

    for (const polygon of polygons) {
      const ring = Array.isArray(polygon?.[0]) ? polygon[0] : null;

      if (!ring) {
        continue;
      }

      const area = Math.abs(getPolygonArea(ring));

      if (area > selectedArea) {
        selectedRing = ring;
        selectedArea = area;
      }
    }

    return selectedRing;
  }

  return null;
}

function buildWeatherCoordinates(features) {
  const uniqueItems = new Map();

  for (const feature of features) {
    const rawName = getFeatureNeighborhoodName(feature);

    if (!rawName) {
      continue;
    }

    const ring = getFeatureMainRing(feature);

    if (!ring) {
      continue;
    }

    const centroid = getPolygonCentroid(ring);

    if (!centroid) {
      continue;
    }

    const name = normalizeNeighborhoodLabel(rawName);
    const dedupeKey = normalizeKey(name);

    if (!uniqueItems.has(dedupeKey)) {
      uniqueItems.set(dedupeKey, {
        name,
        latitude: Number(centroid.latitude.toFixed(6)),
        longitude: Number(centroid.longitude.toFixed(6)),
      });
    }
  }

  return Array.from(uniqueItems.values()).sort((first, second) =>
    first.name.localeCompare(second.name, "pt-BR"),
  );
}

function buildOutputFileContent(items) {
  const itemsAsText = items
    .map(
      (item) => `  {
    name: "${item.name}",
    latitude: ${item.latitude},
    longitude: ${item.longitude},
  },`,
    )
    .join("\n");

  return `export const generatedNeighborhoodWeatherCoordinates = [
${itemsAsText}
] as const;
`;
}

async function main() {
  const rawFile = await readFile(geoJsonPath, "utf-8");
  const parsedFile = JSON.parse(rawFile);

  if (
    !parsedFile ||
    parsedFile.type !== "FeatureCollection" ||
    !Array.isArray(parsedFile.features)
  ) {
    throw new Error("O arquivo de bairros não é um GeoJSON válido.");
  }

  const items = buildWeatherCoordinates(parsedFile.features);

  if (items.length === 0) {
    throw new Error("Nenhuma coordenada de bairro foi gerada.");
  }

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, buildOutputFileContent(items), "utf-8");

  console.log(
    `Arquivo gerado com sucesso em ${outputPath} com ${items.length} bairros.`,
  );
}

main().catch((error) => {
  console.error("Falha ao gerar coordenadas de clima:", error);
  process.exit(1);
});
