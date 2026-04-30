import { loadNeighborhoodGeoJson } from "../services/neighborhoodGeoJsonService";
import { useAsyncResource } from "./useAsyncResource";

export function useNeighborhoodGeoJson() {
  return useAsyncResource(loadNeighborhoodGeoJson, [], {
    fallbackErrorMessage: "Não foi possível carregar os bairros do mapa.",
  });
}
