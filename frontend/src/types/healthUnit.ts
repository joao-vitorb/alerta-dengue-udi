export type HealthUnitType =
  | "UAI"
  | "UBS"
  | "UBSF"
  | "HOSPITAL"
  | "CAPS"
  | "CER"
  | "COV"
  | "CMAD"
  | "CEREST"
  | "LABORATORY"
  | "OTHER";

export type HealthCareLevel =
  | "PRIMARY_CARE"
  | "URGENT_CARE"
  | "SPECIALTY_CARE"
  | "SUPPORT_SERVICE";

export type HealthSector =
  | "CENTRAL"
  | "EAST"
  | "NORTH"
  | "SOUTH"
  | "WEST"
  | "RURAL";

export type HealthUnit = {
  id: string;
  name: string;
  unitType: HealthUnitType;
  careLevel: HealthCareLevel;
  sector: HealthSector;
  address: string;
  neighborhood: string | null;
  phone: string | null;
  openingHours: string | null;
  latitude: number | null;
  longitude: number | null;
  officialSourceUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type HealthUnitsResponse = {
  items: HealthUnit[];
  total: number;
};

export type HealthUnitsFilterState = {
  search: string;
  unitType: "ALL" | HealthUnitType;
  careLevel: "ALL" | HealthCareLevel;
  onlySelectedNeighborhood: boolean;
};
