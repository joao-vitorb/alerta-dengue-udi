import type { LocalExperience, UserPreference } from "../types/userPreference";
import { generateAnonymousId, getDeviceType } from "./device";

const STORAGE_KEY = "alerta-dengue-udi:experience";

function canUseStorage() {
  return (
    typeof window !== "undefined" && typeof window.localStorage !== "undefined"
  );
}

export function createInitialLocalExperience(): LocalExperience {
  return {
    hasVisited: true,
    hasCompletedOnboarding: false,
    anonymousId: generateAnonymousId(),
    neighborhood: "",
    email: "",
    notificationsEnabled: false,
    emailNotificationsEnabled: false,
    pushNotificationsEnabled: false,
    deviceType: getDeviceType(),
  };
}

export function getLocalExperience() {
  if (!canUseStorage()) {
    return null;
  }

  const rawValue = window.localStorage.getItem(STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as LocalExperience;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function saveLocalExperience(experience: LocalExperience) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(experience));
}

export function mapUserPreferenceToLocalExperience(
  userPreference: UserPreference,
): LocalExperience {
  return {
    hasVisited: true,
    hasCompletedOnboarding: true,
    anonymousId: userPreference.anonymousId,
    neighborhood: userPreference.neighborhood,
    email: userPreference.email ?? "",
    notificationsEnabled: userPreference.notificationsEnabled,
    emailNotificationsEnabled: userPreference.emailNotificationsEnabled,
    pushNotificationsEnabled: userPreference.pushNotificationsEnabled,
    deviceType: userPreference.deviceType,
  };
}
