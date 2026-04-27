import webpush from "web-push";
import { env } from "../config/env";

export type WebPushSubscription = {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
};

export type WebPushSendResult = {
  delivered: boolean;
  reason: string | null;
};

let webPushConfigured = false;

function ensureWebPushConfigured() {
  if (webPushConfigured) {
    return true;
  }

  const { publicKey, privateKey, subject } = env.webPush;

  if (!publicKey || !privateKey || !subject) {
    return false;
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);
  webPushConfigured = true;

  return true;
}

export async function sendWebPushMessage(
  subscription: WebPushSubscription,
  payload: unknown,
): Promise<WebPushSendResult> {
  if (!ensureWebPushConfigured()) {
    return {
      delivered: false,
      reason: "WEB_PUSH_NOT_CONFIGURED",
    };
  }

  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));

    return {
      delivered: true,
      reason: null,
    };
  } catch (error) {
    return {
      delivered: false,
      reason:
        error instanceof Error ? error.message : "WEB_PUSH_DELIVERY_FAILED",
    };
  }
}
