import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { neighborhoodOptions } from "../../data/neighborhoodOptions";
import type {
  LocalExperience,
  PreferenceFormValues,
} from "../../types/userPreference";
import { DashboardModalShell } from "./DashboardModalShell";
import { OnboardingToggle } from "../onboarding/OnboardingToggle";
import { faSliders } from "../../lib/icons";

type PreferencesModalProps = {
  isOpen: boolean;
  onClose: () => void;
  experience?: LocalExperience | null;
  initialValues: PreferenceFormValues;
  isSubmitting: boolean;
  errorMessage: string | null;
  onSubmit: (values: PreferenceFormValues) => Promise<void> | void;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
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

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setFormValues(initialValues);
    setLocalErrorMessage(null);
  }, [isOpen, initialValues]);

  function setField<K extends keyof PreferenceFormValues>(
    key: K,
    value: PreferenceFormValues[K],
  ) {
    setFormValues((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handleNotificationsEnabledChange(value: boolean) {
    setField("notificationsEnabled", value);

    if (!value) {
      setField("pushNotificationsEnabled", false);
      setField("emailNotificationsEnabled", false);
    }
  }

  async function handleSave() {
    setLocalErrorMessage(null);

    if (!formValues.neighborhood) {
      setLocalErrorMessage("Selecione um bairro.");
      return;
    }

    if (
      formValues.notificationsEnabled &&
      formValues.emailNotificationsEnabled &&
      !formValues.email.trim()
    ) {
      setLocalErrorMessage("Informe um email para receber notificações.");
      return;
    }

    if (
      formValues.notificationsEnabled &&
      formValues.emailNotificationsEnabled &&
      !isValidEmail(formValues.email)
    ) {
      setLocalErrorMessage("Informe um email válido.");
      return;
    }

    await onSubmit({
      ...formValues,
      pushNotificationsEnabled: isDesktop
        ? false
        : formValues.notificationsEnabled &&
          formValues.pushNotificationsEnabled,
      emailNotificationsEnabled:
        formValues.notificationsEnabled && formValues.emailNotificationsEnabled,
      email:
        formValues.notificationsEnabled && formValues.emailNotificationsEnabled
          ? formValues.email.trim()
          : "",
    });
  }

  return (
    <DashboardModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Preferências"
      icon={<FontAwesomeIcon icon={faSliders} className="text-[18px]" />}
    >
      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-[15px] font-semibold text-[#111318]">
            Bairro
          </label>
          <select
            value={formValues.neighborhood}
            onChange={(event) => setField("neighborhood", event.target.value)}
            className="h-12 w-full rounded-xl border border-[#e3e7eb] bg-[#f6f7f9] px-4 text-[15px] text-[#111318] outline-none transition cursor-pointer focus:border-[#0f8f67]"
          >
            {neighborhoodOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between gap-4">
          <p className="text-[15px] font-semibold text-[#111318]">
            Ativar notificações
          </p>

          <OnboardingToggle
            checked={formValues.notificationsEnabled}
            onChange={handleNotificationsEnabledChange}
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <p
            className={`text-[15px] font-semibold ${
              formValues.notificationsEnabled && !isDesktop
                ? "text-[#111318]"
                : "text-[#9aa1b5]"
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

        <div className="flex items-center justify-between gap-4">
          <p
            className={`text-[15px] font-semibold ${
              formValues.notificationsEnabled
                ? "text-[#111318]"
                : "text-[#9aa1b5]"
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

        {formValues.notificationsEnabled &&
        formValues.emailNotificationsEnabled ? (
          <div>
            <label className="mb-2 block text-[15px] font-semibold text-[#111318]">
              Email
            </label>
            <input
              type="email"
              value={formValues.email}
              onChange={(event) => setField("email", event.target.value)}
              placeholder="Digite seu email"
              className="h-12 w-full rounded-xl border border-[#e3e7eb] bg-[#f6f7f9] px-4 text-[15px] text-[#111318] outline-none transition placeholder:text-[#9aa1b5] focus:border-[#0f8f67]"
            />
          </div>
        ) : null}

        {isDesktop ? (
          <p className="text-[14px] leading-6 text-[#768093]">
            No desktop, o sistema usa somente notificações por email.
          </p>
        ) : null}

        {localErrorMessage || errorMessage ? (
          <div className="rounded-2xl border border-[#ffd7d7] bg-[#fff2f2] px-4 py-3 text-sm text-[#bf4040]">
            {localErrorMessage ?? errorMessage}
          </div>
        ) : null}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 items-center justify-center rounded-xl border border-[#d8dde3] bg-white px-5 text-[15px] font-semibold text-[#111318] transition cursor-pointer hover:bg-[#f7f8f9]"
          >
            Fechar
          </button>

          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={isSubmitting}
            className="flex h-11 items-center justify-center rounded-xl bg-[#02051f] px-6 text-[15px] font-semibold text-white transition cursor-pointer hover:bg-[#0a1030] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </DashboardModalShell>
  );
}
