import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { preventiveAlertQuerySchema } from "../schemas/preventiveAlertSchemas";
import { getPreventiveAlertsByNeighborhood } from "../services/preventiveAlertService";
import { formatZodErrors } from "../utils/formatZodErrors";

export async function getPreventiveAlertsController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const parsedQuery = preventiveAlertQuerySchema.safeParse(request.query);

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
    const result = await getPreventiveAlertsByNeighborhood(
      parsedQuery.data.neighborhood,
    );

    return response.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}
