import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloud,
  faCloudRain,
  faDroplet,
  faTemperatureThreeQuarters,
  faTriangleExclamation,
  faWind,
} from "../../lib/icons";
import type { WeatherContextResponse } from "../../types/weather";
import { DashboardModalShell } from "./DashboardModalShell";

type ClimateModalProps = {
  isOpen: boolean;
  onClose: () => void;
  data: WeatherContextResponse | null;
  isLoading: boolean;
  errorMessage: string | null;
  alertTitle: string;
  alertDescription: string;
};

const WEATHER_LABEL_BY_CODE_RANGE: Array<{
  codes: number[];
  label: string;
}> = [
  { codes: [0], label: "Céu limpo" },
  { codes: [1, 2, 3], label: "Parcialmente nublado" },
  { codes: [45, 48], label: "Neblina" },
  { codes: [51, 53, 55, 61, 63, 65, 80, 81, 82], label: "Chuva" },
  { codes: [71, 73, 75, 85, 86], label: "Frio com possibilidade de gelo" },
  { codes: [95, 96, 99], label: "Instabilidade intensa" },
];

function getWeatherLabel(code: number | null | undefined) {
  if (code === null || code === undefined) return "Condição indisponível";

  for (const { codes, label } of WEATHER_LABEL_BY_CODE_RANGE) {
    if (codes.includes(code)) return label;
  }

  return "Condição variável";
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPercentage(value: number | null) {
  return value !== null ? `${Math.round(value)}%` : "--";
}

function formatTemperature(value: number | null) {
  return value !== null ? `${Math.round(value)}°` : "--";
}

function formatWindSpeed(value: number | null) {
  return value !== null ? `${Math.round(value)} km/h` : "--";
}

type WeatherMetricCardProps = {
  iconColor: string;
  icon: typeof faDroplet;
  label: string;
  value: string;
  className?: string;
};

function WeatherMetricCard({
  iconColor,
  icon,
  label,
  value,
  className = "",
}: WeatherMetricCardProps) {
  return (
    <div
      className={`rounded-[14px] border border-border-card bg-white px-3 py-3 sm:rounded-[18px] sm:px-5 sm:py-4 ${className}`}
    >
      <div className={`flex items-center gap-2 ${iconColor}`}>
        <FontAwesomeIcon icon={icon} />
        <p className="text-[13px] text-[#7d8699] sm:text-[14px] lg:text-[15px]">
          {label}
        </p>
      </div>
      <p className="mt-1 text-[20px] font-medium text-brand-dark sm:text-[22px] lg:text-[24px]">
        {value}
      </p>
    </div>
  );
}

const STATUS_BOX_CLASSES =
  "rounded-[14px] border border-border-card bg-[#edf6fb] px-4 py-8 text-center text-sm text-[#637089] sm:rounded-[18px] sm:px-5 sm:py-10";

const ERROR_BOX_CLASSES =
  "rounded-[14px] border border-error-border bg-error-bg px-3 py-3 text-sm text-error-text sm:rounded-[18px] sm:px-4 sm:py-4";

export function ClimateModal({
  isOpen,
  onClose,
  data,
  isLoading,
  errorMessage,
  alertTitle,
  alertDescription,
}: ClimateModalProps) {
  return (
    <DashboardModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Clima em Uberlândia"
      icon={<FontAwesomeIcon icon={faCloud} className="text-[18px]" />}
    >
      {isLoading ? (
        <div className={STATUS_BOX_CLASSES}>Carregando clima atual...</div>
      ) : errorMessage ? (
        <div className={ERROR_BOX_CLASSES}>{errorMessage}</div>
      ) : !data ? (
        <div className={STATUS_BOX_CLASSES}>
          Nenhum dado climático disponível.
        </div>
      ) : (
        <div>
          <section className="rounded-[14px] border border-[#cddce5] bg-[#eef6fb] px-4 py-4 text-center sm:rounded-[18px] sm:px-6 sm:py-5">
            <p className="text-[15px] text-[#70778b] sm:text-[16px] lg:text-[18px]">
              Agora
            </p>

            <div className="mt-2 flex items-center justify-center gap-2 sm:gap-3">
              <span className="text-[22px] text-[#ff6a00] sm:text-[26px] lg:text-[28px]">
                <FontAwesomeIcon icon={faTemperatureThreeQuarters} />
              </span>

              <p className="text-[44px] leading-none tracking-[-0.04em] text-brand-dark sm:text-[52px] lg:text-[58px]">
                {formatTemperature(data.current.temperatureC)}
              </p>
            </div>

            <p className="mt-2 text-[15px] text-brand-dark sm:text-[16px] lg:text-[18px]">
              {getWeatherLabel(data.current.weatherCode)}
            </p>
          </section>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-5 sm:gap-4">
            <WeatherMetricCard
              iconColor="text-[#2f7df6]"
              icon={faDroplet}
              label="Umidade"
              value={formatPercentage(data.current.relativeHumidity)}
            />

            <WeatherMetricCard
              iconColor="text-[#7d8699]"
              icon={faCloudRain}
              label="Chuva"
              value={formatPercentage(data.today.precipitationProbabilityMax)}
            />

            <WeatherMetricCard
              className="col-span-2 sm:col-span-1"
              iconColor="text-[#10c0b0]"
              icon={faWind}
              label="Vento"
              value={formatWindSpeed(data.current.windSpeedKmh)}
            />
          </div>

          <section className="mt-4 rounded-[14px] border border-warning-border bg-warning-bg px-3 py-3 sm:mt-5 sm:rounded-[18px] sm:px-4 sm:py-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <span className="mt-0.5 text-[18px] text-warning-icon sm:text-[20px]">
                <FontAwesomeIcon icon={faTriangleExclamation} />
              </span>

              <div>
                <p className="text-[15px] font-semibold text-warning-title sm:text-[16px] lg:text-[18px]">
                  {alertTitle}
                </p>
                <p className="mt-1 text-[13px] leading-5 text-warning-body sm:text-[14px] sm:leading-6">
                  {alertDescription}
                </p>
              </div>
            </div>
          </section>

          <p className="mt-4 text-center text-[13px] text-[#71798f] sm:mt-5 sm:text-[14px]">
            Última atualização: {formatTime(data.fetchedAt)}
          </p>
        </div>
      )}
    </DashboardModalShell>
  );
}
