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
        <div className="rounded-[18px] border border-[#d8dde3] bg-[#edf6fb] px-5 py-10 text-center text-sm text-[#637089]">
          Carregando clima atual...
        </div>
      ) : errorMessage ? (
        <div className="rounded-[18px] border border-[#ffd7d7] bg-[#fff2f2] px-4 py-4 text-sm text-[#bf4040]">
          {errorMessage}
        </div>
      ) : !data ? (
        <div className="rounded-[18px] border border-[#d8dde3] bg-[#edf6fb] px-5 py-10 text-center text-sm text-[#637089]">
          Nenhum dado climático disponível.
        </div>
      ) : (
        <div>
          <section className="rounded-[18px] border border-[#cddce5] bg-[#eef6fb] px-6 py-5 text-center">
            <p className="text-[18px] text-[#70778b]">Agora</p>

            <div className="mt-2 flex items-center justify-center gap-3">
              <span className="text-[28px] text-[#ff6a00]">
                <FontAwesomeIcon icon={faTemperatureThreeQuarters} />
              </span>

              <p className="text-[58px] leading-none tracking-[-0.04em] text-[#02051f]">
                {data.current.temperatureC !== null
                  ? `${Math.round(data.current.temperatureC)}°`
                  : "--"}
              </p>
            </div>

            <p className="mt-2 text-[18px] text-[#02051f]">
              {getWeatherLabel(data.current.weatherCode)}
            </p>
          </section>

          <div className="mt-5 grid grid-cols-2 gap-4">
            <div className="rounded-[18px] border border-[#d8dde3] bg-white px-5 py-4">
              <div className="flex items-center gap-2 text-[#2f7df6]">
                <FontAwesomeIcon icon={faDroplet} />
                <p className="text-[15px] text-[#7d8699]">Umidade</p>
              </div>
              <p className="mt-1 text-[24px] font-medium text-[#02051f]">
                {data.current.relativeHumidity !== null
                  ? `${Math.round(data.current.relativeHumidity)}%`
                  : "--"}
              </p>
            </div>

            <div className="rounded-[18px] border border-[#d8dde3] bg-white px-5 py-4">
              <div className="flex items-center gap-2 text-[#7d8699]">
                <FontAwesomeIcon icon={faCloudRain} />
                <p className="text-[15px] text-[#7d8699]">Chuva</p>
              </div>
              <p className="mt-1 text-[24px] font-medium text-[#02051f]">
                {data.today.precipitationProbabilityMax !== null
                  ? `${Math.round(data.today.precipitationProbabilityMax)}%`
                  : "--"}
              </p>
            </div>

            <div className="rounded-[18px] border border-[#d8dde3] bg-white px-5 py-4">
              <div className="flex items-center gap-2 text-[#10c0b0]">
                <FontAwesomeIcon icon={faWind} />
                <p className="text-[15px] text-[#7d8699]">Vento</p>
              </div>
              <p className="mt-1 text-[24px] font-medium text-[#02051f]">
                {data.current.windSpeedKmh !== null
                  ? `${Math.round(data.current.windSpeedKmh)} km/h`
                  : "--"}
              </p>
            </div>
          </div>

          <section className="mt-5 rounded-[18px] border border-[#f0c86b] bg-[#f8f3e8] px-4 py-4">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-[20px] text-[#df7c1d]">
                <FontAwesomeIcon icon={faTriangleExclamation} />
              </span>

              <div>
                <p className="text-[18px] font-semibold text-[#a55b14]">
                  {alertTitle}
                </p>
                <p className="mt-1 text-[14px] leading-6 text-[#bd6c1f]">
                  {alertDescription}
                </p>
              </div>
            </div>
          </section>

          <p className="mt-5 text-center text-[14px] text-[#71798f]">
            Última atualização: {formatTime(data.fetchedAt)}
          </p>
        </div>
      )}
    </DashboardModalShell>
  );
}
