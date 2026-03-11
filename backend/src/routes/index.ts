import { Router } from "express";
import { healthRouter } from "./healthRoutes";
import { userPreferenceRouter } from "./userPreferenceRoutes";
import { healthUnitRouter } from "./healthUnitRoutes";
import { weatherRouter } from "./weatherRoutes";

const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/user-preferences", userPreferenceRouter);
apiRouter.use("/health-units", healthUnitRouter);
apiRouter.use("/weather", weatherRouter);

export { apiRouter };
