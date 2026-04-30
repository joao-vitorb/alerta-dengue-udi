import { useState } from "react";

type BrowserLocation = {
  latitude: number;
  longitude: number;
};

const GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 300000,
};

export function useBrowserLocation() {
  const [location, setLocation] = useState<BrowserLocation | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  function requestLocation() {
    if (!("geolocation" in navigator)) return;

    setIsLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLoadingLocation(false);
      },
      () => {
        setIsLoadingLocation(false);
      },
      GEOLOCATION_OPTIONS,
    );
  }

  return { location, isLoadingLocation, requestLocation };
}
