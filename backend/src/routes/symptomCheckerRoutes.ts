import { Router } from "express";
import { checkSymptomsController } from "../controllers/symptomCheckerController";
import { symptomCheckerRateLimiter } from "../middlewares/rateLimiters";
import { validateRequest } from "../middlewares/validateRequest";
import { symptomCheckerBodySchema } from "../schemas/symptomCheckerSchemas";

const symptomCheckerRouter = Router();

symptomCheckerRouter.post(
  "/",
  symptomCheckerRateLimiter,
  validateRequest({ body: symptomCheckerBodySchema }),
  checkSymptomsController,
);

export { symptomCheckerRouter };
