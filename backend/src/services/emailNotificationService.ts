import { env } from "../config/env";

type SendEmailNotificationInput = {
  to: string;
  subject: string;
  text: string;
  neighborhood: string;
};

type NotificationDeliveryResult = {
  attempted: boolean;
  delivered: boolean;
  simulated: boolean;
  reason: string | null;
};

type EmailJsResponse = {
  status?: number;
  text?: string;
};

function isEmailJsConfigured() {
  return Boolean(
    env.emailJsServiceId &&
    env.emailJsTemplateId &&
    env.emailJsPublicKey &&
    env.emailJsPrivateKey,
  );
}

export async function sendEmailNotification(
  input: SendEmailNotificationInput,
): Promise<NotificationDeliveryResult> {
  if (!isEmailJsConfigured()) {
    return {
      attempted: true,
      delivered: false,
      simulated: true,
      reason: "EmailJS is not configured",
    };
  }

  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      service_id: env.emailJsServiceId,
      template_id: env.emailJsTemplateId,
      user_id: env.emailJsPublicKey,
      accessToken: env.emailJsPrivateKey,
      template_params: {
        to_email: input.to,
        subject: input.subject,
        message: input.text,
        neighborhood: input.neighborhood,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response
      .text()
      .catch(() => "EmailJS request failed");

    return {
      attempted: true,
      delivered: false,
      simulated: false,
      reason: errorText,
    };
  }

  const data = (await response.text().catch(() => "OK")) as string;

  return {
    attempted: true,
    delivered: true,
    simulated: false,
    reason: data || null,
  };
}
