import { getPreventiveAlerts } from "../services/preventiveAlertService";
import { useAsyncResource } from "./useAsyncResource";

export function usePreventiveAlerts(selectedNeighborhood?: string) {
  return useAsyncResource(
    () => getPreventiveAlerts(selectedNeighborhood ?? ""),
    [selectedNeighborhood],
    {
      enabled: Boolean(selectedNeighborhood),
      fallbackErrorMessage: "Não foi possível carregar os alertas preventivos.",
    },
  );
}
