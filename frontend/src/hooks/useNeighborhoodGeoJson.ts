import { useEffect, useState } from "react";
import { loadNeighborhoodGeoJson } from "../services/neighborhoodGeoJsonService";
import type { NeighborhoodGeoJsonFeatureCollection } from "../types/neighborhoodGeoJson";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Não foi possível carregar os bairros do mapa.";
}

export function useNeighborhoodGeoJson() {
  const [data, setData] = useState<NeighborhoodGeoJsonFeatureCollection | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await loadNeighborhoodGeoJson();

        if (!isMounted) {
          return;
        }

        setData(response);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setData(null);
        setErrorMessage(getErrorMessage(error));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    data,
    isLoading,
    errorMessage,
  };
}
