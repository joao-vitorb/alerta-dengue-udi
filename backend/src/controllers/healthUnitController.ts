import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import {
  healthUnitIdParamSchema,
  healthUnitQuerySchema,
} from "../schemas/healthUnitSchemas";
import {
  getHealthUnitById,
  listHealthUnits,
} from "../services/healthUnitService";
import { formatZodErrors } from "../utils/formatZodErrors";

export async function listHealthUnitsController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const parsedQuery = healthUnitQuerySchema.safeParse(request.query);

  if (!parsedQuery.success) {
    return next(
      new AppError(
        "Invalid query parameters",
        400,
        formatZodErrors(parsedQuery.error),
      ),
    );
  }

  try {
    const result = await listHealthUnits(parsedQuery.data);

    return response.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

export async function getHealthUnitByIdController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const parsedParams = healthUnitIdParamSchema.safeParse(request.params);

  if (!parsedParams.success) {
    return next(
      new AppError(
        "Invalid route parameters",
        400,
        formatZodErrors(parsedParams.error),
      ),
    );
  }

  try {
    const healthUnit = await getHealthUnitById(parsedParams.data.healthUnitId);

    return response.status(200).json(healthUnit);
  } catch (error) {
    return next(error);
  }
}
