import { env } from "../config/env";
import { ApiError } from "../errors/ApiError";
import type { BrowserPushSubscriptionPayload } from "../types/notification";

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

export async function upsertPushSubscription(
  payload: BrowserPushSubscriptionPayload,
) {
  const response = await fetch(`${apiBaseUrl}/push-subscriptions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
}

export async function deletePushSubscription(anonymousId: string) {
  const response = await fetch(
    `${apiBaseUrl}/push-subscriptions/${anonymousId}`,
    {
      method: "DELETE",
    },
  );

  return parseResponse(response);
}
