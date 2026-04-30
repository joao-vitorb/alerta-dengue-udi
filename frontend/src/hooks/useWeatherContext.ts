import { getWeatherContext } from "../services/weatherService";
import { useAsyncResource } from "./useAsyncResource";

export function useWeatherContext(selectedNeighborhood?: string) {
  return useAsyncResource(
    () => getWeatherContext(selectedNeighborhood ?? ""),
    [selectedNeighborhood],
    {
      enabled: Boolean(selectedNeighborhood),
      fallbackErrorMessage: "Não foi possível carregar o contexto climático.",
    },
  );
}
