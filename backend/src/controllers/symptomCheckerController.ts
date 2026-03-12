import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { symptomCheckerBodySchema } from "../schemas/symptomCheckerSchemas";
import { checkSymptoms } from "../services/symptomCheckerService";
import { formatZodErrors } from "../utils/formatZodErrors";

export function checkSymptomsController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const parsedBody = symptomCheckerBodySchema.safeParse(request.body);

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
    const result = checkSymptoms(parsedBody.data);

    return response.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}
