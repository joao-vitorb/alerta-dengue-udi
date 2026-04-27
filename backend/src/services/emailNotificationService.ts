import { env } from "../config/env";
import { sendEmailJsMessage } from "../infra/emailJsClient";

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

export async function sendEmailNotification(
  input: SendEmailNotificationInput,
): Promise<NotificationDeliveryResult> {
  const result = await sendEmailJsMessage({
    templateId: env.emailJs.templateId,
    templateParams: {
      to_email: input.to,
      subject: input.subject,
      message: input.text,
      neighborhood: input.neighborhood,
    },
  });

  if (result.reason === "EMAILJS_NOT_CONFIGURED") {
    return {
      attempted: true,
      delivered: false,
      simulated: true,
      reason: "EmailJS is not configured",
    };
  }

  return {
    attempted: true,
    delivered: result.delivered,
    simulated: false,
    reason: result.delivered
      ? typeof result.metadata?.response === "string"
        ? result.metadata.response
        : null
      : (result.reason ?? "EmailJS request failed"),
  };
}
