import type { Request, Response } from "express";
import {
  getSupportedWeatherNeighborhoods,
  getWeatherPreventionContext,
} from "../services/weatherService";

export function listSupportedWeatherNeighborhoodsController(
  _request: Request,
  response: Response,
) {
  return response.status(200).json(getSupportedWeatherNeighborhoods());
}

export async function getWeatherPreventionContextController(
  request: Request,
  response: Response,
) {
  const { neighborhood } = request.query as { neighborhood: string };
  const result = await getWeatherPreventionContext(neighborhood);

  return response.status(200).json(result);
}
