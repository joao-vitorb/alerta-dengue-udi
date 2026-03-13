import { Router } from "express";
import { sendTestNotificationController } from "../controllers/notificationController";

const notificationRouter = Router();

notificationRouter.post("/test", sendTestNotificationController);

export { notificationRouter };
