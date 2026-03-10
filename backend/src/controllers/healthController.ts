import type { Request, Response } from "express";

export function getHealthStatus(_request: Request, response: Response) {
  return response.status(200).json({
    status: "ok",
    service: "alerta-dengue-udi-backend",
    timestamp: new Date().toISOString(),
  });
}
