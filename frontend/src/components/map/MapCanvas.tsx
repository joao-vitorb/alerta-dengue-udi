import {
  Circle,
  CircleMarker,
  MapContainer,
  Marker,
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
import { MapController } from "./MapController";

type MapCanvasProps = {
  selectedNeighborhood?: string;
  recommendedUnits?: HealthUnit[];
  userLocation?: {
    latitude: number;
    longitude: number;
  } | null;
};

function formatDistance(distanceKm?: number | null) {
  if (distanceKm === null || distanceKm === undefined) {
    return "Distância indisponível";
  }

  return `${distanceKm.toFixed(2)} km`;
}

export function MapCanvas({
  selectedNeighborhood,
  recommendedUnits = [],
  userLocation = null,
}: MapCanvasProps) {
  const selectedCoordinate = getNeighborhoodCoordinate(selectedNeighborhood);
  const currentCenter = selectedCoordinate?.position ?? uberlandiaCenter;
  const currentZoom = selectedCoordinate ? 13 : 11;

  return (
    <section className="overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">
            Visão principal
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            Mapa real focado em Uberlândia
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            O mapa agora usa uma base real da cidade e recentraliza
            automaticamente quando o bairro salvo estiver entre os pontos
            mapeados nesta etapa.
          </p>
        </div>

        <div className="grid gap-2 text-sm text-slate-700">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            Cidade: Uberlândia - MG
          </div>
          <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3">
            Bairro: {selectedNeighborhood || "Não definido"}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="h-140 overflow-hidden rounded-[28px] border border-slate-200">
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
                color: "#38bdf8",
                fillColor: "#e0f2fe",
                fillOpacity: 0.15,
                weight: 1.5,
              }}
            />

            {neighborhoodCoordinates.map((neighborhood) => {
              const isSelected = neighborhood.name === selectedNeighborhood;

              return (
                <CircleMarker
                  key={neighborhood.name}
                  center={neighborhood.position}
                  radius={isSelected ? 12 : 8}
                  pathOptions={{
                    color: isSelected ? "#0284c7" : "#7dd3fc",
                    fillColor: isSelected ? "#0284c7" : "#e0f2fe",
                    fillOpacity: isSelected ? 0.95 : 0.9,
                    weight: isSelected ? 2 : 1.5,
                  }}
                >
                  <Tooltip
                    direction="top"
                    offset={[0, -4]}
                    opacity={1}
                    permanent={isSelected}
                  >
                    {neighborhood.name}
                  </Tooltip>
                </CircleMarker>
              );
            })}

            {userLocation ? (
              <CircleMarker
                center={[userLocation.latitude, userLocation.longitude]}
                radius={10}
                pathOptions={{
                  color: "#0f172a",
                  fillColor: "#0f172a",
                  fillOpacity: 0.95,
                  weight: 2,
                }}
              >
                <Tooltip direction="top" offset={[0, -4]} opacity={1} permanent>
                  Sua localização
                </Tooltip>
              </CircleMarker>
            ) : null}

            {recommendedUnits
              .filter(
                (unit) => unit.latitude !== null && unit.longitude !== null,
              )
              .map((unit) => (
                <Marker
                  key={unit.id}
                  position={[unit.latitude as number, unit.longitude as number]}
                >
                  <Popup>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-slate-900">
                        {unit.name}
                      </p>
                      <p className="text-sm text-slate-700">
                        {unit.unitType} • {unit.careLevel}
                      </p>
                      <p className="text-sm text-slate-700">
                        Bairro: {unit.neighborhood ?? "Não informado"}
                      </p>
                      <p className="text-sm text-slate-700">{unit.address}</p>
                      <p className="text-sm text-slate-700">
                        {formatDistance(unit.distanceKm)}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
              Bairro selecionado
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {selectedCoordinate
                ? "O mapa recentraliza automaticamente no ponto aproximado do bairro salvo"
                : "O bairro salvo ainda não tem ponto aproximado"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
              Sintomas
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              O assistente virtual vai orientar quando procurar avaliação
              presencial
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
              Atendimento
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Recomendação de unidades de saúde próximas à localização do
              usuário
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
