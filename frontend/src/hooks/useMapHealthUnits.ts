import { useMemo } from "react";
import { listHealthUnits } from "../services/healthUnitService";
import type { HealthUnit } from "../types/healthUnit";
import { useAsyncResource } from "./useAsyncResource";

function hasCoordinates(unit: HealthUnit) {
  return unit.latitude !== null && unit.longitude !== null;
}

export function useMapHealthUnits() {
  const { data } = useAsyncResource(listHealthUnits, [], {
    fallbackErrorMessage: "Não foi possível carregar as unidades do mapa.",
  });

  const items = useMemo(() => data?.items.filter(hasCoordinates) ?? [], [data]);

  return { items };
}
