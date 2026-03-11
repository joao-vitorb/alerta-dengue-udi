import { Router } from "express";
import {
  getWeatherPreventionContextController,
  listSupportedWeatherNeighborhoodsController,
} from "../controllers/weatherController";

const weatherRouter = Router();

weatherRouter.get(
  "/supported-neighborhoods",
  listSupportedWeatherNeighborhoodsController,
);
weatherRouter.get("/prevention-context", getWeatherPreventionContextController);

export { weatherRouter };
