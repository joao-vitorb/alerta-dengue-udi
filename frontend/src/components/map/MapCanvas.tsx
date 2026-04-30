import { icon } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import L from "leaflet";
import {
  Circle,
  MapContainer,
  Marker,
  Polygon,
  Popup,
  TileLayer,
  ZoomControl,
} from "react-leaflet";
import { getNeighborhoodBoundary } from "../../data/neighborhoodBoundaries";
import {
  getNeighborhoodCoordinate,
  uberlandiaBounds,
  uberlandiaCenter,
} from "../../data/neighborhoodCoordinates";
import { useNeighborhoodGeoJson } from "../../hooks/useNeighborhoodGeoJson";
import { faHospital, faMapLocationDot } from "../../lib/icons";
import type { HealthUnit } from "../../types/healthUnit";
import {
  findNeighborhoodFeature,
  getFeatureBoundsPositions,
  getFeaturePolygonSets,
} from "../../utils/neighborhoodGeoJson";
import { CtrlScrollZoomHandler } from "./CtrlScrollZoomHandler";
import { MapController } from "./MapController";

type MapCanvasProps = {
  selectedNeighborhood?: string;
  recommendedUnits?: HealthUnit[];
  userLocation?: {
    latitude: number;
    longitude: number;
  } | null;
};

const SELECTED_ZOOM = 13;
const DEFAULT_ZOOM = 11;
const MIN_ZOOM = 11;
const MAX_ZOOM = 15;
const CITY_CIRCLE_RADIUS_M = 8500;
const USER_CIRCLE_RADIUS_M = 120;

const CARE_LEVEL_LABELS: Record<string, string> = {
  URGENT_CARE: "Urgência",
  PRIMARY_CARE: "Atenção primária",
};

const SELECTED_NEIGHBORHOOD_STYLE = {
  color: "#b91c1c",
  weight: 3,
  dashArray: "10 8",
  fillColor: "#b91c1c",
  fillOpacity: 0.22,
};

const CITY_CIRCLE_STYLE = {
  color: "#13a36d",
  fillColor: "#dff3eb",
  fillOpacity: 0.14,
  weight: 1.4,
};

const USER_CIRCLE_STYLE = {
  color: "#02051f",
  fillColor: "#02051f",
  fillOpacity: 0.2,
  weight: 2,
};

const hospitalMarkerSvg = icon(faHospital, {
  styles: { color: "#ffffff" },
}).html.join("");

const healthUnitIcon = L.divIcon({
  className: "",
  html: `
    <div style="display:flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:999px;background:#d62828;border:2px solid #9f1d1d;">
      ${hospitalMarkerSvg}
    </div>
  `,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15],
});

function formatDistance(distanceKm?: number | null) {
  if (distanceKm === null || distanceKm === undefined) {
    return "Distância indisponível";
  }
  return `~${Math.round(distanceKm)} km`;
}

function getCareLevelLabel(value?: string | null) {
  return (value && CARE_LEVEL_LABELS[value]) || "Atendimento geral";
}

function hasCoordinates(unit: HealthUnit): unit is HealthUnit & {
  latitude: number;
  longitude: number;
} {
  return unit.latitude !== null && unit.longitude !== null;
}

export function MapCanvas({
  selectedNeighborhood,
  recommendedUnits = [],
  userLocation = null,
}: MapCanvasProps) {
  const selectedCoordinate = getNeighborhoodCoordinate(selectedNeighborhood);
  const currentCenter = selectedCoordinate?.position ?? uberlandiaCenter;
  const currentZoom = selectedCoordinate ? SELECTED_ZOOM : DEFAULT_ZOOM;

  const { data: neighborhoodGeoJson } = useNeighborhoodGeoJson();

  const selectedFeature = findNeighborhoodFeature(
    neighborhoodGeoJson,
    selectedNeighborhood,
  );

  const featurePolygons = getFeaturePolygonSets(selectedFeature);
  const featureBounds = getFeatureBoundsPositions(selectedFeature);
  const fallbackBoundary = getNeighborhoodBoundary(selectedNeighborhood);

  const selectedNeighborhoodPolygons =
    featurePolygons.length > 0
      ? featurePolygons
      : fallbackBoundary
        ? [fallbackBoundary.positions]
        : [];

  const selectedNeighborhoodBounds =
    featureBounds.length > 0
      ? featureBounds
      : (fallbackBoundary?.positions ?? null);

  const visibleUnits = recommendedUnits.filter(hasCoordinates);

  return (
    <section className="rounded-[14px] border border-border-soft bg-white p-3 sm:rounded-[18px] sm:p-4">
      <div className="flex items-center gap-2">
        <span className="text-brand-green-soft">
          <FontAwesomeIcon icon={faMapLocationDot} />
        </span>

        <h2 className="text-[16px] font-semibold text-text-primary sm:text-[17px] lg:text-[18px]">
          Mapa de Uberlândia
        </h2>
      </div>

      <div className="mt-3 h-[320px] overflow-hidden rounded-[12px] bg-[#f7d100] sm:mt-4 sm:h-[400px] sm:rounded-[14px] lg:mt-5 lg:h-100.5">
        <MapContainer
          center={uberlandiaCenter}
          zoom={DEFAULT_ZOOM}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
          maxBounds={uberlandiaBounds}
          maxBoundsViscosity={1}
          zoomControl={false}
          scrollWheelZoom={false}
          dragging={true}
          className="h-full w-full"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapController
            center={currentCenter}
            zoom={currentZoom}
            maxBounds={uberlandiaBounds}
            focusBounds={selectedNeighborhoodBounds}
          />

          <CtrlScrollZoomHandler />

          <ZoomControl position="topright" />

          <Circle
            center={uberlandiaCenter}
            radius={CITY_CIRCLE_RADIUS_M}
            pathOptions={CITY_CIRCLE_STYLE}
          />

          {selectedNeighborhoodPolygons.map((positions, index) => (
            <Polygon
              key={`${selectedNeighborhood ?? "selected"}-${index}`}
              positions={positions}
              pathOptions={SELECTED_NEIGHBORHOOD_STYLE}
            />
          ))}

          {userLocation ? (
            <Circle
              center={[userLocation.latitude, userLocation.longitude]}
              radius={USER_CIRCLE_RADIUS_M}
              pathOptions={USER_CIRCLE_STYLE}
            />
          ) : null}

          {visibleUnits.map((unit) => (
            <Marker
              key={unit.id}
              position={[unit.latitude, unit.longitude]}
              icon={healthUnitIcon}
            >
              <Popup>
                <div className="space-y-1.5 sm:space-y-2">
                  <p className="text-xs font-semibold text-text-primary sm:text-sm">
                    {unit.name}
                  </p>

                  <p className="text-xs text-[#667085] sm:text-sm">
                    {unit.unitType} • {getCareLevelLabel(unit.careLevel)}
                  </p>

                  <p className="text-xs text-[#667085] sm:text-sm">
                    {unit.neighborhood ?? "Bairro não informado"}
                  </p>

                  <p className="text-xs text-[#667085] sm:text-sm">
                    {unit.address}
                  </p>

                  {unit.phone ? (
                    <p className="text-xs text-[#667085] sm:text-sm">
                      Telefone: {unit.phone}
                    </p>
                  ) : null}

                  {unit.openingHours ? (
                    <p className="text-xs text-[#667085] sm:text-sm">
                      Horário: {unit.openingHours}
                    </p>
                  ) : null}

                  <p className="text-xs text-[#667085] sm:text-sm">
                    {formatDistance(unit.distanceKm)}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </section>
  );
}
