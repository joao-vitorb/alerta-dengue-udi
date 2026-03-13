import webpush from "web-push";
import { env } from "../config/env";

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

function isPushConfigured() {
  return Boolean(env.vapidPublicKey && env.vapidPrivateKey && env.vapidSubject);
}

export async function sendPushNotification(
  subscription: StoredPushSubscription,
  payload: PushPayload,
): Promise<NotificationDeliveryResult> {
  if (!isPushConfigured()) {
    return {
      attempted: true,
      delivered: false,
      simulated: true,
      reason: "Push provider is not configured",
    };
  }

  webpush.setVapidDetails(
    env.vapidSubject,
    env.vapidPublicKey,
    env.vapidPrivateKey,
  );

  try {
    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.p256dh,
          auth: subscription.auth,
        },
      },
      JSON.stringify(payload),
    );

    return {
      attempted: true,
      delivered: true,
      simulated: false,
      reason: null,
    };
  } catch (error) {
    return {
      attempted: true,
      delivered: false,
      simulated: false,
      reason:
        error instanceof Error
          ? error.message
          : "Failed to send push notification",
    };
  }
}
