import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";
import { AppError } from "../errors/AppError";
import { formatZodErrors } from "../utils/formatZodErrors";

type RequestPart = "body" | "query" | "params";

type SchemaMap = Partial<Record<RequestPart, ZodType>>;

const partErrorMessages: Record<RequestPart, string> = {
  body: "Invalid request body",
  query: "Invalid query parameters",
  params: "Invalid route parameters",
};

export function validateRequest(schemas: SchemaMap) {
  return function handle(
    request: Request,
    _response: Response,
    next: NextFunction,
  ) {
    for (const part of Object.keys(schemas) as RequestPart[]) {
      const schema = schemas[part];

      if (!schema) {
        continue;
      }

      const parsed = schema.safeParse(request[part]);

      if (!parsed.success) {
        return next(
          new AppError(
            partErrorMessages[part],
            400,
            formatZodErrors(parsed.error),
          ),
        );
      }

      Object.defineProperty(request, part, {
        value: parsed.data,
        writable: true,
        configurable: true,
        enumerable: true,
      });
    }

    return next();
  };
}
