import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { neighborhoodOptions } from "../../data/neighborhoodOptions";
import { faSliders } from "../../lib/icons";
import type {
  LocalExperience,
  PreferenceFormValues,
} from "../../types/userPreference";
import { OnboardingToggle } from "../onboarding/OnboardingToggle";
import { DashboardModalShell } from "./DashboardModalShell";

type PreferencesModalProps = {
  isOpen: boolean;
  onClose: () => void;
  experience?: LocalExperience | null;
  initialValues: PreferenceFormValues;
  isSubmitting: boolean;
  errorMessage: string | null;
  onSubmit: (values: PreferenceFormValues) => Promise<void> | void;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(value: string) {
  return EMAIL_PATTERN.test(value.trim());
}

function buildSubmitValues(
  values: PreferenceFormValues,
  isDesktop: boolean,
): PreferenceFormValues {
  const isEmailRequired =
    values.notificationsEnabled && values.emailNotificationsEnabled;

  return {
    ...values,
    pushNotificationsEnabled:
      !isDesktop && values.notificationsEnabled && values.pushNotificationsEnabled,
    emailNotificationsEnabled: isEmailRequired,
    email: isEmailRequired ? values.email.trim() : "",
  };
}

export function PreferencesModal({
  isOpen,
  onClose,
  experience,
  initialValues,
  isSubmitting,
  errorMessage,
  onSubmit,
}: PreferencesModalProps) {
  const [formValues, setFormValues] =
    useState<PreferenceFormValues>(initialValues);
  const [localErrorMessage, setLocalErrorMessage] = useState<string | null>(
    null,
  );

  const isDesktop = experience?.deviceType === "DESKTOP";
  const isEmailRequired =
    formValues.notificationsEnabled && formValues.emailNotificationsEnabled;

  useEffect(() => {
    if (!isOpen) return;
    setFormValues(initialValues);
    setLocalErrorMessage(null);
  }, [isOpen, initialValues]);

  function setField<K extends keyof PreferenceFormValues>(
    key: K,
    value: PreferenceFormValues[K],
  ) {
    setFormValues((current) => ({ ...current, [key]: value }));
  }

  function handleNotificationsEnabledChange(value: boolean) {
    setFormValues((current) => ({
      ...current,
      notificationsEnabled: value,
      pushNotificationsEnabled: value ? current.pushNotificationsEnabled : false,
      emailNotificationsEnabled: value
        ? current.emailNotificationsEnabled
        : false,
    }));
  }

  function validate(): string | null {
    if (!formValues.neighborhood) return "Selecione um bairro.";
    if (isEmailRequired && !formValues.email.trim()) {
      return "Informe um email para receber notificações.";
    }
    if (isEmailRequired && !isValidEmail(formValues.email)) {
      return "Informe um email válido.";
    }
    return null;
  }

  async function handleSave() {
    setLocalErrorMessage(null);
    const validationError = validate();

    if (validationError) {
      setLocalErrorMessage(validationError);
      return;
    }

    await onSubmit(buildSubmitValues(formValues, isDesktop));
  }

  return (
    <DashboardModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Preferências"
      icon={<FontAwesomeIcon icon={faSliders} className="text-[18px]" />}
    >
      <div className="space-y-4 sm:space-y-5">
        <div>
          <label className="mb-2 block text-[14px] font-semibold text-text-primary sm:text-[15px]">
            Bairro
          </label>
          <select
            value={formValues.neighborhood}
            onChange={(event) => setField("neighborhood", event.target.value)}
            className="h-11 w-full rounded-lg border border-[#e3e7eb] bg-[#f6f7f9] px-3 text-[14px] text-text-primary outline-none transition cursor-pointer focus:border-[#0f8f67] sm:h-12 sm:rounded-xl sm:px-4 sm:text-[15px]"
          >
            {neighborhoodOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between gap-3 sm:gap-4">
          <p className="text-[14px] font-semibold text-text-primary sm:text-[15px]">
            Ativar notificações
          </p>

          <OnboardingToggle
            checked={formValues.notificationsEnabled}
            onChange={handleNotificationsEnabledChange}
          />
        </div>

        <div className="flex items-center justify-between gap-3 sm:gap-4">
          <p
            className={`text-[14px] font-semibold sm:text-[15px] ${
              formValues.notificationsEnabled && !isDesktop
                ? "text-text-primary"
                : "text-text-muted"
            }`}
          >
            Notificações push
          </p>

          <OnboardingToggle
            checked={formValues.pushNotificationsEnabled}
            disabled={!formValues.notificationsEnabled || isDesktop}
            onChange={(value) => setField("pushNotificationsEnabled", value)}
          />
        </div>

        <div className="flex items-center justify-between gap-3 sm:gap-4">
          <p
            className={`text-[14px] font-semibold sm:text-[15px] ${
              formValues.notificationsEnabled
                ? "text-text-primary"
                : "text-text-muted"
            }`}
          >
            Notificações por email
          </p>

          <OnboardingToggle
            checked={formValues.emailNotificationsEnabled}
            disabled={!formValues.notificationsEnabled}
            onChange={(value) => setField("emailNotificationsEnabled", value)}
          />
        </div>

        {isEmailRequired ? (
          <div>
            <label className="mb-2 block text-[14px] font-semibold text-text-primary sm:text-[15px]">
              Email
            </label>
            <input
              type="email"
              value={formValues.email}
              onChange={(event) => setField("email", event.target.value)}
              placeholder="Digite seu email"
              className="h-11 w-full rounded-lg border border-[#e3e7eb] bg-[#f6f7f9] px-3 text-[14px] text-text-primary outline-none transition placeholder:text-text-muted focus:border-[#0f8f67] sm:h-12 sm:rounded-xl sm:px-4 sm:text-[15px]"
            />
          </div>
        ) : null}

        {isDesktop ? (
          <p className="text-[13px] leading-5 text-[#768093] sm:text-[14px] sm:leading-6">
            No desktop, o sistema usa somente notificações por email.
          </p>
        ) : null}

        {localErrorMessage || errorMessage ? (
          <div className="rounded-xl border border-error-border bg-error-bg px-3 py-3 text-sm text-error-text sm:rounded-2xl sm:px-4">
            {localErrorMessage ?? errorMessage}
          </div>
        ) : null}

        <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row sm:gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 items-center justify-center rounded-lg border border-border-card bg-white px-4 text-[14px] font-semibold text-text-primary transition cursor-pointer hover:bg-surface-muted sm:rounded-xl sm:px-5 sm:text-[15px]"
          >
            Fechar
          </button>

          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={isSubmitting}
            className="flex h-11 items-center justify-center rounded-lg bg-brand-dark px-5 text-[14px] font-semibold text-white transition cursor-pointer hover:bg-brand-dark-hover disabled:cursor-not-allowed disabled:opacity-70 sm:rounded-xl sm:px-6 sm:text-[15px]"
          >
            {isSubmitting ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </DashboardModalShell>
  );
}
