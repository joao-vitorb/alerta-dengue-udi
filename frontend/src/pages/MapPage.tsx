import { useEffect, useMemo, useState } from "react";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { DashboardAlertBanner } from "../components/dashboard/DashboardAlertBanner";
import { DashboardToolsPanel } from "../components/dashboard/DashboardToolsPanel";
import { PreventionTipsCard } from "../components/dashboard/PreventionTipsCard";
import { ClimateModal } from "../components/dashboard/ClimateModal";
import { NearbyHealthUnitsModal } from "../components/dashboard/NearbyHealthUnitsModal";
import { VirtualDiagnosisModal } from "../components/dashboard/VirtualDiagnosisModal";
import { PreferencesModal } from "../components/dashboard/PreferencesModal";
import { MapCanvas } from "../components/map/MapCanvas";
import { OnboardingModal } from "../components/onboarding/OnboardingModal";
import { neighborhoodOptions } from "../data/neighborhoodOptions";
import { useBrowserLocation } from "../hooks/useBrowserLocation";
import { usePreventiveAlerts } from "../hooks/usePreventiveAlerts";
import { useUserPreference } from "../hooks/useUserPreference.ts";
import { useWeatherContext } from "../hooks/useWeatherContext";
import { listRecommendedHealthUnits } from "../services/healthUnitService";
import type { HealthUnit } from "../types/healthUnit";
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

function getDynamicAlertContent(input: {
  title?: string;
  description?: string;
  weatherLoading: boolean;
  weatherError: boolean;
}) {
  if (input.weatherLoading) {
    return {
      title: "Analisando condições atuais",
      description:
        "Estamos atualizando o contexto climático da sua região para montar o alerta preventivo.",
    };
  }

  if (input.weatherError) {
    return {
      title: "Monitoramento temporariamente indisponível",
      description:
        "Não foi possível atualizar o clima agora, mas o restante do sistema continua funcionando normalmente.",
    };
  }

  if (input.title && input.description) {
    return {
      title: input.title,
      description: input.description,
    };
  }

  return {
    title: "Monitoramento preventivo ativo",
    description:
      "Mantenha a vistoria da sua residência e acompanhe o mapa, o clima e as unidades mais próximas.",
  };
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

  const [recommendedMapUnits, setRecommendedMapUnits] = useState<HealthUnit[]>(
    [],
  );
  const [isClimateOpen, setIsClimateOpen] = useState(false);
  const [isNearbyUnitsOpen, setIsNearbyUnitsOpen] = useState(false);
  const [isDiagnosisOpen, setIsDiagnosisOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadRecommendedUnits() {
      if (!experience?.neighborhood) {
        if (isMounted) {
          setRecommendedMapUnits([]);
        }
        return;
      }

      try {
        const response = await listRecommendedHealthUnits({
          neighborhood: experience.neighborhood,
          latitude: location?.latitude,
          longitude: location?.longitude,
          limit: 4,
        });

        if (!isMounted) {
          return;
        }

        setRecommendedMapUnits(response.items);
      } catch {
        if (!isMounted) {
          return;
        }

        setRecommendedMapUnits([]);
      }
    }

    void loadRecommendedUnits();

    return () => {
      isMounted = false;
    };
  }, [experience?.neighborhood, location?.latitude, location?.longitude]);

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

  const dynamicAlert = useMemo(() => {
    const firstAlert = alertsData?.alerts?.[0];

    return getDynamicAlertContent({
      title: firstAlert?.title,
      description: firstAlert?.description,
      weatherLoading: isLoadingWeather,
      weatherError: Boolean(weatherErrorMessage),
    });
  }, [alertsData, isLoadingWeather, weatherErrorMessage]);

  return (
    <main className="min-h-screen bg-[#eaf6f2] px-5 py-3">
      <div className="mx-auto max-w-257.5">
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

        <div className="mt-4">
          <DashboardAlertBanner
            title={dynamicAlert.title}
            description={dynamicAlert.description}
          />
        </div>

        <section className="mt-4 grid gap-4 lg:grid-cols-[1fr_332px]">
          <div>
            <MapCanvas
              selectedNeighborhood={experience?.neighborhood}
              recommendedUnits={recommendedMapUnits}
              userLocation={location}
            />
          </div>

          <div className="space-y-4">
            <DashboardToolsPanel
              onOpenClimate={() => setIsClimateOpen(true)}
              onOpenNearbyUnits={() => {
                if (!location && !isLoadingLocation) {
                  requestLocation();
                }

                setIsNearbyUnitsOpen(true);
              }}
              onOpenDiagnosis={() => setIsDiagnosisOpen(true)}
            />

            <PreventionTipsCard />
          </div>
        </section>
      </div>
    </main>
  );
}
