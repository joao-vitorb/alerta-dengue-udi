import { useEffect, useMemo, useState } from "react";
import { listHealthUnits } from "../services/healthUnitService";
import type {
  HealthCareLevel,
  HealthUnit,
  HealthUnitsFilterState,
  HealthUnitType,
} from "../types/healthUnit";

function normalizeText(value: string | null | undefined) {
  return (value ?? "").trim().toLowerCase();
}

function matchesSearch(unit: HealthUnit, search: string) {
  if (!search.trim()) {
    return true;
  }

  const normalizedSearch = normalizeText(search);

  return [
    unit.name,
    unit.address,
    unit.neighborhood,
    unit.phone,
    unit.openingHours,
  ]
    .map((item) => normalizeText(item))
    .some((item) => item.includes(normalizedSearch));
}

function sortUnitsByName(units: HealthUnit[]) {
  return [...units].sort((first, second) =>
    first.name.localeCompare(second.name),
  );
}

function buildRecommendedUnits(
  units: HealthUnit[],
  selectedNeighborhood?: string,
) {
  const normalizedNeighborhood = normalizeText(selectedNeighborhood);

  const urgentInNeighborhood = units.find(
    (unit) =>
      unit.careLevel === "URGENT_CARE" &&
      normalizeText(unit.neighborhood) === normalizedNeighborhood,
  );

  const primaryInNeighborhood = units.find(
    (unit) =>
      unit.careLevel === "PRIMARY_CARE" &&
      normalizeText(unit.neighborhood) === normalizedNeighborhood,
  );

  const urgentFallback = units.find((unit) => unit.careLevel === "URGENT_CARE");
  const primaryFallback = units.find(
    (unit) => unit.careLevel === "PRIMARY_CARE",
  );

  const neighborhoodMatches = units.filter(
    (unit) => normalizeText(unit.neighborhood) === normalizedNeighborhood,
  );

  const ordered = [
    urgentInNeighborhood,
    primaryInNeighborhood,
    urgentFallback,
    primaryFallback,
    ...neighborhoodMatches,
  ].filter(Boolean) as HealthUnit[];

  const unique = ordered.filter(
    (unit, index, array) =>
      array.findIndex((candidate) => candidate.id === unit.id) === index,
  );

  return unique.slice(0, 3);
}

export function useHealthUnits(selectedNeighborhood?: string) {
  const [items, setItems] = useState<HealthUnit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filters, setFilters] = useState<HealthUnitsFilterState>({
    search: "",
    unitType: "ALL",
    careLevel: "ALL",
    onlySelectedNeighborhood: true,
  });

  useEffect(() => {
    let isMounted = true;

    async function loadHealthUnits() {
      try {
        const response = await listHealthUnits();

        if (!isMounted) {
          return;
        }

        setItems(sortUnitsByName(response.items));
        setErrorMessage(null);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (error instanceof Error) {
          setErrorMessage(error.message);
          return;
        }

        setErrorMessage("Não foi possível carregar as unidades de saúde.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadHealthUnits();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((unit) => {
      if (!matchesSearch(unit, filters.search)) {
        return false;
      }

      if (filters.unitType !== "ALL" && unit.unitType !== filters.unitType) {
        return false;
      }

      if (filters.careLevel !== "ALL" && unit.careLevel !== filters.careLevel) {
        return false;
      }

      if (
        filters.onlySelectedNeighborhood &&
        selectedNeighborhood &&
        normalizeText(unit.neighborhood) !== normalizeText(selectedNeighborhood)
      ) {
        return false;
      }

      return true;
    });
  }, [items, filters, selectedNeighborhood]);

  const recommendedUnits = useMemo(() => {
    return buildRecommendedUnits(items, selectedNeighborhood);
  }, [items, selectedNeighborhood]);

  function setSearch(search: string) {
    setFilters((current) => ({
      ...current,
      search,
    }));
  }

  function setUnitType(unitType: "ALL" | HealthUnitType) {
    setFilters((current) => ({
      ...current,
      unitType,
    }));
  }

  function setCareLevel(careLevel: "ALL" | HealthCareLevel) {
    setFilters((current) => ({
      ...current,
      careLevel,
    }));
  }

  function setOnlySelectedNeighborhood(value: boolean) {
    setFilters((current) => ({
      ...current,
      onlySelectedNeighborhood: value,
    }));
  }

  return {
    items,
    filteredItems,
    recommendedUnits,
    isLoading,
    errorMessage,
    filters,
    setSearch,
    setUnitType,
    setCareLevel,
    setOnlySelectedNeighborhood,
  };
}
