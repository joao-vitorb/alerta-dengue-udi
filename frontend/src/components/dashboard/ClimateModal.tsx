import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DashboardModalShell } from "./DashboardModalShell";
import type { WeatherContextResponse } from "../../types/weather";
import {
  faCloud,
  faCloudRain,
  faDroplet,
  faTemperatureThreeQuarters,
  faTriangleExclamation,
  faWind,
} from "../../lib/icons";

type ClimateModalProps = {
  isOpen: boolean;
  onClose: () => void;
  data: WeatherContextResponse | null;
  isLoading: boolean;
  errorMessage: string | null;
  alertTitle: string;
  alertDescription: string;
};

function getWeatherLabel(code: number | null | undefined) {
  if (code === null || code === undefined) {
    return "Condição indisponível";
  }

  if ([0].includes(code)) {
    return "Céu limpo";
  }

  if ([1, 2, 3].includes(code)) {
    return "Parcialmente nublado";
  }

  if ([45, 48].includes(code)) {
    return "Neblina";
  }

  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
    return "Chuva";
  }

  if ([71, 73, 75, 85, 86].includes(code)) {
    return "Frio com possibilidade de gelo";
  }

  if ([95, 96, 99].includes(code)) {
    return "Instabilidade intensa";
  }

  return "Condição variável";
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

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
        <div className="rounded-[14px] border border-[#d8dde3] bg-[#edf6fb] px-4 py-8 text-center text-sm text-[#637089] sm:rounded-[18px] sm:px-5 sm:py-10">
          Carregando clima atual...
        </div>
      ) : errorMessage ? (
        <div className="rounded-[14px] border border-[#ffd7d7] bg-[#fff2f2] px-3 py-3 text-sm text-[#bf4040] sm:rounded-[18px] sm:px-4 sm:py-4">
          {errorMessage}
        </div>
      ) : !data ? (
        <div className="rounded-[14px] border border-[#d8dde3] bg-[#edf6fb] px-4 py-8 text-center text-sm text-[#637089] sm:rounded-[18px] sm:px-5 sm:py-10">
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

              <p className="text-[44px] leading-none tracking-[-0.04em] text-[#02051f] sm:text-[52px] lg:text-[58px]">
                {data.current.temperatureC !== null
                  ? `${Math.round(data.current.temperatureC)}°`
                  : "--"}
              </p>
            </div>

            <p className="mt-2 text-[15px] text-[#02051f] sm:text-[16px] lg:text-[18px]">
              {getWeatherLabel(data.current.weatherCode)}
            </p>
          </section>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-5 sm:gap-4">
            <div className="rounded-[14px] border border-[#d8dde3] bg-white px-3 py-3 sm:rounded-[18px] sm:px-5 sm:py-4">
              <div className="flex items-center gap-2 text-[#2f7df6]">
                <FontAwesomeIcon icon={faDroplet} />
                <p className="text-[13px] text-[#7d8699] sm:text-[14px] lg:text-[15px]">
                  Umidade
                </p>
              </div>
              <p className="mt-1 text-[20px] font-medium text-[#02051f] sm:text-[22px] lg:text-[24px]">
                {data.current.relativeHumidity !== null
                  ? `${Math.round(data.current.relativeHumidity)}%`
                  : "--"}
              </p>
            </div>

            <div className="rounded-[14px] border border-[#d8dde3] bg-white px-3 py-3 sm:rounded-[18px] sm:px-5 sm:py-4">
              <div className="flex items-center gap-2 text-[#7d8699]">
                <FontAwesomeIcon icon={faCloudRain} />
                <p className="text-[13px] text-[#7d8699] sm:text-[14px] lg:text-[15px]">
                  Chuva
                </p>
              </div>
              <p className="mt-1 text-[20px] font-medium text-[#02051f] sm:text-[22px] lg:text-[24px]">
                {data.today.precipitationProbabilityMax !== null
                  ? `${Math.round(data.today.precipitationProbabilityMax)}%`
                  : "--"}
              </p>
            </div>

            <div className="col-span-2 rounded-[14px] border border-[#d8dde3] bg-white px-3 py-3 sm:col-span-1 sm:rounded-[18px] sm:px-5 sm:py-4">
              <div className="flex items-center gap-2 text-[#10c0b0]">
                <FontAwesomeIcon icon={faWind} />
                <p className="text-[13px] text-[#7d8699] sm:text-[14px] lg:text-[15px]">
                  Vento
                </p>
              </div>
              <p className="mt-1 text-[20px] font-medium text-[#02051f] sm:text-[22px] lg:text-[24px]">
                {data.current.windSpeedKmh !== null
                  ? `${Math.round(data.current.windSpeedKmh)} km/h`
                  : "--"}
              </p>
            </div>
          </div>

          <section className="mt-4 rounded-[14px] border border-[#f0c86b] bg-[#f8f3e8] px-3 py-3 sm:mt-5 sm:rounded-[18px] sm:px-4 sm:py-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <span className="mt-0.5 text-[18px] text-[#df7c1d] sm:text-[20px]">
                <FontAwesomeIcon icon={faTriangleExclamation} />
              </span>

              <div>
                <p className="text-[15px] font-semibold text-[#a55b14] sm:text-[16px] lg:text-[18px]">
                  {alertTitle}
                </p>
                <p className="mt-1 text-[13px] leading-5 text-[#bd6c1f] sm:text-[14px] sm:leading-6">
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
