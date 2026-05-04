import { env } from "../config/env";
import type { DeviceType } from "../types/userPreference";
import { getErrorMessage } from "../utils/errorMessage";
import {
  ensureBrowserPushSubscription,
  isBrowserPushSupported,
  removeBrowserPushSubscription,
  serializeSubscription,
  type SerializedPushSubscription,
} from "./browserPushClient";
import {
  registerPushSubscription,
  unregisterPushSubscription,
} from "./pushSubscriptionService";

type DesiredPushState = {
  desiredEnabled: boolean;
  deviceType: DeviceType;
};

export type PreparedPushSubscription = {
  effectiveEnabled: boolean;
  subscription: SerializedPushSubscription | null;
  errorMessage: string | null;
};

const FALLBACK_PREPARE_ERROR = "Não foi possível ativar as notificações push.";
const FALLBACK_FINALIZE_ERROR =
  "Não foi possível registrar a inscrição de push no servidor.";

export async function preparePushSubscription(
  state: DesiredPushState,
): Promise<PreparedPushSubscription> {
  if (state.deviceType !== "MOBILE" || !state.desiredEnabled) {
    return { effectiveEnabled: false, subscription: null, errorMessage: null };
  }

  if (!isBrowserPushSupported()) {
    return {
      effectiveEnabled: false,
      subscription: null,
      errorMessage:
        "Notificações push não são suportadas neste dispositivo ou navegador.",
    };
  }

  if (!env.vapidPublicKey) {
    return {
      effectiveEnabled: false,
      subscription: null,
      errorMessage:
        "Notificações push indisponíveis: chave pública VAPID não configurada.",
    };
  }

  try {
    const subscription = await ensureBrowserPushSubscription(env.vapidPublicKey);

    return {
      effectiveEnabled: true,
      subscription: serializeSubscription(subscription),
      errorMessage: null,
    };
  } catch (error) {
    return {
      effectiveEnabled: false,
      subscription: null,
      errorMessage: getErrorMessage(error, FALLBACK_PREPARE_ERROR),
    };
  }
}

export async function finalizePushSubscription(input: {
  anonymousId: string;
  prepared: PreparedPushSubscription;
}): Promise<string | null> {
  if (input.prepared.effectiveEnabled && input.prepared.subscription) {
    try {
      await registerPushSubscription({
        anonymousId: input.anonymousId,
        subscription: input.prepared.subscription,
      });

      return null;
    } catch (error) {
      await removeBrowserPushSubscription().catch(() => undefined);

      return getErrorMessage(error, FALLBACK_FINALIZE_ERROR);
    }
  }

  await Promise.allSettled([
    removeBrowserPushSubscription(),
    unregisterPushSubscription(input.anonymousId),
  ]);

  return null;
}
