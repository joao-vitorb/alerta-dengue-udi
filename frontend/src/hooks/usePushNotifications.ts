import { useEffect, useState } from "react";
import { env } from "../config/env";
import {
  deletePushSubscription,
  upsertPushSubscription,
} from "../services/pushSubscriptionService";
import type { DeviceType } from "../types/userPreference";
import { isPushSupported, urlBase64ToUint8Array } from "../utils/push";

type SubscribeResult = {
  ok: boolean;
  message: string;
};

export function usePushNotifications(input: {
  anonymousId?: string;
  deviceType?: DeviceType;
  pushPreferenceEnabled: boolean;
}) {
  const [permission, setPermission] = useState<
    NotificationPermission | "unsupported"
  >(isPushSupported() ? Notification.permission : "unsupported");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  const isMobile = input.deviceType === "MOBILE";
  const isAvailable =
    isMobile &&
    input.pushPreferenceEnabled &&
    Boolean(input.anonymousId) &&
    Boolean(env.vapidPublicKey) &&
    isPushSupported();

  useEffect(() => {
    let isMounted = true;

    async function loadSubscriptionState() {
      if (!isPushSupported()) {
        if (isMounted) {
          setPermission("unsupported");
          setIsSubscribed(false);
        }
        return;
      }

      setPermission(Notification.permission);

      const registration =
        await navigator.serviceWorker.register("/push-sw.js");
      const currentSubscription =
        await registration.pushManager.getSubscription();

      if (isMounted) {
        setIsSubscribed(Boolean(currentSubscription));
      }
    }

    void loadSubscriptionState();

    return () => {
      isMounted = false;
    };
  }, []);

  async function subscribe(): Promise<SubscribeResult> {
    if (!isAvailable || !input.anonymousId) {
      return {
        ok: false,
        message: "Push indisponível neste dispositivo ou configuração atual.",
      };
    }

    setIsBusy(true);

    try {
      const nextPermission =
        Notification.permission === "granted"
          ? "granted"
          : await Notification.requestPermission();

      setPermission(nextPermission);

      if (nextPermission !== "granted") {
        return {
          ok: false,
          message: "Permissão de notificação não concedida.",
        };
      }

      const registration =
        await navigator.serviceWorker.register("/push-sw.js");

      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(env.vapidPublicKey),
        });
      }

      const keys = subscription.toJSON().keys;

      if (!keys?.p256dh || !keys.auth) {
        return {
          ok: false,
          message: "Não foi possível extrair as chaves da assinatura push.",
        };
      }

      await upsertPushSubscription({
        anonymousId: input.anonymousId,
        subscription: {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: keys.p256dh,
            auth: keys.auth,
          },
          userAgent: navigator.userAgent,
        },
      });

      setIsSubscribed(true);

      return {
        ok: true,
        message: "Push configurado com sucesso.",
      };
    } catch (error) {
      return {
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "Não foi possível ativar o push.",
      };
    } finally {
      setIsBusy(false);
    }
  }

  async function unsubscribe(): Promise<SubscribeResult> {
    if (!input.anonymousId || !isPushSupported()) {
      return {
        ok: false,
        message: "Push indisponível neste dispositivo.",
      };
    }

    setIsBusy(true);

    try {
      const registration =
        await navigator.serviceWorker.register("/push-sw.js");
      const currentSubscription =
        await registration.pushManager.getSubscription();

      if (currentSubscription) {
        await currentSubscription.unsubscribe();
      }

      await deletePushSubscription(input.anonymousId);
      setIsSubscribed(false);

      return {
        ok: true,
        message: "Push removido com sucesso.",
      };
    } catch (error) {
      return {
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "Não foi possível remover o push.",
      };
    } finally {
      setIsBusy(false);
    }
  }

  return {
    permission,
    isSubscribed,
    isBusy,
    isAvailable,
    subscribe,
    unsubscribe,
  };
}
