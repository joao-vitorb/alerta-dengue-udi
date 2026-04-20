import { Router } from "express";
import { climateNotificationAutomationRouter } from "./climateNotificationAutomationRoutes";
import { healthUnitRouter } from "./healthUnitRoutes";
import { notificationRouter } from "./notificationRoutes";
import { symptomCheckerRouter } from "./symptomCheckerRoutes";
import { userPreferenceRouter } from "./userPreferenceRoutes";
import { weatherRouter } from "./weatherRoutes";

const router = Router();

router.use("/automation", climateNotificationAutomationRouter);
router.use("/health-units", healthUnitRouter);
router.use("/notifications", notificationRouter);
router.use("/symptom-checker", symptomCheckerRouter);
router.use("/user-preferences", userPreferenceRouter);
router.use("/weather", weatherRouter);

export { router };
