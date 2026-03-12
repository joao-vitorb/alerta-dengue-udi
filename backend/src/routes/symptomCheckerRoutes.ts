import { Router } from "express";
import { evaluateSymptomsController } from "../controllers/symptomCheckerController";

const symptomCheckerRouter = Router();

symptomCheckerRouter.post("/", evaluateSymptomsController);

export { symptomCheckerRouter };
