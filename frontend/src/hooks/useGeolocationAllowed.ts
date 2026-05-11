import { useEffect, useState } from "react";
import {
  getGeolocationAllowed,
  subscribeToGeolocationAllowedChanges,
} from "../utils/geolocationPreference";

export function useGeolocationAllowed(): boolean {
  const [isAllowed, setIsAllowed] = useState<boolean>(() =>
    getGeolocationAllowed(),
  );

  useEffect(() => {
    return subscribeToGeolocationAllowedChanges(() => {
      setIsAllowed(getGeolocationAllowed());
    });
  }, []);

  return isAllowed;
}
