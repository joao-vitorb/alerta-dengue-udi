import type { Request, Response } from "express";
import { getPreventiveAlertsByNeighborhood } from "../services/preventiveAlertService";

export async function getPreventiveAlertsController(
  request: Request,
  response: Response,
) {
  const { neighborhood } = request.query as { neighborhood: string };
  const result = await getPreventiveAlertsByNeighborhood(neighborhood);

  return response.status(200).json(result);
}
