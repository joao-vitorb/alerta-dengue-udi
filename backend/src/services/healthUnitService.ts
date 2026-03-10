import type { Prisma } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";
import { AppError } from "../errors/AppError";
import type { HealthUnitQueryInput } from "../schemas/healthUnitSchemas";

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
