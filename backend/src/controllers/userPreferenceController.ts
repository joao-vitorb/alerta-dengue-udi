import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import {
  anonymousIdParamSchema,
  createUserPreferenceSchema,
  updateUserPreferenceSchema,
} from "../schemas/userPreferenceSchemas";
import {
  getUserPreferenceByAnonymousId,
  updateUserPreference,
  upsertUserPreference,
} from "../services/userPreferenceService";
import { formatZodErrors } from "../utils/formatZodErrors";

export async function getUserPreferenceByAnonymousIdController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const parsedParams = anonymousIdParamSchema.safeParse(request.params);

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
    const userPreference = await getUserPreferenceByAnonymousId(
      parsedParams.data.anonymousId,
    );

    return response.status(200).json(userPreference);
  } catch (error) {
    return next(error);
  }
}

export async function upsertUserPreferenceController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const parsedBody = createUserPreferenceSchema.safeParse(request.body);

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
    const userPreference = await upsertUserPreference(parsedBody.data);

    return response.status(200).json(userPreference);
  } catch (error) {
    return next(error);
  }
}

export async function updateUserPreferenceController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const parsedParams = anonymousIdParamSchema.safeParse(request.params);
  const parsedBody = updateUserPreferenceSchema.safeParse(request.body);

  if (!parsedParams.success) {
    return next(
      new AppError(
        "Invalid route parameters",
        400,
        formatZodErrors(parsedParams.error),
      ),
    );
  }

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
    const userPreference = await updateUserPreference(
      parsedParams.data.anonymousId,
      parsedBody.data,
    );

    return response.status(200).json(userPreference);
  } catch (error) {
    return next(error);
  }
}
