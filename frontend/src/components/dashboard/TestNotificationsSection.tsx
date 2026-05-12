import { useEffect, useState } from "react";
import {
  requestTestNotification,
  type TestNotificationChannel,
} from "../../services/notificationTestService";
import { getErrorMessage } from "../../utils/errorMessage";

type TestNotificationsSectionProps = {
  anonymousId: string;
  emailAvailable: boolean;
  pushAvailable: boolean;
};

type Status =
  | { kind: "idle" }
  | { kind: "submitting"; channel: TestNotificationChannel }
  | { kind: "emailSent" }
  | { kind: "pushScheduled"; secondsLeft: number }
  | { kind: "error"; message: string };

const FALLBACK_ERROR_MESSAGE =
  "Não foi possível agendar a notificação de teste.";

const PUSH_HELPER_TEXT =
  "Para ver o push chegar, feche o site ou bloqueie a tela do celular após clicar.";

export function TestNotificationsSection({
  anonymousId,
  emailAvailable,
  pushAvailable,
}: TestNotificationsSectionProps) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  usePushCountdown(status, setStatus);

  async function handleSendTest(channel: TestNotificationChannel) {
    setStatus({ kind: "submitting", channel });

    try {
      const response = await requestTestNotification({ anonymousId, channel });

      if (response.scheduledInSeconds === 0) {
        setStatus({ kind: "emailSent" });
        return;
      }

      setStatus({
        kind: "pushScheduled",
        secondsLeft: response.scheduledInSeconds,
      });
    } catch (error) {
      setStatus({
        kind: "error",
        message: getErrorMessage(error, FALLBACK_ERROR_MESSAGE),
      });
    }
  }

  const isBusy =
    status.kind === "submitting" || status.kind === "pushScheduled";

  return (
    <div className="rounded-xl border border-border-card bg-surface-muted px-3 py-3 sm:rounded-2xl sm:px-4 sm:py-4">
      <p className="text-[14px] font-semibold text-text-primary sm:text-[15px]">
        Testar notificações
      </p>
      <p className="mt-1 text-[12px] leading-5 text-text-secondary sm:text-[13px]">
        Envia uma notificação real para você verificar a entrega.
      </p>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <TestChannelButton
          label="Enviar email de teste"
          targetChannel="EMAIL"
          status={status}
          disabled={!emailAvailable || isBusy}
          onClick={() => void handleSendTest("EMAIL")}
        />

        <TestChannelButton
          label="Enviar push de teste"
          targetChannel="PUSH"
          status={status}
          disabled={!pushAvailable || isBusy}
          onClick={() => void handleSendTest("PUSH")}
        />
      </div>

      {pushAvailable ? (
        <p className="mt-2 text-[12px] leading-5 text-text-secondary sm:text-[13px]">
          {PUSH_HELPER_TEXT}
        </p>
      ) : null}

      <StatusFeedback status={status} />
    </div>
  );
}

type TestChannelButtonProps = {
  label: string;
  targetChannel: TestNotificationChannel;
  status: Status;
  disabled: boolean;
  onClick: () => void;
};

function TestChannelButton({
  label,
  targetChannel,
  status,
  disabled,
  onClick,
}: TestChannelButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-12 flex-1 items-center justify-center rounded-lg border border-border-card bg-white px-3 text-[13px] font-semibold text-text-primary transition cursor-pointer hover:bg-page-bg disabled:cursor-not-allowed disabled:opacity-50 sm:h-13 sm:rounded-xl sm:text-[14px]"
    >
      {resolveButtonLabel(status, targetChannel, label)}
    </button>
  );
}

function StatusFeedback({ status }: { status: Status }) {
  if (status.kind === "emailSent") {
    return (
      <p className="mt-2 text-[12px] leading-5 text-brand-green sm:text-[13px]">
        Email enviado! Confira sua caixa de entrada nos próximos segundos.
      </p>
    );
  }

  if (status.kind === "pushScheduled") {
    return (
      <p className="mt-2 text-[12px] leading-5 text-brand-green sm:text-[13px]">
        Notificação push agendada. Chegará em {status.secondsLeft}s — feche o
        site ou bloqueie a tela para vê-la.
      </p>
    );
  }

  if (status.kind === "error") {
    return (
      <p className="mt-2 text-[12px] leading-5 text-error-text sm:text-[13px]">
        {status.message}
      </p>
    );
  }

  return null;
}

function resolveButtonLabel(
  status: Status,
  targetChannel: TestNotificationChannel,
  idleLabel: string,
): string {
  if (
    status.kind === "submitting" &&
    status.channel === targetChannel
  ) {
    return targetChannel === "EMAIL" ? "Enviando..." : "Agendando...";
  }

  if (status.kind === "pushScheduled" && targetChannel === "PUSH") {
    return `Aguarde ${status.secondsLeft}s`;
  }

  return idleLabel;
}

function usePushCountdown(
  status: Status,
  setStatus: (next: Status) => void,
) {
  useEffect(() => {
    if (status.kind !== "pushScheduled") return;

    if (status.secondsLeft <= 0) {
      setStatus({ kind: "idle" });
      return;
    }

    const timer = window.setTimeout(() => {
      setStatus({
        kind: "pushScheduled",
        secondsLeft: status.secondsLeft - 1,
      });
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [status, setStatus]);
}
