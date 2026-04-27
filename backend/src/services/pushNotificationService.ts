import { sendWebPushMessage } from "../infra/webPushClient";

type StoredPushSubscription = {
  endpoint: string;
  p256dh: string;
  auth: string;
};

type PushPayload = {
  title: string;
  body: string;
  url: string;
};

type NotificationDeliveryResult = {
  attempted: boolean;
  delivered: boolean;
  simulated: boolean;
  reason: string | null;
};

export async function sendPushNotification(
  subscription: StoredPushSubscription,
  payload: PushPayload,
): Promise<NotificationDeliveryResult> {
  const result = await sendWebPushMessage(
    {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.p256dh,
        auth: subscription.auth,
      },
    },
    payload,
  );

  if (result.reason === "WEB_PUSH_NOT_CONFIGURED") {
    return {
      attempted: true,
      delivered: false,
      simulated: true,
      reason: "Push provider is not configured",
    };
  }

  return {
    attempted: true,
    delivered: result.delivered,
    simulated: false,
    reason: result.delivered ? null : result.reason,
  };
}
