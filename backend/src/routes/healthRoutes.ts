import { Router } from "express";
import {
  getDatabaseHealthStatus,
  getHealthStatus,
} from "../controllers/healthController";
import { asyncHandler } from "../utils/asyncHandler";

const healthRouter = Router();

healthRouter.get("/", getHealthStatus);
healthRouter.get("/database", asyncHandler(getDatabaseHealthStatus));

export { healthRouter };
