import type { Prisma } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";
import { AppError } from "../errors/AppError";
import type {
  HealthUnitQueryInput,
  RecommendedHealthUnitQueryInput,
} from "../schemas/healthUnitSchemas";
import { calculateDistanceInKm } from "../utils/distance";

function normalizeText(value: string | null | undefined) {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

type HealthUnitWithDistance = Awaited<
  ReturnType<typeof prisma.healthUnit.findMany>
>[number] & {
  distanceKm: number | null;
};

export async function listHealthUnits(filters: HealthUnitQueryInput) {
  const where: Prisma.HealthUnitWhereInput = {
    isActive: true,
  };

  if (filters.unitType) {
    where.unitType = filters.unitType;
  }

  if (filters.careLevel) {
    where.careLevel = filters.careLevel;
  }

  if (filters.sector) {
    where.sector = filters.sector;
  }

  if (filters.neighborhood) {
    where.neighborhood = {
      equals: filters.neighborhood,
      mode: "insensitive",
    };
  }

  if (filters.search) {
    where.OR = [
      {
        name: {
          contains: filters.search,
          mode: "insensitive",
        },
      },
      {
        address: {
          contains: filters.search,
          mode: "insensitive",
        },
      },
      {
        neighborhood: {
          contains: filters.search,
          mode: "insensitive",
        },
      },
    ];
  }

  const items = await prisma.healthUnit.findMany({
    where,
    orderBy: {
      name: "asc",
    },
  });

  return {
    items,
    total: items.length,
  };
}

export async function getHealthUnitById(healthUnitId: string) {
  const healthUnit = await prisma.healthUnit.findFirst({
    where: {
      id: healthUnitId,
      isActive: true,
    },
  });

  if (!healthUnit) {
    throw new AppError("Health unit not found", 404);
  }

  return healthUnit;
}

export async function listRecommendedHealthUnits(
  filters: RecommendedHealthUnitQueryInput,
) {
  const where: Prisma.HealthUnitWhereInput = {
    isActive: true,
  };

  if (filters.careLevel) {
    where.careLevel = filters.careLevel;
  }

  const items = await prisma.healthUnit.findMany({
    where,
  });

  const normalizedNeighborhood = normalizeText(filters.neighborhood);

  const itemsWithDistance: HealthUnitWithDistance[] = items.map((item) => {
    if (
      filters.latitude === undefined ||
      filters.longitude === undefined ||
      item.latitude === null ||
      item.longitude === null
    ) {
      return {
        ...item,
        distanceKm: null,
      };
    }

    return {
      ...item,
      distanceKm: Number(
        calculateDistanceInKm(
          filters.latitude,
          filters.longitude,
          item.latitude,
          item.longitude,
        ).toFixed(2),
      ),
    };
  });

  const sortedItems = [...itemsWithDistance].sort((first, second) => {
    const firstNeighborhoodMatch =
      normalizedNeighborhood &&
      normalizeText(first.neighborhood) === normalizedNeighborhood
        ? 1
        : 0;

    const secondNeighborhoodMatch =
      normalizedNeighborhood &&
      normalizeText(second.neighborhood) === normalizedNeighborhood
        ? 1
        : 0;

    if (firstNeighborhoodMatch !== secondNeighborhoodMatch) {
      return secondNeighborhoodMatch - firstNeighborhoodMatch;
    }

    const firstHasDistance = first.distanceKm !== null;
    const secondHasDistance = second.distanceKm !== null;

    if (firstHasDistance && secondHasDistance) {
      const firstDistance = first.distanceKm ?? Number.POSITIVE_INFINITY;
      const secondDistance = second.distanceKm ?? Number.POSITIVE_INFINITY;

      return firstDistance - secondDistance;
    }

    if (firstHasDistance !== secondHasDistance) {
      return firstHasDistance ? -1 : 1;
    }

    return first.name.localeCompare(second.name);
  });

  return {
    items: sortedItems.slice(0, filters.limit),
    total: Math.min(sortedItems.length, filters.limit),
    context: {
      latitude: filters.latitude ?? null,
      longitude: filters.longitude ?? null,
      careLevel: filters.careLevel ?? null,
      neighborhood: filters.neighborhood ?? null,
    },
  };
}
