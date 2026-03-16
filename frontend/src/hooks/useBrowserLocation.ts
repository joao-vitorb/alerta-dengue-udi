import { useState } from "react";

type BrowserLocation = {
  latitude: number;
  longitude: number;
};

export function useBrowserLocation() {
  const [location, setLocation] = useState<BrowserLocation | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationErrorMessage, setLocationErrorMessage] = useState<
    string | null
  >(null);

  function requestLocation() {
    if (!("geolocation" in navigator)) {
      setLocationErrorMessage(
        "Geolocalização não está disponível neste navegador.",
      );
      return;
    }

    setIsLoadingLocation(true);
    setLocationErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLoadingLocation(false);
      },
      () => {
        setLocationErrorMessage(
          "Não foi possível acessar sua localização. Você pode continuar usando o bairro selecionado.",
        );
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  }

  return {
    location,
    isLoadingLocation,
    locationErrorMessage,
    requestLocation,
  };
}
