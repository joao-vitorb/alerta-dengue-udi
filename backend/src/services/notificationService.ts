import type { UserPreference } from "../generated/prisma/client";
import { AppError } from "../errors/AppError";
import { logger } from "../lib/logger";
import { prisma } from "../lib/prisma";
import {
  listActivePushSubscriptions,
  sendAutomatedClimateEmail,
  sendAutomatedClimatePush,
} from "./climateNotificationDeliveryService";
import type { ClimateNotificationRule } from "./climateNotificationRuleService";
import { getWeatherPreventionContext } from "./weatherService";

type TestChannel = "EMAIL" | "PUSH";

type WeatherSummary = {
  probability: number | null;
  recentRainMm: number;
};

type ScheduleTestNotificationResult = {
  channel: TestChannel;
  scheduledInSeconds: number;
};

const PUSH_DELAY_SECONDS = 15;

const testLogger = logger.child({ module: "test-notifications" });

export async function scheduleTestNotification(input: {
  anonymousId: string;
  channel: TestChannel;
}): Promise<ScheduleTestNotificationResult> {
  const preference = await loadUserPreference(input.anonymousId);

  if (input.channel === "EMAIL") {
    return handleEmailRequest(preference);
  }

  return handlePushRequest(preference);
}

async function loadUserPreference(
  anonymousId: string,
): Promise<UserPreference> {
  const preference = await prisma.userPreference.findUnique({
    where: { anonymousId },
  });

  if (!preference) {
    throw new AppError("User preference not found", 404);
  }

  return preference;
}

async function handleEmailRequest(
  preference: UserPreference,
): Promise<ScheduleTestNotificationResult> {
  assertEmailChannelEnabled(preference);
  await deliverTestEmail(preference);

  return { channel: "EMAIL", scheduledInSeconds: 0 };
}

async function handlePushRequest(
  preference: UserPreference,
): Promise<ScheduleTestNotificationResult> {
  assertPushChannelEnabled(preference);
  await assertPushSubscriptionRegistered(preference.anonymousId);

  scheduleDelayedPushDelivery(preference.anonymousId);

  return { channel: "PUSH", scheduledInSeconds: PUSH_DELAY_SECONDS };
}

function assertEmailChannelEnabled(preference: UserPreference): void {
  if (!preference.emailNotificationsEnabled || !preference.email) {
    throw new AppError(
      "Email notifications are not enabled for this user.",
      400,
    );
  }
}

function assertPushChannelEnabled(preference: UserPreference): void {
  if (!preference.pushNotificationsEnabled) {
    throw new AppError(
      "Push notifications are not enabled for this user.",
      400,
    );
  }
}

async function assertPushSubscriptionRegistered(
  anonymousId: string,
): Promise<void> {
  const subscriptions = await listActivePushSubscriptions(anonymousId);

  if (subscriptions.length === 0) {
    throw new AppError("Push subscription is not registered.", 400);
  }
}

function scheduleDelayedPushDelivery(anonymousId: string): void {
  setTimeout(() => {
    void deliverTestPush(anonymousId).catch((error) => {
      testLogger.error(
        { err: error, anonymousId },
        "Failed to deliver test push notification",
      );
    });
  }, PUSH_DELAY_SECONDS * 1000).unref();
}

async function deliverTestEmail(preference: UserPreference): Promise<void> {
  if (!preference.email) return;

  const weather = await loadWeatherSummary(preference.neighborhood);

  await sendAutomatedClimateEmail({
    to: preference.email,
    neighborhood: preference.neighborhood,
    rule: buildTestRule(preference.neighborhood),
    weather,
  });
}

async function deliverTestPush(anonymousId: string): Promise<void> {
  const preference = await prisma.userPreference.findUnique({
    where: { anonymousId },
  });

  if (!preference) return;

  const subscriptions = await listActivePushSubscriptions(anonymousId);
  if (subscriptions.length === 0) return;

  await sendAutomatedClimatePush({
    subscriptions,
    neighborhood: preference.neighborhood,
    rule: buildTestRule(preference.neighborhood),
  });
}

function buildTestRule(neighborhood: string): ClimateNotificationRule {
  return {
    ruleKey: "TEST",
    title: `Notificação de teste — ${neighborhood}`,
    message:
      "Este é um envio de teste solicitado a partir das suas preferências. " +
      "Quando uma regra climática real disparar, você receberá um alerta com recomendações preventivas para o seu bairro.",
    severity: "attention",
  };
}

async function loadWeatherSummary(
  neighborhood: string,
): Promise<WeatherSummary> {
  try {
    const context = await getWeatherPreventionContext(neighborhood);
    return {
      probability: context.today.precipitationProbabilityMax,
      recentRainMm: context.recent.pastThreeDaysPrecipitationSumMm,
    };
  } catch {
    return { probability: null, recentRainMm: 0 };
  }
}
