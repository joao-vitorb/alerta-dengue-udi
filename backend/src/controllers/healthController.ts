import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export function getHealthStatus(_request: Request, response: Response) {
  return response.status(200).json({
    status: "ok",
    service: "alerta-dengue-udi-backend",
    timestamp: new Date().toISOString(),
  });
}

export async function getDatabaseHealthStatus(
  _request: Request,
  response: Response,
) {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return response.status(200).json({
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch {
    return response.status(500).json({
      status: "error",
      database: "unavailable",
      timestamp: new Date().toISOString(),
    });
  }
}
