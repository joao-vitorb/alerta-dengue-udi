import { Router } from "express";
import { sendTestNotificationController } from "../controllers/notificationController";
import { notificationTestRateLimiter } from "../middlewares/rateLimiters";
import { validateRequest } from "../middlewares/validateRequest";
import { testNotificationBodySchema } from "../schemas/notificationSchemas";
import { asyncHandler } from "../utils/asyncHandler";

const notificationRouter = Router();

notificationRouter.post(
  "/test",
  notificationTestRateLimiter,
  validateRequest({ body: testNotificationBodySchema }),
  asyncHandler(sendTestNotificationController),
);

export { notificationRouter };
