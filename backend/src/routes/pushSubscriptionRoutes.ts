import { Router } from "express";
import {
  deletePushSubscriptionController,
  upsertPushSubscriptionController,
} from "../controllers/pushSubscriptionController";

const pushSubscriptionRouter = Router();

pushSubscriptionRouter.post("/", upsertPushSubscriptionController);
pushSubscriptionRouter.delete(
  "/:anonymousId",
  deletePushSubscriptionController,
);

export { pushSubscriptionRouter };
