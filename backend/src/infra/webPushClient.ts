import webpush from "web-push";
import { env } from "../config/env";
import { logger } from "../lib/logger";

const webPushLogger = logger.child({ module: "web-push" });

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
  statusCode?: number;
};

const EXPIRED_PUSH_STATUS_CODES = new Set([404, 410]);

export function isExpiredPushSubscriptionStatus(
  statusCode: number | undefined,
): boolean {
  return statusCode !== undefined && EXPIRED_PUSH_STATUS_CODES.has(statusCode);
}

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

type WebPushErrorDetails = {
  message: string;
  statusCode?: number;
  body?: string;
};

function extractWebPushErrorDetails(error: unknown): WebPushErrorDetails {
  const candidate = error as { statusCode?: unknown; body?: unknown };

  return {
    message:
      error instanceof Error ? error.message : "WEB_PUSH_DELIVERY_FAILED",
    statusCode:
      typeof candidate?.statusCode === "number"
        ? candidate.statusCode
        : undefined,
    body: typeof candidate?.body === "string" ? candidate.body : undefined,
  };
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
    const details = extractWebPushErrorDetails(error);

    webPushLogger.error(
      { ...details, endpoint: subscription.endpoint },
      "Failed to deliver web push notification",
    );

    return {
      delivered: false,
      reason: details.body
        ? `${details.message} | ${details.body}`
        : details.message,
      statusCode: details.statusCode,
    };
  }
}
