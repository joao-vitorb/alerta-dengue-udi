import { Router } from "express";
import { sendTestNotificationController } from "../controllers/notificationController";
import { validateRequest } from "../middlewares/validateRequest";
import { testNotificationBodySchema } from "../schemas/notificationSchemas";
import { asyncHandler } from "../utils/asyncHandler";

const notificationRouter = Router();

notificationRouter.post(
  "/test",
  validateRequest({ body: testNotificationBodySchema }),
  asyncHandler(sendTestNotificationController),
);

export { notificationRouter };
