import type { Prisma } from "../generated/prisma/client";
import { AppError } from "../errors/AppError";
import { prisma } from "../lib/prisma";
import type {
  HealthUnitQueryInput,
  RecommendedHealthUnitQueryInput,
} from "../schemas/healthUnitSchemas";
import { calculateDistanceInKm } from "../utils/distance";

type HealthUnit = Awaited<
  ReturnType<typeof prisma.healthUnit.findMany>
>[number];

type HealthUnitWithDistance = HealthUnit & {
  distanceKm: number | null;
};

function normalizeText(value: string | null | undefined) {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function buildSearchFilter(
  search: string | undefined,
): Prisma.HealthUnitWhereInput["OR"] {
  if (!search) {
    return undefined;
  }

  return [
    { name: { contains: search, mode: "insensitive" } },
    { address: { contains: search, mode: "insensitive" } },
    { neighborhood: { contains: search, mode: "insensitive" } },
  ];
}

function buildHealthUnitWhere(
  filters: HealthUnitQueryInput,
): Prisma.HealthUnitWhereInput {
  const where: Prisma.HealthUnitWhereInput = { isActive: true };

  if (filters.unitType) where.unitType = filters.unitType;
  if (filters.careLevel) where.careLevel = filters.careLevel;
  if (filters.sector) where.sector = filters.sector;

  if (filters.neighborhood) {
    where.neighborhood = {
      equals: filters.neighborhood,
      mode: "insensitive",
    };
  }

  const searchFilter = buildSearchFilter(filters.search);

  if (searchFilter) {
    where.OR = searchFilter;
  }

  return where;
}

function attachDistance(
  unit: HealthUnit,
  origin: { latitude?: number; longitude?: number },
): HealthUnitWithDistance {
  if (
    origin.latitude === undefined ||
    origin.longitude === undefined ||
    unit.latitude === null ||
    unit.longitude === null
  ) {
    return { ...unit, distanceKm: null };
  }

  const distance = calculateDistanceInKm(
    origin.latitude,
    origin.longitude,
    unit.latitude,
    unit.longitude,
  );

  return { ...unit, distanceKm: Number(distance.toFixed(2)) };
}

function compareByNeighborhoodMatch(
  first: HealthUnitWithDistance,
  second: HealthUnitWithDistance,
  normalizedNeighborhood: string,
): number {
  if (!normalizedNeighborhood) return 0;

  const firstMatches =
    normalizeText(first.neighborhood) === normalizedNeighborhood ? 1 : 0;
  const secondMatches =
    normalizeText(second.neighborhood) === normalizedNeighborhood ? 1 : 0;

  return secondMatches - firstMatches;
}

function compareByDistance(
  first: HealthUnitWithDistance,
  second: HealthUnitWithDistance,
): number {
  const firstHas = first.distanceKm !== null;
  const secondHas = second.distanceKm !== null;

  if (firstHas && secondHas) {
    return (first.distanceKm ?? 0) - (second.distanceKm ?? 0);
  }

  if (firstHas !== secondHas) {
    return firstHas ? -1 : 1;
  }

  return 0;
}

function buildRecommendationComparator(normalizedNeighborhood: string) {
  return (first: HealthUnitWithDistance, second: HealthUnitWithDistance) => {
    const byNeighborhood = compareByNeighborhoodMatch(
      first,
      second,
      normalizedNeighborhood,
    );

    if (byNeighborhood !== 0) return byNeighborhood;

    const byDistance = compareByDistance(first, second);

    if (byDistance !== 0) return byDistance;

    return first.name.localeCompare(second.name);
  };
}

export async function listHealthUnits(filters: HealthUnitQueryInput) {
  const items = await prisma.healthUnit.findMany({
    where: buildHealthUnitWhere(filters),
    orderBy: { name: "asc" },
  });

  return {
    items,
    total: items.length,
  };
}

export async function getHealthUnitById(healthUnitId: string) {
  const healthUnit = await prisma.healthUnit.findFirst({
    where: { id: healthUnitId, isActive: true },
  });

  if (!healthUnit) {
    throw new AppError("Health unit not found", 404);
  }

  return healthUnit;
}

export async function listRecommendedHealthUnits(
  filters: RecommendedHealthUnitQueryInput,
) {
  const where: Prisma.HealthUnitWhereInput = { isActive: true };

  if (filters.careLevel) {
    where.careLevel = filters.careLevel;
  }

  const items = await prisma.healthUnit.findMany({ where });

  const itemsWithDistance = items.map((item) =>
    attachDistance(item, {
      latitude: filters.latitude,
      longitude: filters.longitude,
    }),
  );

  const normalizedNeighborhood = normalizeText(filters.neighborhood);
  const comparator = buildRecommendationComparator(normalizedNeighborhood);
  const sortedItems = [...itemsWithDistance].sort(comparator);
  const limitedItems = sortedItems.slice(0, filters.limit);

  return {
    items: limitedItems,
    total: limitedItems.length,
    context: {
      latitude: filters.latitude ?? null,
      longitude: filters.longitude ?? null,
      careLevel: filters.careLevel ?? null,
      neighborhood: filters.neighborhood ?? null,
    },
  };
}
