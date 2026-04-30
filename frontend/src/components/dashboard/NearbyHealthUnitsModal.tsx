import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { faLocationDot, faPhone, faRoute } from "../../lib/icons";
import { listRecommendedHealthUnits } from "../../services/healthUnitService";
import type { HealthUnit } from "../../types/healthUnit";
import { getErrorMessage } from "../../utils/errorMessage";
import { DashboardModalShell } from "./DashboardModalShell";

type NearbyHealthUnitsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  neighborhood?: string;
  location?: {
    latitude: number;
    longitude: number;
  } | null;
};

const RECOMMENDED_LIMIT = 6;
const FALLBACK_ERROR_MESSAGE =
  "Não foi possível carregar as unidades próximas.";

function getDirectionsUrl(unit: HealthUnit) {
  if (unit.latitude !== null && unit.longitude !== null) {
    return `https://www.google.com/maps/dir/?api=1&destination=${unit.latitude},${unit.longitude}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(unit.address)}`;
}

function getCallUrl(phone: string | null) {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  return digits ? `tel:${digits}` : null;
}

function formatDistance(distanceKm?: number | null) {
  if (distanceKm === null || distanceKm === undefined) return "Bairro";
  return `~${Math.round(distanceKm)} km`;
}

function HealthUnitCard({ unit }: { unit: HealthUnit }) {
  const callUrl = getCallUrl(unit.phone);

  return (
    <article className="rounded-[14px] border border-border-modal bg-white px-3 py-3 sm:rounded-[18px] sm:px-4 sm:py-4">
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <div>
          <h3 className="text-[15px] font-semibold text-brand-dark sm:text-[16px] lg:text-[18px]">
            {unit.name}
          </h3>
          <p className="mt-1 text-[13px] text-[#7e8599] sm:text-[14px]">
            {unit.unitType}
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-[#d8f5e9] px-2 py-0.5 text-[12px] font-medium text-[#2d8f73] sm:px-3 sm:py-1 sm:text-[13px]">
          {formatDistance(unit.distanceKm)}
        </span>
      </div>

      <div className="mt-3 flex items-start gap-2 text-[13px] text-text-secondary sm:mt-4 sm:text-[14px] lg:text-[15px]">
        <span className="mt-1 text-[#7d8497]">
          <FontAwesomeIcon icon={faLocationDot} />
        </span>
        <p>{unit.address}</p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:gap-3">
        <a
          href={getDirectionsUrl(unit)}
          target="_blank"
          rel="noreferrer"
          className="flex h-10 items-center justify-center gap-2 rounded-lg border border-border-card bg-white text-[14px] font-medium text-brand-dark transition hover:bg-surface-muted sm:h-11 sm:rounded-xl sm:text-[15px] lg:text-[16px]"
        >
          <FontAwesomeIcon icon={faRoute} />
          Rotas
        </a>

        {callUrl ? (
          <a
            href={callUrl}
            className="flex h-10 items-center justify-center gap-2 rounded-lg border border-border-card bg-white text-[14px] font-medium text-brand-dark transition hover:bg-surface-muted sm:h-11 sm:rounded-xl sm:text-[15px] lg:text-[16px]"
          >
            <FontAwesomeIcon icon={faPhone} />
            Ligar
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="flex h-10 items-center justify-center gap-2 rounded-lg border border-[#e4e7ea] bg-surface-muted text-[14px] font-medium text-text-muted sm:h-11 sm:rounded-xl sm:text-[15px] lg:text-[16px]"
          >
            Ligar
          </button>
        )}
      </div>
    </article>
  );
}

export function NearbyHealthUnitsModal({
  isOpen,
  onClose,
  neighborhood,
  location,
}: NearbyHealthUnitsModalProps) {
  const [items, setItems] = useState<HealthUnit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    setIsLoading(true);
    setErrorMessage(null);

    listRecommendedHealthUnits({
      neighborhood,
      latitude: location?.latitude,
      longitude: location?.longitude,
      limit: RECOMMENDED_LIMIT,
    })
      .then((response) => {
        if (!isMounted) return;
        setItems(response.items);
      })
      .catch((error: unknown) => {
        if (!isMounted) return;
        setItems([]);
        setErrorMessage(getErrorMessage(error, FALLBACK_ERROR_MESSAGE));
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, neighborhood, location?.latitude, location?.longitude]);

  return (
    <DashboardModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Postos de Saúde Próximos"
      icon={<FontAwesomeIcon icon={faLocationDot} className="text-[18px]" />}
    >
      {isLoading ? (
        <div className="rounded-[14px] border border-border-card bg-surface-muted px-3 py-6 text-center text-sm text-[#697388] sm:rounded-[18px] sm:px-4 sm:py-8">
          Carregando unidades próximas...
        </div>
      ) : errorMessage ? (
        <div className="rounded-[14px] border border-error-border bg-error-bg px-3 py-3 text-sm text-error-text sm:rounded-[18px] sm:px-4 sm:py-4">
          {errorMessage}
        </div>
      ) : (
        <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-1 sm:max-h-[72vh] sm:space-y-4">
          {items.map((unit) => (
            <HealthUnitCard key={unit.id} unit={unit} />
          ))}
        </div>
      )}
    </DashboardModalShell>
  );
}
