import { Router } from "express";
import { climateNotificationAutomationRouter } from "./climateNotificationAutomationRoutes";
import { healthRouter } from "./healthRoutes";
import { healthUnitRouter } from "./healthUnitRoutes";
import { notificationRouter } from "./notificationRoutes";
import { preventiveAlertRouter } from "./preventiveAlertRoutes";
import { pushSubscriptionRouter } from "./pushSubscriptionRoutes";
import { symptomCheckerRouter } from "./symptomCheckerRoutes";
import { userPreferenceRouter } from "./userPreferenceRoutes";
import { weatherRouter } from "./weatherRoutes";

const router = Router();

router.use("/automation", climateNotificationAutomationRouter);
router.use("/health", healthRouter);
router.use("/health-units", healthUnitRouter);
router.use("/notifications", notificationRouter);
router.use("/preventive-alerts", preventiveAlertRouter);
router.use("/push-subscriptions", pushSubscriptionRouter);
router.use("/symptom-checker", symptomCheckerRouter);
router.use("/user-preferences", userPreferenceRouter);
router.use("/weather", weatherRouter);

export { router };
