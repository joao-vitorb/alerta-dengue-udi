import { useEffect, useState } from "react";

type BrowserLocation = {
  latitude: number;
  longitude: number;
};

type UseBrowserLocationOptions = {
  autoRequest?: boolean;
};

const GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 300000,
};

const ERROR_MESSAGE_BY_CODE: Record<number, string> = {
  1: "Permissão de localização negada.",
  2: "Não foi possível obter sua localização.",
  3: "Tempo esgotado ao buscar sua localização.",
};

const FALLBACK_ERROR_MESSAGE = "Não foi possível obter sua localização.";

function isGeolocationSupported(): boolean {
  return typeof navigator !== "undefined" && "geolocation" in navigator;
}

function resolveErrorMessage(error: GeolocationPositionError): string {
  return ERROR_MESSAGE_BY_CODE[error.code] ?? FALLBACK_ERROR_MESSAGE;
}

export function useBrowserLocation(options: UseBrowserLocationOptions = {}) {
  const { autoRequest = false } = options;

  const [location, setLocation] = useState<BrowserLocation | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  function requestLocation() {
    if (!isGeolocationSupported()) {
      setLocationError("Geolocalização não suportada neste dispositivo.");
      return;
    }

    setIsLoadingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLoadingLocation(false);
      },
      (error) => {
        setLocationError(resolveErrorMessage(error));
        setIsLoadingLocation(false);
      },
      GEOLOCATION_OPTIONS,
    );
  }

  useEffect(() => {
    if (!autoRequest) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    requestLocation();
  }, [autoRequest]);

  return {
    location,
    isLoadingLocation,
    locationError,
    requestLocation,
  };
}
