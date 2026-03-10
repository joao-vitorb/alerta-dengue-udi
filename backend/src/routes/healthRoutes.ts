import { Router } from "express";
import {
  getDatabaseHealthStatus,
  getHealthStatus,
} from "../controllers/healthController";

const healthRouter = Router();

healthRouter.get("/", getHealthStatus);
healthRouter.get("/database", getDatabaseHealthStatus);

export { healthRouter };
