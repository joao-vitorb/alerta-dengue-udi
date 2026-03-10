import { useEffect, useState } from "react";
import { neighborhoodOptions } from "../../data/neighborhoodOptions";
import type {
  DeviceType,
  PreferenceFormValues,
} from "../../types/userPreference";

type UserPreferenceFormProps = {
  initialValues: PreferenceFormValues;
  deviceType: DeviceType;
  submitLabel: string;
  isSubmitting: boolean;
  errorMessage: string | null;
  onSubmit: (values: PreferenceFormValues) => Promise<void> | void;
};

function normalizeValues(
  values: PreferenceFormValues,
  deviceType: DeviceType,
): PreferenceFormValues {
  const email = values.email.trim();
  const notificationsEnabled = values.notificationsEnabled;
  const emailNotificationsEnabled = Boolean(
    notificationsEnabled && email && values.emailNotificationsEnabled,
  );
  const pushNotificationsEnabled = Boolean(
    notificationsEnabled &&
    deviceType === "MOBILE" &&
    values.pushNotificationsEnabled,
  );

  return {
    neighborhood: values.neighborhood,
    email,
    notificationsEnabled,
    emailNotificationsEnabled,
    pushNotificationsEnabled,
  };
}

export function UserPreferenceForm({
  initialValues,
  deviceType,
  submitLabel,
  isSubmitting,
  errorMessage,
  onSubmit,
}: UserPreferenceFormProps) {
  const [formValues, setFormValues] = useState(() =>
    normalizeValues(initialValues, deviceType),
  );

  useEffect(() => {
    setFormValues(normalizeValues(initialValues, deviceType));
  }, [
    deviceType,
    initialValues.email,
    initialValues.emailNotificationsEnabled,
    initialValues.neighborhood,
    initialValues.notificationsEnabled,
    initialValues.pushNotificationsEnabled,
  ]);

  const canUseEmailNotifications =
    formValues.notificationsEnabled && formValues.email.trim().length > 0;

  const canUsePushNotifications =
    formValues.notificationsEnabled && deviceType === "MOBILE";

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void onSubmit(normalizeValues(formValues, deviceType));
  }

  function handleNotificationsToggle(checked: boolean) {
    setFormValues((current) => ({
      ...current,
      notificationsEnabled: checked,
      emailNotificationsEnabled: checked
        ? current.emailNotificationsEnabled
        : false,
      pushNotificationsEnabled: checked
        ? current.pushNotificationsEnabled
        : false,
    }));
  }

  function handleEmailChange(value: string) {
    setFormValues((current) => ({
      ...current,
      email: value,
      emailNotificationsEnabled:
        value.trim().length > 0 ? current.emailNotificationsEnabled : false,
    }));
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label
          htmlFor="neighborhood"
          className="text-sm font-medium text-slate-700"
        >
          Bairro
        </label>

        <select
          id="neighborhood"
          value={formValues.neighborhood}
          onChange={(event) =>
            setFormValues((current) => ({
              ...current,
              neighborhood: event.target.value,
            }))
          }
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
          required
        >
          {neighborhoodOptions.map((neighborhood) => (
            <option key={neighborhood} value={neighborhood}>
              {neighborhood}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-slate-700">
          Email
        </label>

        <input
          id="email"
          type="email"
          value={formValues.email}
          onChange={(event) => handleEmailChange(event.target.value)}
          placeholder="seuemail@exemplo.com"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
        />
      </div>

      <div className="space-y-3">
        <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
          <input
            type="checkbox"
            checked={formValues.notificationsEnabled}
            onChange={(event) =>
              handleNotificationsToggle(event.target.checked)
            }
            className="mt-1 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
          />
          <div>
            <p className="text-sm font-medium text-slate-800">
              Receber alertas preventivos
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Ative para receber avisos ligados a clima e prevenção.
            </p>
          </div>
        </label>
      </div>

      <div className="space-y-3">
        <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
          <input
            type="checkbox"
            checked={formValues.emailNotificationsEnabled}
            onChange={(event) =>
              setFormValues((current) => ({
                ...current,
                emailNotificationsEnabled: event.target.checked,
              }))
            }
            disabled={!canUseEmailNotifications}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 disabled:opacity-50"
          />

          <span>
            <span className="block text-sm font-medium text-slate-800">
              Avisos por email
            </span>
            <span className="block text-sm leading-6 text-slate-600">
              Disponível quando alertas estiverem ativos e um email for
              informado.
            </span>
          </span>
        </label>

        {deviceType === "MOBILE" ? (
          <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <input
              type="checkbox"
              checked={formValues.pushNotificationsEnabled}
              onChange={(event) =>
                setFormValues((current) => ({
                  ...current,
                  pushNotificationsEnabled: event.target.checked,
                }))
              }
              disabled={!canUsePushNotifications}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 disabled:opacity-50"
            />

            <span>
              <span className="block text-sm font-medium text-slate-800">
                Notificações push no celular
              </span>
              <span className="block text-sm leading-6 text-slate-600">
                A disponibilidade do push será implementada na etapa específica
                de notificações.
              </span>
            </span>
          </label>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-sm font-medium text-slate-800">
              Acesso em desktop
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              No computador, o sistema usará apenas email. Push ficará
              desativado.
            </p>
          </div>
        )}
      </div>

      {errorMessage ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errorMessage}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center rounded-2xl bg-sky-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Salvando..." : submitLabel}
      </button>
    </form>
  );
}
