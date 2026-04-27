import { env } from "../config/env";

export type EmailJsSendResult = {
  delivered: boolean;
  reason: string | null;
  metadata?: Record<string, unknown>;
};

type EmailJsRequest = {
  templateId: string;
  templateParams: Record<string, unknown>;
};

const EMAIL_JS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

function hasEmailJsCredentials(templateId: string) {
  return Boolean(
    env.emailJs.serviceId &&
    templateId &&
    env.emailJs.publicKey &&
    env.emailJs.privateKey,
  );
}

export async function sendEmailJsMessage(
  request: EmailJsRequest,
): Promise<EmailJsSendResult> {
  if (!hasEmailJsCredentials(request.templateId)) {
    return {
      delivered: false,
      reason: "EMAILJS_NOT_CONFIGURED",
    };
  }

  const response = await fetch(EMAIL_JS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      service_id: env.emailJs.serviceId,
      template_id: request.templateId,
      user_id: env.emailJs.publicKey,
      accessToken: env.emailJs.privateKey,
      template_params: request.templateParams,
    }),
  });

  if (!response.ok) {
    const failureText = await response.text().catch(() => "");

    return {
      delivered: false,
      reason: "EMAILJS_REQUEST_FAILED",
      metadata: {
        status: response.status,
        response: failureText,
      },
    };
  }

  const responseText = await response.text().catch(() => "OK");

  return {
    delivered: true,
    reason: null,
    metadata: responseText ? { response: responseText } : undefined,
  };
}
