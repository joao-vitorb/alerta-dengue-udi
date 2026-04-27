import type { UserPreference } from "../generated/prisma/client";
import { AppError } from "../errors/AppError";
import { prisma } from "../lib/prisma";
import { sendEmailNotification } from "./emailNotificationService";
import { getPreventiveAlertsByNeighborhood } from "./preventiveAlertService";
import { sendPushNotification } from "./pushNotificationService";

type AlertSummary = {
  title: string;
  recommendation: string;
};

type NotificationChannelResult = {
  attempted: boolean;
  delivered: boolean;
  simulated: boolean;
  reason: string | null;
};

const DISABLED_EMAIL_RESULT: NotificationChannelResult = {
  attempted: false,
  delivered: false,
  simulated: false,
  reason: "Email channel not enabled",
};

const DISABLED_PUSH_RESULT: NotificationChannelResult = {
  attempted: false,
  delivered: false,
  simulated: false,
  reason: "Push channel not enabled",
};

const MISSING_PUSH_SUBSCRIPTION_RESULT: NotificationChannelResult = {
  attempted: false,
  delivered: false,
  simulated: false,
  reason: "Push subscription not found",
};

function buildEmailBody(input: {
  neighborhood: string;
  alerts: AlertSummary[];
}) {
  const headline =
    input.alerts[0]?.title ?? "Atualização preventiva disponível";
  const recommendations = input.alerts
    .slice(0, 3)
    .map(
      (alert, index) => `${index + 1}. ${alert.title}\n${alert.recommendation}`,
    )
    .join("\n\n");

  return [
    "Alerta Dengue UDI",
    "",
    `Bairro: ${input.neighborhood}`,
    `Resumo: ${headline}`,
    "",
    recommendations || "Sem recomendações detalhadas no momento.",
    "",
    "Este envio é informativo e preventivo.",
  ].join("\n");
}

function buildPushPayload(input: {
  neighborhood: string;
  title: string;
  recommendation: string;
}) {
  return {
    title: "Alerta Dengue UDI",
    body: `${input.neighborhood}: ${input.title}. ${input.recommendation}`,
    url: "/",
  };
}

async function sendTestEmail(
  preference: UserPreference,
  alerts: AlertSummary[],
): Promise<NotificationChannelResult> {
  if (!preference.emailNotificationsEnabled || !preference.email) {
    return DISABLED_EMAIL_RESULT;
  }

  return sendEmailNotification({
    to: preference.email,
    subject: `Alerta Dengue UDI - ${preference.neighborhood}`,
    text: buildEmailBody({
      neighborhood: preference.neighborhood,
      alerts,
    }),
    neighborhood: preference.neighborhood,
  });
}

async function sendTestPush(
  preference: UserPreference,
  primaryAlert: AlertSummary,
): Promise<NotificationChannelResult> {
  if (
    preference.deviceType !== "MOBILE" ||
    !preference.pushNotificationsEnabled
  ) {
    return DISABLED_PUSH_RESULT;
  }

  const subscription = await prisma.pushSubscription.findUnique({
    where: { anonymousId: preference.anonymousId },
  });

  if (!subscription) {
    return MISSING_PUSH_SUBSCRIPTION_RESULT;
  }

  return sendPushNotification(
    {
      endpoint: subscription.endpoint,
      p256dh: subscription.p256dh,
      auth: subscription.auth,
    },
    buildPushPayload({
      neighborhood: preference.neighborhood,
      title: primaryAlert.title,
      recommendation: primaryAlert.recommendation,
    }),
  );
}

export async function sendTestNotification(anonymousId: string) {
  const preference = await prisma.userPreference.findUnique({
    where: { anonymousId },
  });

  if (!preference) {
    throw new AppError("User preference not found", 404);
  }

  const alertsResult = await getPreventiveAlertsByNeighborhood(
    preference.neighborhood,
  );
  const primaryAlert = alertsResult.alerts[0];

  if (!primaryAlert) {
    throw new AppError("No preventive alerts available", 404);
  }

  const alerts: AlertSummary[] = alertsResult.alerts.map((alert) => ({
    title: alert.title,
    recommendation: alert.recommendation,
  }));

  const [emailResult, pushResult] = await Promise.all([
    sendTestEmail(preference, alerts),
    sendTestPush(preference, primaryAlert),
  ]);

  return {
    anonymousId,
    neighborhood: preference.neighborhood,
    alertsCount: alertsResult.alerts.length,
    email: emailResult,
    push: pushResult,
  };
}
