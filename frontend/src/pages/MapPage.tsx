import { useMemo } from "react";
import { AppShell } from "../components/layout/AppShell";
import { MapCanvas } from "../components/map/MapCanvas";
import { OnboardingModal } from "../components/onboarding/OnboardingModal";
import { SettingsPanel } from "../components/settings/SettingsPanel";
import { InfoCard } from "../components/ui/InfoCard";
import { neighborhoodOptions } from "../data/neighborhoodOptions";
import { useUserPreference } from "../hooks/useUserPreference";
import type { PreferenceFormValues } from "../types/userPreference";

function getInitialFormValues(
  neighborhood: string,
  email: string,
  notificationsEnabled: boolean,
  emailNotificationsEnabled: boolean,
  pushNotificationsEnabled: boolean,
): PreferenceFormValues {
  return {
    neighborhood: neighborhood || neighborhoodOptions[0],
    email,
    notificationsEnabled,
    emailNotificationsEnabled,
    pushNotificationsEnabled,
  };
}

export function MapPage() {
  const {
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
  } = useUserPreference();

  const onboardingInitialValues = useMemo(() => {
    if (!experience) {
      return getInitialFormValues(
        neighborhoodOptions[0],
        "",
        false,
        false,
        false,
      );
    }

    return getInitialFormValues(
      experience.neighborhood,
      experience.email,
      experience.notificationsEnabled,
      experience.emailNotificationsEnabled,
      experience.pushNotificationsEnabled,
    );
  }, [experience]);

  const notificationSummary = useMemo(() => {
    if (!experience) {
      return "Carregando preferências";
    }

    if (!experience.notificationsEnabled) {
      return "Alertas desativados";
    }

    if (experience.deviceType === "MOBILE") {
      if (
        experience.emailNotificationsEnabled &&
        experience.pushNotificationsEnabled
      ) {
        return "Email e push ativados";
      }

      if (experience.emailNotificationsEnabled) {
        return "Email ativado";
      }

      if (experience.pushNotificationsEnabled) {
        return "Push ativado";
      }

      return "Alertas gerais ativados";
    }

    if (experience.emailNotificationsEnabled) {
      return "Email ativado no desktop";
    }

    return "Alertas gerais ativados no desktop";
  }, [experience]);

  const lastSyncValue = useMemo(() => {
    if (!userPreference) {
      return "Pendente";
    }

    return new Date(userPreference.updatedAt).toLocaleString("pt-BR");
  }, [userPreference]);

  return (
    <AppShell>
      <OnboardingModal
        isOpen={isOnboardingOpen}
        deviceType={experience?.deviceType ?? "DESKTOP"}
        initialValues={onboardingInitialValues}
        isSubmitting={isSaving}
        errorMessage={errorMessage}
        onSubmit={submitOnboarding}
        onClose={closeOnboarding}
        canClose={Boolean(experience?.hasCompletedOnboarding)}
      />

      <section className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <aside className="space-y-6">
          <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">
              Plataforma de prevenção
            </p>

            <h2 className="mt-4 text-3xl font-semibold leading-tight text-slate-900">
              {experience?.neighborhood
                ? `Seu monitoramento começa em ${experience.neighborhood}`
                : "Configure seu bairro para personalizar o sistema"}
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              AO onboarding agora salva dados localmente e sincroniza a
              experiência mínima com o backend sem exigir conta de usuário.
            </p>

            <button
              type="button"
              onClick={reopenOnboarding}
              className="mt-6 inline-flex rounded-full border border-sky-200 bg-sky-50 px-5 py-3 text-sm font-medium text-sky-700 transition hover:bg-sky-100"
            >
              Reabrir onboarding
            </button>
          </section>

          <InfoCard
            eyebrow="Mapa"
            value={experience?.neighborhood || "Uberlândia"}
            title="Visualização real da cidade"
            description="O bairro salvo já orienta o foco inicial do mapa dentro de uma área limitada da cidade."
          />

          <InfoCard
            eyebrow="Notificações"
            value={notificationSummary}
            title="Regras por dispositivo"
            description="Mobile prepara push e email. Desktop mantém somente o fluxo por email."
          />

          <InfoCard
            eyebrow="Sincronização"
            value={lastSyncValue}
            title="Integração com backend"
            description="As preferências locais já podem ser criadas, buscadas e atualizadas via API REST."
          />

          {errorMessage && !isOnboardingOpen ? (
            <section className="rounded-4xl border border-rose-200 bg-rose-50 p-6">
              <p className="text-sm font-medium text-rose-700">
                {errorMessage}
              </p>
            </section>
          ) : null}
        </aside>

        <div className="space-y-6">
          <MapCanvas selectedNeighborhood={experience?.neighborhood} />

          {isLoading ? (
            <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-600">
                Carregando preferências...
              </p>
            </section>
          ) : experience?.hasCompletedOnboarding ? (
            <SettingsPanel
              experience={experience}
              initialValues={onboardingInitialValues}
              isSubmitting={isSaving}
              errorMessage={errorMessage}
              onSubmit={saveSettings}
            />
          ) : null}
        </div>
      </section>
    </AppShell>
  );
}
