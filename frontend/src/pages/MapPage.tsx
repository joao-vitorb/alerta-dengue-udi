import { useMemo, useState } from "react";
import { ClimateModal } from "../components/dashboard/ClimateModal";
import { DashboardAlertBanner } from "../components/dashboard/DashboardAlertBanner";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { DashboardToolsPanel } from "../components/dashboard/DashboardToolsPanel";
import { NearbyHealthUnitsModal } from "../components/dashboard/NearbyHealthUnitsModal";
import { PreferencesModal } from "../components/dashboard/PreferencesModal";
import { PreventionTipsCard } from "../components/dashboard/PreventionTipsCard";
import { VirtualDiagnosisModal } from "../components/dashboard/VirtualDiagnosisModal";
import { MapCanvas } from "../components/map/MapCanvas";
import { OnboardingModal } from "../components/onboarding/OnboardingModal";
import { neighborhoodOptions } from "../data/neighborhoodOptions";
import { useBrowserLocation } from "../hooks/useBrowserLocation";
import { useMapHealthUnits } from "../hooks/useMapHealthUnits";
import { usePreventiveAlerts } from "../hooks/usePreventiveAlerts";
import { useUserPreference } from "../hooks/useUserPreference";
import { useWeatherContext } from "../hooks/useWeatherContext";
import type {
  LocalExperience,
  PreferenceFormValues,
} from "../types/userPreference";

type DynamicAlertContent = {
  title: string;
  description: string;
};

const DEFAULT_ALERT: DynamicAlertContent = {
  title: "Monitoramento preventivo ativo",
  description:
    "Mantenha a vistoria da sua residência e acompanhe o mapa, o clima e as unidades mais próximas.",
};

const LOADING_ALERT: DynamicAlertContent = {
  title: "Analisando condições atuais",
  description:
    "Estamos atualizando o contexto climático da sua região para montar o alerta preventivo.",
};

const ERROR_ALERT: DynamicAlertContent = {
  title: "Monitoramento temporariamente indisponível",
  description:
    "Não foi possível atualizar o clima agora, mas o restante do sistema continua funcionando normalmente.",
};

function buildFormValuesFromExperience(
  experience: LocalExperience | null,
): PreferenceFormValues {
  return {
    neighborhood: experience?.neighborhood || neighborhoodOptions[0],
    email: experience?.email ?? "",
    notificationsEnabled: experience?.notificationsEnabled ?? false,
    emailNotificationsEnabled: experience?.emailNotificationsEnabled ?? false,
    pushNotificationsEnabled: experience?.pushNotificationsEnabled ?? false,
  };
}

function resolveDynamicAlert(input: {
  alertTitle?: string;
  alertDescription?: string;
  weatherLoading: boolean;
  weatherError: boolean;
}): DynamicAlertContent {
  if (input.weatherLoading) return LOADING_ALERT;
  if (input.weatherError) return ERROR_ALERT;

  if (input.alertTitle && input.alertDescription) {
    return { title: input.alertTitle, description: input.alertDescription };
  }

  return DEFAULT_ALERT;
}

export function MapPage() {
  const {
    experience,
    isSaving,
    isOnboardingOpen,
    errorMessage,
    submitOnboarding,
    saveSettings,
    closeOnboarding,
  } = useUserPreference();

  const { location, isLoadingLocation, requestLocation } = useBrowserLocation();

  const {
    data: weatherData,
    isLoading: isLoadingWeather,
    errorMessage: weatherErrorMessage,
  } = useWeatherContext(experience?.neighborhood);

  const { data: alertsData } = usePreventiveAlerts(experience?.neighborhood);
  const { items: mapHealthUnits } = useMapHealthUnits();

  const [isClimateOpen, setIsClimateOpen] = useState(false);
  const [isNearbyUnitsOpen, setIsNearbyUnitsOpen] = useState(false);
  const [isDiagnosisOpen, setIsDiagnosisOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  const onboardingInitialValues = useMemo(
    () => buildFormValuesFromExperience(experience),
    [experience],
  );

  const dynamicAlert = useMemo(() => {
    const firstAlert = alertsData?.alerts?.[0];

    return resolveDynamicAlert({
      alertTitle: firstAlert?.title,
      alertDescription: firstAlert?.description,
      weatherLoading: isLoadingWeather,
      weatherError: Boolean(weatherErrorMessage),
    });
  }, [alertsData, isLoadingWeather, weatherErrorMessage]);

  function handleOpenNearbyUnits() {
    if (!location && !isLoadingLocation) {
      requestLocation();
    }
    setIsNearbyUnitsOpen(true);
  }

  return (
    <main className="min-h-screen bg-page-bg px-3 py-3 sm:px-5 sm:py-4 lg:px-8 lg:py-5">
      <div className="mx-auto w-full max-w-257.5">
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

        <ClimateModal
          isOpen={isClimateOpen}
          onClose={() => setIsClimateOpen(false)}
          data={weatherData}
          isLoading={isLoadingWeather}
          errorMessage={weatherErrorMessage}
          alertTitle={dynamicAlert.title}
          alertDescription={dynamicAlert.description}
        />

        <NearbyHealthUnitsModal
          isOpen={isNearbyUnitsOpen}
          onClose={() => setIsNearbyUnitsOpen(false)}
          neighborhood={experience?.neighborhood}
          location={location}
        />

        <VirtualDiagnosisModal
          isOpen={isDiagnosisOpen}
          onClose={() => setIsDiagnosisOpen(false)}
        />

        <PreferencesModal
          isOpen={isPreferencesOpen}
          onClose={() => setIsPreferencesOpen(false)}
          experience={experience}
          initialValues={onboardingInitialValues}
          isSubmitting={isSaving}
          errorMessage={errorMessage}
          onSubmit={saveSettings}
        />

        <DashboardHeader onOpenPreferences={() => setIsPreferencesOpen(true)} />

        <div className="mt-3 sm:mt-4">
          <DashboardAlertBanner
            title={dynamicAlert.title}
            description={dynamicAlert.description}
          />
        </div>

        <section className="mt-3 grid gap-3 sm:mt-4 sm:gap-4 lg:grid-cols-[1fr_332px]">
          <div>
            <MapCanvas
              selectedNeighborhood={experience?.neighborhood}
              recommendedUnits={mapHealthUnits}
              userLocation={location}
            />
          </div>

          <div className="space-y-3 sm:space-y-4">
            <DashboardToolsPanel
              onOpenClimate={() => setIsClimateOpen(true)}
              onOpenNearbyUnits={handleOpenNearbyUnits}
              onOpenDiagnosis={() => setIsDiagnosisOpen(true)}
            />

            <PreventionTipsCard />
          </div>
        </section>
      </div>
    </main>
  );
}
