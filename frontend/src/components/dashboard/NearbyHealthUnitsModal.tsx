import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { listRecommendedHealthUnits } from "../../services/healthUnitService";
import type { HealthUnit } from "../../types/healthUnit";
import { DashboardModalShell } from "./DashboardModalShell";
import { faLocationDot, faPhone, faRoute } from "../../lib/icons";

type NearbyHealthUnitsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  neighborhood?: string;
  location?: {
    latitude: number;
    longitude: number;
  } | null;
};

function getDirectionsUrl(unit: HealthUnit) {
  if (unit.latitude !== null && unit.longitude !== null) {
    return `https://www.google.com/maps/dir/?api=1&destination=${unit.latitude},${unit.longitude}`;
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(unit.address)}`;
}

function getCallUrl(phone: string | null) {
  if (!phone) {
    return null;
  }

  const digits = phone.replace(/\D/g, "");

  return digits ? `tel:${digits}` : null;
}

function formatDistance(distanceKm?: number | null) {
  if (distanceKm === null || distanceKm === undefined) {
    return "Bairro";
  }

  return `~${Math.round(distanceKm)} km`;
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
    let isMounted = true;

    async function loadUnits() {
      if (!isOpen) {
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await listRecommendedHealthUnits({
          neighborhood,
          latitude: location?.latitude,
          longitude: location?.longitude,
          limit: 6,
        });

        if (!isMounted) {
          return;
        }

        setItems(response.items);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setItems([]);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar as unidades próximas.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadUnits();

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
        <div className="rounded-[14px] border border-[#d8dde3] bg-[#f7f8f9] px-3 py-6 text-center text-sm text-[#697388] sm:rounded-[18px] sm:px-4 sm:py-8">
          Carregando unidades próximas...
        </div>
      ) : errorMessage ? (
        <div className="rounded-[14px] border border-[#ffd7d7] bg-[#fff2f2] px-3 py-3 text-sm text-[#bf4040] sm:rounded-[18px] sm:px-4 sm:py-4">
          {errorMessage}
        </div>
      ) : (
        <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-1 sm:max-h-[72vh] sm:space-y-4">
          {items.map((unit) => {
            const callUrl = getCallUrl(unit.phone);

            return (
              <article
                key={unit.id}
                className="rounded-[14px] border border-[#d9dede] bg-white px-3 py-3 sm:rounded-[18px] sm:px-4 sm:py-4"
              >
                <div className="flex items-start justify-between gap-2 sm:gap-3">
                  <div>
                    <h3 className="text-[15px] font-semibold text-[#02051f] sm:text-[16px] lg:text-[18px]">
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

                <div className="mt-3 flex items-start gap-2 text-[13px] text-[#5c6579] sm:mt-4 sm:text-[14px] lg:text-[15px]">
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
                    className="flex h-10 items-center justify-center gap-2 rounded-lg border border-[#d8dde3] bg-white text-[14px] font-medium text-[#02051f] transition hover:bg-[#f7f8f9] sm:h-11 sm:rounded-xl sm:text-[15px] lg:text-[16px]"
                  >
                    <FontAwesomeIcon icon={faRoute} />
                    Rotas
                  </a>

                  {callUrl ? (
                    <a
                      href={callUrl}
                      className="flex h-10 items-center justify-center gap-2 rounded-lg border border-[#d8dde3] bg-white text-[14px] font-medium text-[#02051f] transition hover:bg-[#f7f8f9] sm:h-11 sm:rounded-xl sm:text-[15px] lg:text-[16px]"
                    >
                      <FontAwesomeIcon icon={faPhone} />
                      Ligar
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="flex h-10 items-center justify-center gap-2 rounded-lg border border-[#e4e7ea] bg-[#f5f7f9] text-[14px] font-medium text-[#9aa1b5] sm:h-11 sm:rounded-xl sm:text-[15px] lg:text-[16px]"
                    >
                      Ligar
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </DashboardModalShell>
  );
}
