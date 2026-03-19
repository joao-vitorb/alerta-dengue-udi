import { useEffect, useState } from "react";
import { ApiError } from "../errors/ApiError";
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
import {
  createInitialLocalExperience,
  getLocalExperience,
  mapUserPreferenceToLocalExperience,
  saveLocalExperience,
} from "../utils/localStorage";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Não foi possível concluir a operação.";
}

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

export function useUserPreference() {
  const [experience, setExperience] = useState<LocalExperience | null>(null);
  const [userPreference, setUserPreference] = useState<UserPreference | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function initialize() {
      const storedExperience = getLocalExperience();
      const currentExperience =
        storedExperience ?? createInitialLocalExperience();

      if (!storedExperience) {
        saveLocalExperience(currentExperience);
      }

      if (!isMounted) {
        return;
      }

      setExperience(currentExperience);
      setIsOnboardingOpen(!currentExperience.hasCompletedOnboarding);
      setIsLoading(false);

      if (!currentExperience.hasCompletedOnboarding) {
        return;
      }

      try {
        const remotePreference = await getUserPreferenceByAnonymousId(
          currentExperience.anonymousId,
        );

        if (!isMounted) {
          return;
        }

        const syncedExperience =
          mapUserPreferenceToLocalExperience(remotePreference);

        saveLocalExperience(syncedExperience);
        setExperience(syncedExperience);
        setUserPreference(remotePreference);
      } catch (error) {
        if (error instanceof ApiError && error.statusCode === 404) {
          try {
            const recreatedPreference = await upsertUserPreference({
              anonymousId: currentExperience.anonymousId,
              neighborhood: currentExperience.neighborhood,
              email: currentExperience.email.trim() || undefined,
              notificationsEnabled: currentExperience.notificationsEnabled,
              emailNotificationsEnabled:
                currentExperience.emailNotificationsEnabled,
              pushNotificationsEnabled:
                currentExperience.pushNotificationsEnabled,
              deviceType: currentExperience.deviceType,
            });

            if (!isMounted) {
              return;
            }

            const recreatedExperience =
              mapUserPreferenceToLocalExperience(recreatedPreference);

            saveLocalExperience(recreatedExperience);
            setExperience(recreatedExperience);
            setUserPreference(recreatedPreference);
            return;
          } catch (recreateError) {
            if (!isMounted) {
              return;
            }

            setErrorMessage(getErrorMessage(recreateError));
            return;
          }
        }

        if (!isMounted) {
          return;
        }

        setErrorMessage(getErrorMessage(error));
      }
    }

    void initialize();

    return () => {
      isMounted = false;
    };
  }, []);

  async function submitOnboarding(values: PreferenceFormValues) {
    if (!experience) {
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    try {
      const savedPreference = await upsertUserPreference(
        buildCreatePayload(experience, values),
      );

      const nextExperience =
        mapUserPreferenceToLocalExperience(savedPreference);

      saveLocalExperience(nextExperience);
      setExperience(nextExperience);
      setUserPreference(savedPreference);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  async function saveSettings(values: PreferenceFormValues) {
    if (!experience) {
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    try {
      const savedPreference = await updateUserPreference(
        experience.anonymousId,
        buildUpdatePayload(values),
      );

      const nextExperience =
        mapUserPreferenceToLocalExperience(savedPreference);

      saveLocalExperience(nextExperience);
      setExperience(nextExperience);
      setUserPreference(savedPreference);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  function reopenOnboarding() {
    setIsOnboardingOpen(true);
  }

  function closeOnboarding() {
    if (!experience?.hasCompletedOnboarding) {
      return;
    }

    setIsOnboardingOpen(false);
  }

  return {
    experience,
    userPreference,
    isLoading,
    isSaving,
    isOnboardingOpen,
    errorMessage,
    submitOnboarding,
    saveSettings,
    reopenOnboarding,
    closeOnboarding,
  };
}
