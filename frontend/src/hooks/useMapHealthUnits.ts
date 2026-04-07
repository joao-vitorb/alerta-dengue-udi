import { useEffect, useState } from "react";
import { listHealthUnits } from "../services/healthUnitService";
import type { HealthUnit } from "../types/healthUnit";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Não foi possível carregar as unidades do mapa.";
}

function hasCoordinates(unit: HealthUnit) {
  return unit.latitude !== null && unit.longitude !== null;
}

export function useMapHealthUnits() {
  const [items, setItems] = useState<HealthUnit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadMapUnits() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await listHealthUnits();

        if (!isMounted) {
          return;
        }

        setItems(response.items.filter(hasCoordinates));
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setItems([]);
        setErrorMessage(getErrorMessage(error));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadMapUnits();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    items,
    isLoading,
    errorMessage,
  };
}
