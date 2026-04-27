import L from "leaflet";
import { icon } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Circle,
  MapContainer,
  Marker,
  Polygon,
  Popup,
  TileLayer,
  ZoomControl,
} from "react-leaflet";
import type { HealthUnit } from "../../types/healthUnit";
import {
  getNeighborhoodCoordinate,
  uberlandiaBounds,
  uberlandiaCenter,
} from "../../data/neighborhoodCoordinates";
import { getNeighborhoodBoundary } from "../../data/neighborhoodBoundaries";
import { useNeighborhoodGeoJson } from "../../hooks/useNeighborhoodGeoJson";
import { faHospital, faMapLocationDot } from "../../lib/icons";
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

const hospitalMarkerSvg = icon(faHospital, {
  styles: {
    color: "#ffffff",
  },
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
  if (value === "URGENT_CARE") {
    return "Urgência";
  }

  if (value === "PRIMARY_CARE") {
    return "Atenção primária";
  }

  return "Atendimento geral";
}

export function MapCanvas({
  selectedNeighborhood,
  recommendedUnits = [],
  userLocation = null,
}: MapCanvasProps) {
  const selectedCoordinate = getNeighborhoodCoordinate(selectedNeighborhood);
  const currentCenter = selectedCoordinate?.position ?? uberlandiaCenter;
  const currentZoom = selectedCoordinate ? 13 : 11;

  const { data: neighborhoodGeoJson } = useNeighborhoodGeoJson();

  const selectedFeature = findNeighborhoodFeature(
    neighborhoodGeoJson,
    selectedNeighborhood,
  );

  const selectedFeaturePolygons = getFeaturePolygonSets(selectedFeature);
  const selectedFeatureBounds = getFeatureBoundsPositions(selectedFeature);

  const fallbackBoundary = getNeighborhoodBoundary(selectedNeighborhood);
  const fallbackPolygons = fallbackBoundary ? [fallbackBoundary.positions] : [];

  const selectedNeighborhoodPolygons =
    selectedFeaturePolygons.length > 0
      ? selectedFeaturePolygons
      : fallbackPolygons;

  const selectedNeighborhoodBounds =
    selectedFeatureBounds.length > 0
      ? selectedFeatureBounds
      : (fallbackBoundary?.positions ?? null);

  return (
    <section className="rounded-[14px] border border-[#d8dcd8] bg-white p-3 sm:rounded-[18px] sm:p-4">
      <div className="flex items-center gap-2">
        <span className="text-[#10a672]">
          <FontAwesomeIcon icon={faMapLocationDot} />
        </span>

        <h2 className="text-[16px] font-semibold text-[#111318] sm:text-[17px] lg:text-[18px]">
          Mapa de Uberlândia
        </h2>
      </div>

      <div className="mt-3 h-[320px] overflow-hidden rounded-[12px] bg-[#f7d100] sm:mt-4 sm:h-[400px] sm:rounded-[14px] lg:mt-5 lg:h-100.5">
        <MapContainer
          center={uberlandiaCenter}
          zoom={11}
          minZoom={11}
          maxZoom={15}
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
            radius={8500}
            pathOptions={{
              color: "#13a36d",
              fillColor: "#dff3eb",
              fillOpacity: 0.14,
              weight: 1.4,
            }}
          />

          {selectedNeighborhoodPolygons.map((positions, index) => (
            <Polygon
              key={`${selectedNeighborhood ?? "selected"}-${index}`}
              positions={positions}
              pathOptions={{
                color: "#b91c1c",
                weight: 3,
                dashArray: "10 8",
                fillColor: "#b91c1c",
                fillOpacity: 0.22,
              }}
            />
          ))}

          {userLocation ? (
            <Circle
              center={[userLocation.latitude, userLocation.longitude]}
              radius={120}
              pathOptions={{
                color: "#02051f",
                fillColor: "#02051f",
                fillOpacity: 0.2,
                weight: 2,
              }}
            />
          ) : null}

          {recommendedUnits
            .filter((unit) => unit.latitude !== null && unit.longitude !== null)
            .map((unit) => (
              <Marker
                key={unit.id}
                position={[unit.latitude as number, unit.longitude as number]}
                icon={healthUnitIcon}
              >
                <Popup>
                  <div className="space-y-1.5 sm:space-y-2">
                    <p className="text-xs font-semibold text-[#111318] sm:text-sm">
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
