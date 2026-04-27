import { Router } from "express";
import { getPreventiveAlertsController } from "../controllers/preventiveAlertController";
import { validateRequest } from "../middlewares/validateRequest";
import { preventiveAlertQuerySchema } from "../schemas/preventiveAlertSchemas";
import { asyncHandler } from "../utils/asyncHandler";

const preventiveAlertRouter = Router();

preventiveAlertRouter.get(
  "/",
  validateRequest({ query: preventiveAlertQuerySchema }),
  asyncHandler(getPreventiveAlertsController),
);

export { preventiveAlertRouter };
