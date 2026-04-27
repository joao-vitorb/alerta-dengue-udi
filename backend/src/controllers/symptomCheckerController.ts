import type { Request, Response } from "express";
import type { SymptomCheckerInput } from "../schemas/symptomCheckerSchemas";
import { checkSymptoms } from "../services/symptomCheckerService";

export function checkSymptomsController(request: Request, response: Response) {
  const result = checkSymptoms(request.body as SymptomCheckerInput);

  return response.status(200).json(result);
}
