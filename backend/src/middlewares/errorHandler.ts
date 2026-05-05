import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/AppError";
import { logger } from "../lib/logger";
import { formatZodErrors } from "../utils/formatZodErrors";

export function errorHandler(
  error: unknown,
  request: Request,
  response: Response,
  _next: NextFunction,
) {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      message: error.message,
      details: error.details ?? null,
    });
  }

  if (error instanceof ZodError) {
    return response.status(400).json({
      message: "Validation failed",
      details: formatZodErrors(error),
    });
  }

  logger.error(
    { err: error, method: request.method, path: request.originalUrl },
    "Unhandled request error",
  );

  return response.status(500).json({
    message: "Internal server error",
    details: null,
  });
}
