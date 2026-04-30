import { apiClient } from "../lib/apiClient";
import type {
  CreateUserPreferencePayload,
  UpdateUserPreferencePayload,
  UserPreference,
} from "../types/userPreference";

export function getUserPreferenceByAnonymousId(anonymousId: string) {
  return apiClient.get<UserPreference>(`/user-preferences/${anonymousId}`);
}

export function upsertUserPreference(payload: CreateUserPreferencePayload) {
  return apiClient.post<UserPreference>("/user-preferences", payload);
}

export function updateUserPreference(
  anonymousId: string,
  payload: UpdateUserPreferencePayload,
) {
  return apiClient.patch<UserPreference>(
    `/user-preferences/${anonymousId}`,
    payload,
  );
}
