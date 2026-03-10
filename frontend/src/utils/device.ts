import type { DeviceType } from "../types/userPreference";

export function getDeviceType(): DeviceType {
  if (typeof navigator === "undefined") {
    return "DESKTOP";
  }

  return /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent)
    ? "MOBILE"
    : "DESKTOP";
}

export function generateAnonymousId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return `anon-${crypto.randomUUID()}`;
  }

  return `anon-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
