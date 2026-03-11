import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { weatherContextQuerySchema } from "../schemas/weatherSchemas";
import {
  getSupportedWeatherNeighborhoods,
  getWeatherPreventionContext,
} from "../services/weatherService";
import { formatZodErrors } from "../utils/formatZodErrors";

export function listSupportedWeatherNeighborhoodsController(
  _request: Request,
  response: Response,
) {
  return response.status(200).json(getSupportedWeatherNeighborhoods());
}

export async function getWeatherPreventionContextController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const parsedQuery = weatherContextQuerySchema.safeParse(request.query);

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
    const result = await getWeatherPreventionContext(
      parsedQuery.data.neighborhood,
    );

    return response.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}
