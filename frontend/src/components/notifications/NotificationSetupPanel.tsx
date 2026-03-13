import { useState } from "react";
import { usePushNotifications } from "../../hooks/usePushNotifications";
import { sendTestNotification } from "../../services/notificationService";
import type { TestNotificationResponse } from "../../types/notification";
import type { LocalExperience } from "../../types/userPreference";

type NotificationSetupPanelProps = {
  experience?: LocalExperience | null;
};

function formatDeliveryLabel(result: {
  attempted: boolean;
  delivered: boolean;
  simulated: boolean;
  reason: string | null;
}) {
  if (!result.attempted) {
    return result.reason ?? "Canal não utilizado";
  }

  if (result.delivered) {
    return "Enviado com sucesso";
  }

  if (result.simulated) {
    return result.reason ?? "Envio simulado";
  }

  return result.reason ?? "Falha no envio";
}

export function NotificationSetupPanel({
  experience,
}: NotificationSetupPanelProps) {
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<TestNotificationResponse | null>(
    null,
  );
  const [isSendingTest, setIsSendingTest] = useState(false);

  const {
    isSubscribed,
    isBusy,
    isAvailable,
    subscribe,
    unsubscribe,
  } = usePushNotifications({
    anonymousId: experience?.anonymousId,
    deviceType: experience?.deviceType,
    pushPreferenceEnabled: Boolean(experience?.pushNotificationsEnabled),
  });

  if (!experience?.hasCompletedOnboarding) {
    return null;
  }

  async function handleSubscribe() {
    const result = await subscribe();
    setFeedbackMessage(result.message);
  }

  async function handleUnsubscribe() {
    const result = await unsubscribe();
    setFeedbackMessage(result.message);
  }

  async function handleSendTest() {
    if (!experience?.anonymousId) {
      return;
    }

    setIsSendingTest(true);
    setFeedbackMessage(null);

    try {
      const result = await sendTestNotification(experience.anonymousId);
      setTestResult(result);
    } catch (error) {
      setFeedbackMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível enviar a notificação de teste.",
      );
      setTestResult(null);
    } finally {
      setIsSendingTest(false);
    }
  }

  return (
    <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">
            Notificações
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900">
            Canais de aviso do sistema
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Desktop usa email. Mobile pode usar email e push conforme suas
            preferências.
          </p>
        </div>

        <div className="grid gap-2 text-sm text-slate-700">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            Dispositivo:{" "}
            {experience.deviceType === "MOBILE" ? "Mobile" : "Desktop"}
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            Email:{" "}
            {experience.emailNotificationsEnabled ? "Ativado" : "Desativado"}
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            Push:{" "}
            {experience.pushNotificationsEnabled
              ? "Ativado"
              : "Desativado"}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void handleSubscribe()}
          disabled={!isAvailable || isBusy}
          className="inline-flex rounded-full bg-sky-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isBusy ? "Processando..." : "Ativar push"}
        </button>

        <button
          type="button"
          onClick={() => void handleUnsubscribe()}
          disabled={!isSubscribed || isBusy}
          className="inline-flex rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
        >
          Remover push
        </button>

        <button
          type="button"
          onClick={() => void handleSendTest()}
          disabled={isSendingTest}
          className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-5 py-3 text-sm font-medium text-sky-700 transition hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSendingTest ? "Enviando teste..." : "Enviar notificação de teste"}
        </button>
      </div>

      {feedbackMessage ? (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          {feedbackMessage}
        </div>
      ) : null}

      {testResult ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
              Email
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              {formatDeliveryLabel(testResult.email)}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
              Push
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              {formatDeliveryLabel(testResult.push)}
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
