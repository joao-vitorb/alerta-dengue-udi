import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import {
  anonymousIdParamSchema,
  upsertPushSubscriptionBodySchema,
} from "../schemas/pushSubscriptionSchemas";
import {
  deletePushSubscription,
  upsertPushSubscription,
} from "../services/pushSubscriptionService";
import { formatZodErrors } from "../utils/formatZodErrors";

export async function upsertPushSubscriptionController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const parsedBody = upsertPushSubscriptionBodySchema.safeParse(request.body);

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
    const result = await upsertPushSubscription(parsedBody.data);

    return response.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

export async function deletePushSubscriptionController(
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
    const result = await deletePushSubscription(parsedParams.data.anonymousId);

    return response.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}
