import { Router } from "express";
import { checkSymptomsController } from "../controllers/symptomCheckerController";

const symptomCheckerRouter = Router();

symptomCheckerRouter.post("/", checkSymptomsController);

export { symptomCheckerRouter };