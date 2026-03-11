import { Router } from "express";
import { getPreventiveAlertsController } from "../controllers/preventiveAlertController";

const preventiveAlertRouter = Router();

preventiveAlertRouter.get("/", getPreventiveAlertsController);

export { preventiveAlertRouter };
