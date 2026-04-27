import { Router } from "express";
import {
  deletePushSubscriptionController,
  upsertPushSubscriptionController,
} from "../controllers/pushSubscriptionController";
import { validateRequest } from "../middlewares/validateRequest";
import {
  anonymousIdParamSchema,
  upsertPushSubscriptionBodySchema,
} from "../schemas/pushSubscriptionSchemas";
import { asyncHandler } from "../utils/asyncHandler";

const pushSubscriptionRouter = Router();

pushSubscriptionRouter.post(
  "/",
  validateRequest({ body: upsertPushSubscriptionBodySchema }),
  asyncHandler(upsertPushSubscriptionController),
);

pushSubscriptionRouter.delete(
  "/:anonymousId",
  validateRequest({ params: anonymousIdParamSchema }),
  asyncHandler(deletePushSubscriptionController),
);

export { pushSubscriptionRouter };
