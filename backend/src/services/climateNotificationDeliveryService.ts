import webpush from "web-push";
import { prisma } from "../lib/prisma";
import type { ClimateNotificationRule } from "./climateNotificationRuleService";

type PushSubscriptionRecord = {
  endpoint: string;
  expirationTime: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
};

type WeatherDetails = {
  probability: number | null;
  recentRainMm: number;
};

export type ChannelDeliveryResult = {
  delivered: boolean;
  reason: string | null;
  metadata?: Record<string, unknown>;
};

function getAppPublicUrl() {
  return (
    process.env.APP_PUBLIC_URL ??
    process.env.FRONTEND_URL ??
    "http://localhost:5173"
  );
}

function getEmailJsConfig() {
  return {
    serviceId: process.env.EMAILJS_SERVICE_ID ?? "",
    templateId: process.env.EMAILJS_TEMPLATE_ID_CLIMATE_ALERT ?? "",
    publicKey: process.env.EMAILJS_PUBLIC_KEY ?? "",
    privateKey: process.env.EMAILJS_PRIVATE_KEY ?? "",
  };
}

function hasEmailJsConfig() {
  const config = getEmailJsConfig();

  return Boolean(
    config.serviceId &&
    config.templateId &&
    config.publicKey &&
    config.privateKey,
  );
}

let webPushConfigured = false;

function ensureWebPushConfigured() {
  if (webPushConfigured) {
    return true;
  }

  const publicKey = process.env.VAPID_PUBLIC_KEY ?? "";
  const privateKey = process.env.VAPID_PRIVATE_KEY ?? "";
  const subject = process.env.VAPID_SUBJECT ?? "";

  if (!publicKey || !privateKey || !subject) {
    return false;
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);
  webPushConfigured = true;

  return true;
}

function normalizePushSubscriptionRow(
  row: Record<string, unknown>,
): PushSubscriptionRecord | null {
  const endpoint = typeof row.endpoint === "string" ? row.endpoint : null;

  const p256dh =
    typeof row.p256dh === "string"
      ? row.p256dh
      : typeof row.p256dhKey === "string"
        ? row.p256dhKey
        : null;

  const auth =
    typeof row.auth === "string"
      ? row.auth
      : typeof row.authKey === "string"
        ? row.authKey
        : null;

  const expirationTime =
    typeof row.expirationTime === "number" ? row.expirationTime : null;

  const isActive = typeof row.isActive === "boolean" ? row.isActive : true;

  if (!isActive || !endpoint || !p256dh || !auth) {
    return null;
  }

  return {
    endpoint,
    expirationTime,
    keys: {
      p256dh,
      auth,
    },
  };
}

export async function listActivePushSubscriptions(anonymousId: string) {
  try {
    const rows = await prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
      `
        SELECT *
        FROM "PushSubscription"
        WHERE "anonymousId" = $1
      `,
      anonymousId,
    );

    return rows
      .map(normalizePushSubscriptionRow)
      .filter((item): item is PushSubscriptionRecord => item !== null);
  } catch {
    return [];
  }
}

export async function sendAutomatedClimateEmail(input: {
  to: string;
  neighborhood: string;
  rule: ClimateNotificationRule;
  weather: WeatherDetails;
}) {
  if (!hasEmailJsConfig()) {
    return {
      delivered: false,
      reason: "EMAILJS_NOT_CONFIGURED",
    } satisfies ChannelDeliveryResult;
  }

  const config = getEmailJsConfig();

  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      service_id: config.serviceId,
      template_id: config.templateId,
      user_id: config.publicKey,
      accessToken: config.privateKey,
      template_params: {
        to_email: input.to,
        neighborhood: input.neighborhood,
        alert_title: input.rule.title,
        alert_message: input.rule.message,
        rule_key: input.rule.ruleKey,
        precipitation_probability: input.weather.probability ?? "N/A",
        recent_rain_mm: input.weather.recentRainMm,
        action_url: getAppPublicUrl(),
      },
    }),
  });

  if (!response.ok) {
    const failureText = await response.text();

    return {
      delivered: false,
      reason: "EMAILJS_REQUEST_FAILED",
      metadata: {
        status: response.status,
        response: failureText,
      },
    } satisfies ChannelDeliveryResult;
  }

  return {
    delivered: true,
    reason: null,
  } satisfies ChannelDeliveryResult;
}

export async function sendAutomatedClimatePush(input: {
  subscriptions: PushSubscriptionRecord[];
  neighborhood: string;
  rule: ClimateNotificationRule;
}) {
  if (!ensureWebPushConfigured()) {
    return {
      delivered: false,
      reason: "WEB_PUSH_NOT_CONFIGURED",
    } satisfies ChannelDeliveryResult;
  }

  if (input.subscriptions.length === 0) {
    return {
      delivered: false,
      reason: "NO_PUSH_SUBSCRIPTIONS",
    } satisfies ChannelDeliveryResult;
  }

  const payload = JSON.stringify({
    title: input.rule.title,
    body: input.rule.message,
    tag: `climate-${input.rule.ruleKey}-${input.neighborhood}`,
    data: {
      neighborhood: input.neighborhood,
      ruleKey: input.rule.ruleKey,
      url: getAppPublicUrl(),
    },
  });

  let successCount = 0;

  for (const subscription of input.subscriptions) {
    try {
      await webpush.sendNotification(subscription, payload);
      successCount += 1;
    } catch {
      continue;
    }
  }

  if (successCount === 0) {
    return {
      delivered: false,
      reason: "PUSH_DELIVERY_FAILED",
      metadata: {
        subscriptions: input.subscriptions.length,
      },
    } satisfies ChannelDeliveryResult;
  }

  return {
    delivered: true,
    reason: null,
    metadata: {
      deliveredSubscriptions: successCount,
    },
  } satisfies ChannelDeliveryResult;
}
