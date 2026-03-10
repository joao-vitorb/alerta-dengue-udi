import { UserPreferenceForm } from "../preferences/UserPreferenceForm";
import type {
  DeviceType,
  PreferenceFormValues,
} from "../../types/userPreference";

type OnboardingModalProps = {
  isOpen: boolean;
  deviceType: DeviceType;
  initialValues: PreferenceFormValues;
  isSubmitting: boolean;
  errorMessage: string | null;
  onSubmit: (values: PreferenceFormValues) => Promise<void> | void;
  onClose: () => void;
  canClose: boolean;
};

export function OnboardingModal({
  isOpen,
  deviceType,
  initialValues,
  isSubmitting,
  errorMessage,
  onSubmit,
  onClose,
  canClose,
}: OnboardingModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 px-6 py-10 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-4xl border border-slate-200 bg-white p-6 shadow-[0_30px_120px_rgba(15,23,42,0.18)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">
              Primeira visita
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">
              Configure sua experiência local
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Escolha seu bairro e suas preferências para personalizar alertas,
              lembretes preventivos e orientação de atendimento.
            </p>
          </div>

          {canClose ? (
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Fechar
            </button>
          ) : null}
        </div>

        <div className="mt-6">
          <UserPreferenceForm
            initialValues={initialValues}
            deviceType={deviceType}
            submitLabel="Concluir onboarding"
            isSubmitting={isSubmitting}
            errorMessage={errorMessage}
            onSubmit={onSubmit}
          />
        </div>
      </div>
    </div>
  );
}
