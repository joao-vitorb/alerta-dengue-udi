import { Router } from "express";
import {
  getHealthUnitByIdController,
  listHealthUnitsController,
} from "../controllers/healthUnitController";

const healthUnitRouter = Router();

healthUnitRouter.get("/", listHealthUnitsController);
healthUnitRouter.get("/:healthUnitId", getHealthUnitByIdController);

export { healthUnitRouter };
