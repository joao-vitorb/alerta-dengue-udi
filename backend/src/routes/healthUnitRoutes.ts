import { Router } from "express";
import {
  getHealthUnitByIdController,
  listHealthUnitsController,
  listRecommendedHealthUnitsController,
} from "../controllers/healthUnitController";
import { validateRequest } from "../middlewares/validateRequest";
import {
  healthUnitIdParamSchema,
  healthUnitQuerySchema,
  recommendedHealthUnitQuerySchema,
} from "../schemas/healthUnitSchemas";
import { asyncHandler } from "../utils/asyncHandler";

const healthUnitRouter = Router();

healthUnitRouter.get(
  "/",
  validateRequest({ query: healthUnitQuerySchema }),
  asyncHandler(listHealthUnitsController),
);

healthUnitRouter.get(
  "/recommended",
  validateRequest({ query: recommendedHealthUnitQuerySchema }),
  asyncHandler(listRecommendedHealthUnitsController),
);

healthUnitRouter.get(
  "/:healthUnitId",
  validateRequest({ params: healthUnitIdParamSchema }),
  asyncHandler(getHealthUnitByIdController),
);

export { healthUnitRouter };
