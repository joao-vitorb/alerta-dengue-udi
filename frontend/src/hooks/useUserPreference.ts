import { useEffect, useState } from "react";
import { ApiError } from "../errors/ApiError";
import {
  finalizePushSubscription,
  preparePushSubscription,
} from "../services/pushSubscriptionSyncService";
import {
  getUserPreferenceByAnonymousId,
  updateUserPreference,
  upsertUserPreference,
} from "../services/userPreferenceService";
import type {
  CreateUserPreferencePayload,
  LocalExperience,
  PreferenceFormValues,
  UpdateUserPreferencePayload,
  UserPreference,
} from "../types/userPreference";
import { getErrorMessage } from "../utils/errorMessage";
import {
  createInitialLocalExperience,
  getLocalExperience,
  mapUserPreferenceToLocalExperience,
  saveLocalExperience,
} from "../utils/localStorage";

const FALLBACK_ERROR_MESSAGE = "Não foi possível concluir a operação.";

function buildCreatePayload(
  experience: LocalExperience,
  values: PreferenceFormValues,
): CreateUserPreferencePayload {
  return {
    anonymousId: experience.anonymousId,
    neighborhood: values.neighborhood,
    email: values.email.trim() || undefined,
    notificationsEnabled: values.notificationsEnabled,
    emailNotificationsEnabled: values.emailNotificationsEnabled,
    pushNotificationsEnabled: values.pushNotificationsEnabled,
    deviceType: experience.deviceType,
  };
}

function buildUpdatePayload(
  values: PreferenceFormValues,
): UpdateUserPreferencePayload {
  return {
    neighborhood: values.neighborhood,
    email: values.email.trim() || undefined,
    notificationsEnabled: values.notificationsEnabled,
    emailNotificationsEnabled: values.emailNotificationsEnabled,
    pushNotificationsEnabled: values.pushNotificationsEnabled,
  };
}

function experienceToCreatePayload(
  experience: LocalExperience,
): CreateUserPreferencePayload {
  return {
    anonymousId: experience.anonymousId,
    neighborhood: experience.neighborhood,
    email: experience.email.trim() || undefined,
    notificationsEnabled: experience.notificationsEnabled,
    emailNotificationsEnabled: experience.emailNotificationsEnabled,
    pushNotificationsEnabled: experience.pushNotificationsEnabled,
    deviceType: experience.deviceType,
  };
}

function loadOrCreateExperience(): LocalExperience {
  const stored = getLocalExperience();
  if (stored) return stored;

  const created = createInitialLocalExperience();
  saveLocalExperience(created);
  return created;
}

async function fetchOrRecreatePreference(experience: LocalExperience) {
  try {
    return await getUserPreferenceByAnonymousId(experience.anonymousId);
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) {
      return upsertUserPreference(experienceToCreatePayload(experience));
    }
    throw error;
  }
}

export function useUserPreference() {
  const [experience, setExperience] = useState<LocalExperience | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function initialize() {
      const currentExperience = loadOrCreateExperience();

      if (!isMounted) return;

      setExperience(currentExperience);
      setIsOnboardingOpen(!currentExperience.hasCompletedOnboarding);

      if (!currentExperience.hasCompletedOnboarding) return;

      try {
        const preference = await fetchOrRecreatePreference(currentExperience);
        if (!isMounted) return;

        const syncedExperience = mapUserPreferenceToLocalExperience(preference);
        saveLocalExperience(syncedExperience);
        setExperience(syncedExperience);
      } catch (error) {
        if (!isMounted) return;
        setErrorMessage(getErrorMessage(error, FALLBACK_ERROR_MESSAGE));
      }
    }

    void initialize();

    return () => {
      isMounted = false;
    };
  }, []);

  async function persistPreference(
    savePreference: () => Promise<UserPreference>,
  ): Promise<UserPreference | null> {
    if (!experience) return null;

    setIsSaving(true);
    setErrorMessage(null);

    try {
      const savedPreference = await savePreference();
      const nextExperience =
        mapUserPreferenceToLocalExperience(savedPreference);

      saveLocalExperience(nextExperience);
      setExperience(nextExperience);

      return savedPreference;
    } catch (error) {
      setErrorMessage(getErrorMessage(error, FALLBACK_ERROR_MESSAGE));
      return null;
    } finally {
      setIsSaving(false);
    }
  }

  async function persistWithPushSync(
    values: PreferenceFormValues,
    saveFn: (
      currentExperience: LocalExperience,
      effectiveValues: PreferenceFormValues,
    ) => Promise<UserPreference>,
  ) {
    if (!experience) return;

    const currentExperience = experience;
    const prepared = await preparePushSubscription({
      desiredEnabled: values.pushNotificationsEnabled,
      deviceType: currentExperience.deviceType,
    });

    const effectiveValues: PreferenceFormValues = {
      ...values,
      pushNotificationsEnabled: prepared.effectiveEnabled,
    };

    const saved = await persistPreference(() =>
      saveFn(currentExperience, effectiveValues),
    );

    if (!saved) return;

    const finalizeError = await finalizePushSubscription({
      anonymousId: saved.anonymousId,
      prepared,
    });

    const pushError = prepared.errorMessage ?? finalizeError;
    if (pushError) {
      setErrorMessage((current) => current ?? pushError);
    }
  }

  async function submitOnboarding(values: PreferenceFormValues) {
    await persistWithPushSync(values, (currentExperience, effectiveValues) =>
      upsertUserPreference(
        buildCreatePayload(currentExperience, effectiveValues),
      ),
    );
  }

  async function saveSettings(values: PreferenceFormValues) {
    await persistWithPushSync(values, (currentExperience, effectiveValues) =>
      updateUserPreference(
        currentExperience.anonymousId,
        buildUpdatePayload(effectiveValues),
      ),
    );
  }

  function closeOnboarding() {
    if (!experience?.hasCompletedOnboarding) return;
    setIsOnboardingOpen(false);
  }

  return {
    experience,
    isSaving,
    isOnboardingOpen,
    errorMessage,
    submitOnboarding,
    saveSettings,
    closeOnboarding,
  };
}
