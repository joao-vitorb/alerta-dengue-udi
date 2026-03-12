import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { symptomCheckerRequestSchema } from "../schemas/symptomCheckerSchemas";
import { evaluateSymptoms } from "../services/symptomCheckerService";
import { formatZodErrors } from "../utils/formatZodErrors";

export async function evaluateSymptomsController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const parsedBody = symptomCheckerRequestSchema.safeParse(request.body);

  if (!parsedBody.success) {
    return next(
      new AppError(
        "Invalid request body",
        400,
        formatZodErrors(parsedBody.error),
      ),
    );
  }

  try {
    const result = evaluateSymptoms(parsedBody.data);

    return response.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}
