import { Router } from "express";
import { healthRouter } from "./healthRoutes";
import { userPreferenceRouter } from "./userPreferenceRoutes";
import { healthUnitRouter } from "./healthUnitRoutes";

const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/user-preferences", userPreferenceRouter);
apiRouter.use("/health-units", healthUnitRouter);

export { apiRouter };
