import { AppError } from "../errors/AppError";
import { prisma } from "../lib/prisma";
import { getPreventiveAlertsByNeighborhood } from "./preventiveAlertService";
import { sendEmailNotification } from "./emailNotificationService";
import { sendPushNotification } from "./pushNotificationService";

type NotificationChannelResult = {
  attempted: boolean;
  delivered: boolean;
  simulated: boolean;
  reason: string | null;
};

function buildEmailText(input: {
  neighborhood: string;
  alerts: Array<{
    title: string;
    recommendation: string;
  }>;
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

export async function sendTestNotification(anonymousId: string) {
  const userPreference = await prisma.userPreference.findUnique({
    where: {
      anonymousId,
    },
  });

  if (!userPreference) {
    throw new AppError("User preference not found", 404);
  }

  const alertsResult = await getPreventiveAlertsByNeighborhood(
    userPreference.neighborhood,
  );

  const firstAlert = alertsResult.alerts[0];

  if (!firstAlert) {
    throw new AppError("No preventive alerts available", 404);
  }

  let emailResult: NotificationChannelResult = {
    attempted: false,
    delivered: false,
    simulated: false,
    reason: "Email channel not enabled",
  };

  if (userPreference.emailNotificationsEnabled && userPreference.email) {
    emailResult = await sendEmailNotification({
      to: userPreference.email,
      subject: `Alerta Dengue UDI - ${userPreference.neighborhood}`,
      text: buildEmailText({
        neighborhood: userPreference.neighborhood,
        alerts: alertsResult.alerts.map((alert) => ({
          title: alert.title,
          recommendation: alert.recommendation,
        })),
      }),
      neighborhood: userPreference.neighborhood,
    });
  }

  let pushResult: NotificationChannelResult = {
    attempted: false,
    delivered: false,
    simulated: false,
    reason: "Push channel not enabled",
  };

  if (
    userPreference.deviceType === "MOBILE" &&
    userPreference.pushNotificationsEnabled
  ) {
    const pushSubscription = await prisma.pushSubscription.findUnique({
      where: {
        anonymousId,
      },
    });

    if (!pushSubscription) {
      pushResult = {
        attempted: false,
        delivered: false,
        simulated: false,
        reason: "Push subscription not found",
      };
    } else {
      pushResult = await sendPushNotification(
        {
          endpoint: pushSubscription.endpoint,
          p256dh: pushSubscription.p256dh,
          auth: pushSubscription.auth,
        },
        buildPushPayload({
          neighborhood: userPreference.neighborhood,
          title: firstAlert.title,
          recommendation: firstAlert.recommendation,
        }),
      );
    }
  }

  return {
    anonymousId,
    neighborhood: userPreference.neighborhood,
    alertsCount: alertsResult.alerts.length,
    email: emailResult,
    push: pushResult,
  };
}
