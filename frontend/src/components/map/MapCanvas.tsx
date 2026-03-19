import L from "leaflet";
import { icon } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Circle,
  CircleMarker,
  MapContainer,
  Marker,
  Polygon,
  Popup,
  TileLayer,
  Tooltip,
  ZoomControl,
} from "react-leaflet";
import type { HealthUnit } from "../../types/healthUnit";
import {
  getNeighborhoodCoordinate,
  neighborhoodCoordinates,
  uberlandiaBounds,
  uberlandiaCenter,
} from "../../data/neighborhoodCoordinates";
import { getNeighborhoodBoundary } from "../../data/neighborhoodBoundaries";
import { faHospital, faMapLocationDot } from "../../lib/icons";
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

export function MapCanvas({
  selectedNeighborhood,
  recommendedUnits = [],
  userLocation = null,
}: MapCanvasProps) {
  const selectedCoordinate = getNeighborhoodCoordinate(selectedNeighborhood);
  const selectedBoundary = getNeighborhoodBoundary(selectedNeighborhood);
  const currentCenter = selectedCoordinate?.position ?? uberlandiaCenter;
  const currentZoom = selectedCoordinate ? 13 : 11;

  return (
    <section className="rounded-[18px] border border-[#d8dcd8] bg-white p-4">
      <div className="flex items-center gap-2">
        <span className="text-[#10a672]">
          <FontAwesomeIcon icon={faMapLocationDot} />
        </span>

        <h2 className="text-[18px] font-semibold text-[#111318]">
          Mapa de Uberlândia
        </h2>
      </div>

      <div className="mt-5 h-100.5 overflow-hidden rounded-[14px] bg-[#f7d100]">
        <MapContainer
          center={uberlandiaCenter}
          zoom={11}
          minZoom={11}
          maxZoom={15}
          maxBounds={uberlandiaBounds}
          maxBoundsViscosity={1}
          zoomControl={false}
          scrollWheelZoom={false}
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
          />

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

          {selectedBoundary ? (
            <Polygon
              positions={selectedBoundary.positions}
              pathOptions={{
                color: "#b91c1c",
                weight: 3,
                dashArray: "10 8",
                fillColor: "#b91c1c",
                fillOpacity: 0.22,
              }}
            />
          ) : null}

          {neighborhoodCoordinates.map((neighborhood) => {
            const isSelected = neighborhood.name === selectedNeighborhood;

            return (
              <CircleMarker
                key={neighborhood.name}
                center={neighborhood.position}
                radius={isSelected ? 9 : 6}
                pathOptions={{
                  color: isSelected ? "#0b9f6a" : "#83d8bb",
                  fillColor: isSelected ? "#0b9f6a" : "#c9f1e1",
                  fillOpacity: 0.95,
                  weight: isSelected ? 2 : 1.4,
                }}
              >
                {isSelected ? (
                  <Tooltip
                    direction="top"
                    offset={[0, -6]}
                    opacity={1}
                    permanent
                  >
                    {neighborhood.name}
                  </Tooltip>
                ) : null}
              </CircleMarker>
            );
          })}

          {userLocation ? (
            <CircleMarker
              center={[userLocation.latitude, userLocation.longitude]}
              radius={8}
              pathOptions={{
                color: "#02051f",
                fillColor: "#02051f",
                fillOpacity: 1,
                weight: 2,
              }}
            >
              <Tooltip direction="top" offset={[0, -6]} opacity={1}>
                Sua localização
              </Tooltip>
            </CircleMarker>
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
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-[#111318]">
                      {unit.name}
                    </p>
                    <p className="text-sm text-[#667085]">{unit.unitType}</p>
                    <p className="text-sm text-[#667085]">
                      {unit.neighborhood ?? "Bairro não informado"}
                    </p>
                    <p className="text-sm text-[#667085]">{unit.address}</p>
                    <p className="text-sm text-[#667085]">
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
