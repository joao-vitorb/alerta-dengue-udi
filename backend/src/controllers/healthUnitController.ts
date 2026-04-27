import type { Request, Response } from "express";
import type {
  HealthUnitQueryInput,
  RecommendedHealthUnitQueryInput,
} from "../schemas/healthUnitSchemas";
import {
  getHealthUnitById,
  listHealthUnits,
  listRecommendedHealthUnits,
} from "../services/healthUnitService";

export async function listHealthUnitsController(
  request: Request,
  response: Response,
) {
  const result = await listHealthUnits(
    request.query as unknown as HealthUnitQueryInput,
  );

  return response.status(200).json(result);
}

export async function listRecommendedHealthUnitsController(
  request: Request,
  response: Response,
) {
  const result = await listRecommendedHealthUnits(
    request.query as unknown as RecommendedHealthUnitQueryInput,
  );

  return response.status(200).json(result);
}

export async function getHealthUnitByIdController(
  request: Request,
  response: Response,
) {
  const { healthUnitId } = request.params as { healthUnitId: string };
  const healthUnit = await getHealthUnitById(healthUnitId);

  return response.status(200).json(healthUnit);
}
