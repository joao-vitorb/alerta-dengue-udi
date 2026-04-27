import { Router } from "express";
import {
  getWeatherPreventionContextController,
  listSupportedWeatherNeighborhoodsController,
} from "../controllers/weatherController";
import { validateRequest } from "../middlewares/validateRequest";
import { weatherContextQuerySchema } from "../schemas/weatherSchemas";
import { asyncHandler } from "../utils/asyncHandler";

const weatherRouter = Router();

weatherRouter.get(
  "/supported-neighborhoods",
  listSupportedWeatherNeighborhoodsController,
);

weatherRouter.get(
  "/prevention-context",
  validateRequest({ query: weatherContextQuerySchema }),
  asyncHandler(getWeatherPreventionContextController),
);

export { weatherRouter };
