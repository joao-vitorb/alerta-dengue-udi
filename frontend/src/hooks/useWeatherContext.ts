import { useEffect, useState } from "react";
import { getWeatherContext } from "../services/weatherService";
import type { WeatherContextResponse } from "../types/weather";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Não foi possível carregar o contexto climático.";
}

export function useWeatherContext(selectedNeighborhood?: string) {
  const [data, setData] = useState<WeatherContextResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadWeatherContext() {
      if (!selectedNeighborhood) {
        setData(null);
        setErrorMessage(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getWeatherContext(selectedNeighborhood);

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

    void loadWeatherContext();

    return () => {
      isMounted = false;
    };
  }, [selectedNeighborhood]);

  return {
    data,
    isLoading,
    errorMessage,
  };
}
