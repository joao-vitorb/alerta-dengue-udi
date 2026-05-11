import { apiClient } from "../lib/apiClient";

export type TestNotificationChannel = "EMAIL" | "PUSH";

type TestNotificationResponse = {
  channel: TestNotificationChannel;
  scheduledInSeconds: number;
};

export function requestTestNotification(payload: {
  anonymousId: string;
  channel: TestNotificationChannel;
}) {
  return apiClient.post<TestNotificationResponse>(
    "/notifications/test",
    payload,
  );
}
