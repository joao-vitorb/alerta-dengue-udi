import type { Request, Response } from "express";
import type { TestNotificationInput } from "../schemas/notificationSchemas";
import { scheduleTestNotification } from "../services/notificationService";

export async function sendTestNotificationController(
  request: Request,
  response: Response,
) {
  const input = request.body as TestNotificationInput;
  const result = await scheduleTestNotification(input);

  return response.status(202).json(result);
}
