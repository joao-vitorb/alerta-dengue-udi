import { Router } from "express";
import { runAutomatedClimateNotificationCycle } from "../services/climateNotificationAutomationService";
import { asyncHandler } from "../utils/asyncHandler";

const climateNotificationAutomationRouter = Router();

climateNotificationAutomationRouter.post(
  "/climate-notifications/run",
  asyncHandler(async (request, response) => {
    const dryRun = request.query.dryRun === "true";

    const result = await runAutomatedClimateNotificationCycle({
      dryRun,
      source: "manual",
    });

    return response.status(200).json(result);
  }),
);

export { climateNotificationAutomationRouter };
