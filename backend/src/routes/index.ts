import { Router } from "express";
import { healthRouter } from "./healthRoutes";
import { userPreferenceRouter } from "./userPreferenceRoutes";

const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/user-preferences", userPreferenceRouter);

export { apiRouter };
