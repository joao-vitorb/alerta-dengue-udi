import { Router } from "express";
import { checkSymptomsController } from "../controllers/symptomCheckerController";
import { validateRequest } from "../middlewares/validateRequest";
import { symptomCheckerBodySchema } from "../schemas/symptomCheckerSchemas";

const symptomCheckerRouter = Router();

symptomCheckerRouter.post(
  "/",
  validateRequest({ body: symptomCheckerBodySchema }),
  checkSymptomsController,
);

export { symptomCheckerRouter };
