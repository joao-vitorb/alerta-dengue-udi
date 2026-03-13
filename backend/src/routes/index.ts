import { Router } from "express";
import { healthRouter } from "./healthRoutes";
import { userPreferenceRouter } from "./userPreferenceRoutes";
import { healthUnitRouter } from "./healthUnitRoutes";
import { weatherRouter } from "./weatherRoutes";
import { preventiveAlertRouter } from "./preventiveAlertRoutes";
import { symptomCheckerRouter } from "./symptomCheckerRoutes";
import { pushSubscriptionRouter } from "./pushSubscriptionRoutes";
import { notificationRouter } from "./notificationRoutes";

const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/user-preferences", userPreferenceRouter);
apiRouter.use("/health-units", healthUnitRouter);
apiRouter.use("/weather", weatherRouter);
apiRouter.use("/preventive-alerts", preventiveAlertRouter);
apiRouter.use("/symptom-checker", symptomCheckerRouter);
apiRouter.use("/push-subscriptions", pushSubscriptionRouter);
apiRouter.use("/notifications", notificationRouter)

export { apiRouter };
