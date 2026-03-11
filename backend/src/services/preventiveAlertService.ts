import { getWeatherPreventionContext } from "./weatherService";

type AlertSeverity = "LOW" | "MEDIUM" | "HIGH";

type PreventiveAlert = {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  recommendation: string;
  neighborhood: string;
  reasonTags: string[];
};

type PreventiveAlertsResponse = {
  neighborhood: string;
  generatedAt: string;
  preventionWindowScore: number;
  alerts: PreventiveAlert[];
};

function createAlert(input: PreventiveAlert): PreventiveAlert {
  return input;
}

function buildBaseAlert(
  neighborhood: string,
  preventionWindowScore: number,
): PreventiveAlert {
  if (preventionWindowScore >= 3) {
    return createAlert({
      id: "general-high-prevention",
      severity: "HIGH",
      title: "Condição muito favorável para foco do mosquito",
      description:
        "O clima recente aumenta o risco de acúmulo de água parada e exige atenção redobrada.",
      recommendation:
        "Faça hoje uma vistoria completa em vasos, calhas, ralos, recipientes e áreas externas da casa.",
      neighborhood,
      reasonTags: ["prevention_window_high"],
    });
  }

  if (preventionWindowScore === 2) {
    return createAlert({
      id: "general-medium-prevention",
      severity: "MEDIUM",
      title: "Condição favorável para prevenção ativa",
      description:
        "O cenário climático pede uma rotina preventiva mais cuidadosa nos próximos dias.",
      recommendation:
        "Reserve alguns minutos para revisar possíveis pontos de água parada no imóvel.",
      neighborhood,
      reasonTags: ["prevention_window_medium"],
    });
  }

  return createAlert({
    id: "general-low-prevention",
    severity: "LOW",
    title: "Mantenha a rotina preventiva",
    description:
      "Mesmo sem sinal climático forte, a vistoria periódica continua importante.",
    recommendation:
      "Mantenha a checagem semanal de recipientes, vasos e áreas externas.",
    neighborhood,
    reasonTags: ["prevention_window_low"],
  });
}

export async function getPreventiveAlertsByNeighborhood(
  neighborhood: string,
): Promise<PreventiveAlertsResponse> {
  const weatherContext = await getWeatherPreventionContext(neighborhood);
  const alerts: PreventiveAlert[] = [];

  alerts.push(
    buildBaseAlert(neighborhood, weatherContext.preventionWindowScore),
  );

  if (weatherContext.signals.rainExpectedToday) {
    alerts.push(
      createAlert({
        id: "rain-expected-today",
        severity: "HIGH",
        title: "Chance de chuva hoje",
        description:
          "A previsão indica chuva ou probabilidade elevada de precipitação para hoje.",
        recommendation:
          "Revise recipientes expostos, bandejas, vasos e qualquer ponto que possa acumular água após a chuva.",
        neighborhood,
        reasonTags: ["rain_expected_today", "forecast"],
      }),
    );
  }

  if (weatherContext.signals.recentRainDetected) {
    alerts.push(
      createAlert({
        id: "recent-rain-detected",
        severity: "MEDIUM",
        title: "Choveu recentemente na sua região",
        description:
          "A chuva recente pode ter deixado pontos com água acumulada no entorno da residência.",
        recommendation:
          "Verifique quintal, garagem, laje, calhas, ralos, lonas e recipientes no lado externo da casa.",
        neighborhood,
        reasonTags: ["recent_rain_detected"],
      }),
    );
  }

  if (weatherContext.signals.warmAndHumidNow) {
    alerts.push(
      createAlert({
        id: "warm-and-humid-now",
        severity: "MEDIUM",
        title: "Clima quente e úmido neste momento",
        description:
          "Temperatura e umidade elevadas reforçam a necessidade de atenção preventiva.",
        recommendation:
          "Redobre os cuidados com locais abafados, recipientes abertos e áreas com pouca circulação de ar.",
        neighborhood,
        reasonTags: ["warm_and_humid_now"],
      }),
    );
  }

  if (weatherContext.tomorrow.precipitationProbabilityMax !== null) {
    const tomorrowProbability =
      weatherContext.tomorrow.precipitationProbabilityMax;

    if (tomorrowProbability >= 50) {
      alerts.push(
        createAlert({
          id: "rain-possible-tomorrow",
          severity: "LOW",
          title: "Atenção para a chuva de amanhã",
          description:
            "Há chance relevante de precipitação no próximo dia, o que mantém a janela preventiva ativa.",
          recommendation:
            "Antecipe a vistoria hoje para evitar água parada depois da próxima chuva.",
          neighborhood,
          reasonTags: ["rain_possible_tomorrow"],
        }),
      );
    }
  }

  const uniqueAlerts = alerts.filter(
    (alert, index, array) =>
      array.findIndex((candidate) => candidate.id === alert.id) === index,
  );

  return {
    neighborhood: weatherContext.neighborhood,
    generatedAt: new Date().toISOString(),
    preventionWindowScore: weatherContext.preventionWindowScore,
    alerts: uniqueAlerts,
  };
}
