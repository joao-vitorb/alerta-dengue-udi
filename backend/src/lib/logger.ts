import pino, { type LoggerOptions } from "pino";
import { env } from "../config/env";

const REDACTED_PATHS = [
  "req.headers.authorization",
  'req.headers["x-automation-secret"]',
  'req.headers["cookie"]',
  "*.password",
  "*.privateKey",
  "*.secret",
  "*.token",
];

function buildLoggerOptions(): LoggerOptions {
  const isProduction = env.nodeEnv === "production";

  const baseOptions: LoggerOptions = {
    level: env.logLevel,
    redact: {
      paths: REDACTED_PATHS,
      remove: true,
    },
  };

  if (isProduction) {
    return baseOptions;
  }

  return {
    ...baseOptions,
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:HH:MM:ss.l",
        ignore: "pid,hostname",
      },
    },
  };
}

export const logger = pino(buildLoggerOptions());
