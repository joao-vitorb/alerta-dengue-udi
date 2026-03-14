import { Router } from "express";
import {
  getHealthUnitByIdController,
  listHealthUnitsController,
  listRecommendedHealthUnitsController,
} from "../controllers/healthUnitController";

const healthUnitRouter = Router();

healthUnitRouter.get("/", listHealthUnitsController);
healthUnitRouter.get("/recommended", listRecommendedHealthUnitsController);
healthUnitRouter.get("/:healthUnitId", getHealthUnitByIdController);

export { healthUnitRouter };
