import { useEffect, useMemo, useState } from "react";
import { getPreventiveAlerts } from "../services/preventiveAlertService";
import type { PreventiveAlertsResponse } from "../types/preventiveAlert";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Não foi possível carregar os alertas preventivos.";
}

export function usePreventiveAlerts(selectedNeighborhood?: string) {
  const [data, setData] = useState<PreventiveAlertsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadPreventiveAlerts() {
      if (!selectedNeighborhood) {
        setData(null);
        setErrorMessage(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getPreventiveAlerts(selectedNeighborhood);

        if (!isMounted) {
          return;
        }

        setData(response);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(getErrorMessage(error));
        setData(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadPreventiveAlerts();

    return () => {
      isMounted = false;
    };
  }, [selectedNeighborhood]);

  const hasAlerts = useMemo(() => {
    return Boolean(data && data.alerts.length > 0);
  }, [data]);

  return {
    data,
    isLoading,
    errorMessage,
    hasAlerts,
  };
}
