import { env } from "../config/env";
import {
  sendEmailJsMessage,
  type EmailJsSendResult,
} from "../infra/emailJsClient";
import {
  sendWebPushMessage,
  type WebPushSubscription,
} from "../infra/webPushClient";
import { prisma } from "../lib/prisma";
import type { ClimateNotificationRule } from "./climateNotificationRuleService";

type WeatherDetails = {
  probability: number | null;
  recentRainMm: number;
};

export type ChannelDeliveryResult = {
  delivered: boolean;
  reason: string | null;
  metadata?: Record<string, unknown>;
};

export async function listActivePushSubscriptions(
  anonymousId: string,
): Promise<WebPushSubscription[]> {
  const subscription = await prisma.pushSubscription.findUnique({
    where: { anonymousId },
  });

  if (!subscription) {
    return [];
  }

  return [
    {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.p256dh,
        auth: subscription.auth,
      },
    },
  ];
}

export async function sendAutomatedClimateEmail(input: {
  to: string;
  neighborhood: string;
  rule: ClimateNotificationRule;
  weather: WeatherDetails;
}): Promise<ChannelDeliveryResult> {
  const result: EmailJsSendResult = await sendEmailJsMessage({
    templateId: env.emailJs.climateAlertTemplateId,
    templateParams: {
      to_email: input.to,
      neighborhood: input.neighborhood,
      alert_title: input.rule.title,
      alert_message: input.rule.message,
      rule_key: input.rule.ruleKey,
      precipitation_probability: input.weather.probability ?? "N/A",
      recent_rain_mm: input.weather.recentRainMm,
      action_url: env.appPublicUrl,
    },
  });

  return {
    delivered: result.delivered,
    reason: result.reason,
    metadata: result.metadata,
  };
}

export async function sendAutomatedClimatePush(input: {
  subscriptions: WebPushSubscription[];
  neighborhood: string;
  rule: ClimateNotificationRule;
}): Promise<ChannelDeliveryResult> {
  if (input.subscriptions.length === 0) {
    return {
      delivered: false,
      reason: "NO_PUSH_SUBSCRIPTIONS",
    };
  }

  const payload = {
    title: input.rule.title,
    body: input.rule.message,
    tag: `climate-${input.rule.ruleKey}-${input.neighborhood}`,
    data: {
      neighborhood: input.neighborhood,
      ruleKey: input.rule.ruleKey,
      url: env.appPublicUrl,
    },
  };

  let firstReason: string | null = null;
  let successCount = 0;

  for (const subscription of input.subscriptions) {
    const result = await sendWebPushMessage(subscription, payload);

    if (result.delivered) {
      successCount += 1;
      continue;
    }

    if (result.reason === "WEB_PUSH_NOT_CONFIGURED") {
      return {
        delivered: false,
        reason: result.reason,
      };
    }

    firstReason ??= result.reason;
  }

  if (successCount === 0) {
    return {
      delivered: false,
      reason: firstReason ?? "PUSH_DELIVERY_FAILED",
      metadata: {
        subscriptions: input.subscriptions.length,
      },
    };
  }

  return {
    delivered: true,
    reason: null,
    metadata: {
      deliveredSubscriptions: successCount,
    },
  };
}
