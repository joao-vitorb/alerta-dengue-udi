import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { testNotificationBodySchema } from "../schemas/notificationSchemas";
import { sendTestNotification } from "../services/notificationService";
import { formatZodErrors } from "../utils/formatZodErrors";

export async function sendTestNotificationController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const parsedBody = testNotificationBodySchema.safeParse(request.body);

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
    const result = await sendTestNotification(parsedBody.data.anonymousId);

    return response.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}
