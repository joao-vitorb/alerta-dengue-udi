import { Router } from "express";
import { healthRouter } from "./healthRoutes";
import { userPreferenceRouter } from "./userPreferenceRoutes";
import { healthUnitRouter } from "./healthUnitRoutes";
import { weatherRouter } from "./weatherRoutes";
import { preventiveAlertRouter } from "./preventiveAlertRoutes";

const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/user-preferences", userPreferenceRouter);
apiRouter.use("/health-units", healthUnitRouter);
apiRouter.use("/weather", weatherRouter);
apiRouter.use("/preventive-alerts", preventiveAlertRouter);

export { apiRouter };
