import type { Request, Response } from "express";
import type { TestNotificationInput } from "../schemas/notificationSchemas";
import { sendTestNotification } from "../services/notificationService";

export async function sendTestNotificationController(
  request: Request,
  response: Response,
) {
  const { anonymousId } = request.body as TestNotificationInput;
  const result = await sendTestNotification(anonymousId);

  return response.status(200).json(result);
}
