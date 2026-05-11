const STORAGE_KEY = "alerta-dengue-udi:geolocation-allowed";
const CHANGE_EVENT = "alerta-dengue-udi:geolocation-allowed-change";

function canUseStorage(): boolean {
  return (
    typeof window !== "undefined" && typeof window.localStorage !== "undefined"
  );
}

export function getGeolocationAllowed(): boolean {
  if (!canUseStorage()) return false;
  return window.localStorage.getItem(STORAGE_KEY) === "true";
}

export function saveGeolocationAllowed(value: boolean): void {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, value ? "true" : "false");
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

export function subscribeToGeolocationAllowedChanges(
  listener: () => void,
): () => void {
  if (typeof window === "undefined") return () => undefined;

  window.addEventListener(CHANGE_EVENT, listener);
  return () => window.removeEventListener(CHANGE_EVENT, listener);
}
