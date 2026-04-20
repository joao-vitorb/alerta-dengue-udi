import { Router } from "express";
import { runAutomatedClimateNotificationCycle } from "../services/climateNotificationAutomationService";

const climateNotificationAutomationRouter = Router();

climateNotificationAutomationRouter.post(
  "/climate-notifications/run",
  async (request, response, next) => {
    try {
      const dryRun = request.query.dryRun === "true";

      const result = await runAutomatedClimateNotificationCycle({
        dryRun,
        source: "manual",
      });

      return response.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  },
);

export { climateNotificationAutomationRouter };
