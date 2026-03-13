import { env } from "../config/env";
import { ApiError } from "../errors/ApiError";
import type { TestNotificationResponse } from "../types/notification";

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

export async function sendTestNotification(anonymousId: string) {
  const response = await fetch(`${apiBaseUrl}/notifications/test`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      anonymousId,
    }),
  });

  return parseResponse<TestNotificationResponse>(response);
}
