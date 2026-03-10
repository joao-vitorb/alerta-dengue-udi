import { env } from "../config/env";
import { ApiError } from "../errors/ApiError";
import type {
  CreateUserPreferencePayload,
  UpdateUserPreferencePayload,
  UserPreference,
} from "../types/userPreference";

const apiBaseUrl = `${env.apiUrl}/api`;

async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      data?.message ?? "Request failed",
      response.status,
      data?.details ?? null,
    );
  }

  return data as T;
}

export async function getUserPreferenceByAnonymousId(anonymousId: string) {
  const response = await fetch(`${apiBaseUrl}/user-preferences/${anonymousId}`);

  return parseResponse<UserPreference>(response);
}

export async function upsertUserPreference(
  payload: CreateUserPreferencePayload,
) {
  const response = await fetch(`${apiBaseUrl}/user-preferences`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<UserPreference>(response);
}

export async function updateUserPreference(
  anonymousId: string,
  payload: UpdateUserPreferencePayload,
) {
  const response = await fetch(
    `${apiBaseUrl}/user-preferences/${anonymousId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  return parseResponse<UserPreference>(response);
}
