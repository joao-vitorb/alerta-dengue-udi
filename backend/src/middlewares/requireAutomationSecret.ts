import { timingSafeEqual } from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import { AppError } from "../errors/AppError";

const AUTOMATION_SECRET_HEADER = "x-automation-secret";

function isSecretValid(provided: string, expected: string): boolean {
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);

  if (providedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(providedBuffer, expectedBuffer);
}

export function requireAutomationSecret(
  request: Request,
  _response: Response,
  next: NextFunction,
) {
  const expectedSecret = env.climateNotifications.triggerSecret;

  if (!expectedSecret) {
    throw new AppError(
      "Automation trigger secret is not configured on the server.",
      503,
    );
  }

  const headerValue = request.header(AUTOMATION_SECRET_HEADER);

  if (!headerValue || !isSecretValid(headerValue, expectedSecret)) {
    throw new AppError("Invalid automation trigger secret.", 401);
  }

  next();
}
