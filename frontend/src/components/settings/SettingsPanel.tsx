import { UserPreferenceForm } from "../preferences/UserPreferenceForm";
import type {
  LocalExperience,
  PreferenceFormValues,
} from "../../types/userPreference";

type SettingsPanelProps = {
  experience: LocalExperience;
  initialValues: PreferenceFormValues;
  isSubmitting: boolean;
  errorMessage: string | null;
  onSubmit: (values: PreferenceFormValues) => Promise<void> | void;
};

export function SettingsPanel({
  experience,
  initialValues,
  isSubmitting,
  errorMessage,
  onSubmit,
}: SettingsPanelProps) {
  return (
    <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">
            Configurações
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900">
            Ajuste suas preferências
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Você pode alterar bairro, email e o recebimento de alertas sem criar
            conta.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <p>
            <span className="font-medium text-slate-800">Dispositivo:</span>{" "}
            {experience.deviceType === "MOBILE" ? "Mobile" : "Desktop"}
          </p>
          <p className="mt-1">
            <span className="font-medium text-slate-800">ID anônimo:</span>{" "}
            {experience.anonymousId}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <UserPreferenceForm
          initialValues={initialValues}
          deviceType={experience.deviceType}
          submitLabel="Salvar configurações"
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
          onSubmit={onSubmit}
        />
      </div>
    </section>
  );
}
