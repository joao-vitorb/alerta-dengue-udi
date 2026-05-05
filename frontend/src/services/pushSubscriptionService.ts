import { apiClient } from "../lib/apiClient";
import type { SerializedPushSubscription } from "./browserPushClient";

type RegisterPushSubscriptionPayload = {
  anonymousId: string;
  subscription: SerializedPushSubscription;
};

export function registerPushSubscription(
  payload: RegisterPushSubscriptionPayload,
) {
  return apiClient.post<unknown>("/push-subscriptions", payload);
}

export function unregisterPushSubscription(anonymousId: string) {
  return apiClient.delete<unknown>(`/push-subscriptions/${anonymousId}`);
}
