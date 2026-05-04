import { arrayBufferToBase64, urlBase64ToUint8Array } from "../utils/pushEncoding";

const SERVICE_WORKER_PATH = "/push-sw.js";

export type SerializedPushSubscription = {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  userAgent?: string;
};

export function isBrowserPushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

async function getOrRegisterServiceWorker(): Promise<ServiceWorkerRegistration> {
  const existing = await navigator.serviceWorker.getRegistration(
    SERVICE_WORKER_PATH,
  );

  if (existing) return existing;

  return navigator.serviceWorker.register(SERVICE_WORKER_PATH);
}

async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (Notification.permission !== "default") {
    return Notification.permission;
  }

  return Notification.requestPermission();
}

export function serializeSubscription(
  subscription: PushSubscription,
): SerializedPushSubscription {
  return {
    endpoint: subscription.endpoint,
    keys: {
      p256dh: arrayBufferToBase64(subscription.getKey("p256dh")),
      auth: arrayBufferToBase64(subscription.getKey("auth")),
    },
    userAgent:
      typeof navigator !== "undefined" ? navigator.userAgent : undefined,
  };
}

function applicationServerKeysMatch(
  subscription: PushSubscription,
  expectedKey: Uint8Array,
): boolean {
  const stored = subscription.options.applicationServerKey;
  if (!stored) return false;

  const storedBytes = new Uint8Array(stored);
  if (storedBytes.byteLength !== expectedKey.byteLength) return false;

  for (let index = 0; index < storedBytes.byteLength; index += 1) {
    if (storedBytes[index] !== expectedKey[index]) return false;
  }

  return true;
}

export async function ensureBrowserPushSubscription(
  vapidPublicKey: string,
): Promise<PushSubscription> {
  const permission = await requestNotificationPermission();

  if (permission !== "granted") {
    throw new Error(
      "Permissão de notificação não concedida. Habilite nas configurações do navegador.",
    );
  }

  const registration = await getOrRegisterServiceWorker();
  await navigator.serviceWorker.ready;

  const expectedKey = urlBase64ToUint8Array(vapidPublicKey);
  const existing = await registration.pushManager.getSubscription();

  if (existing) {
    if (applicationServerKeysMatch(existing, expectedKey)) {
      return existing;
    }

    await existing.unsubscribe();
  }

  return registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: expectedKey,
  });
}

export async function removeBrowserPushSubscription(): Promise<void> {
  if (!isBrowserPushSupported()) return;

  const registration = await navigator.serviceWorker.getRegistration(
    SERVICE_WORKER_PATH,
  );

  if (!registration) return;

  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) return;

  await subscription.unsubscribe();
}
