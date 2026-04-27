import type { Request, Response } from "express";
import type {
  CreateUserPreferenceInput,
  UpdateUserPreferenceInput,
} from "../schemas/userPreferenceSchemas";
import {
  getUserPreferenceByAnonymousId,
  updateUserPreference,
  upsertUserPreference,
} from "../services/userPreferenceService";

export async function getUserPreferenceByAnonymousIdController(
  request: Request,
  response: Response,
) {
  const { anonymousId } = request.params as { anonymousId: string };
  const userPreference = await getUserPreferenceByAnonymousId(anonymousId);

  return response.status(200).json(userPreference);
}

export async function upsertUserPreferenceController(
  request: Request,
  response: Response,
) {
  const userPreference = await upsertUserPreference(
    request.body as CreateUserPreferenceInput,
  );

  return response.status(200).json(userPreference);
}

export async function updateUserPreferenceController(
  request: Request,
  response: Response,
) {
  const { anonymousId } = request.params as { anonymousId: string };
  const userPreference = await updateUserPreference(
    anonymousId,
    request.body as UpdateUserPreferenceInput,
  );

  return response.status(200).json(userPreference);
}
