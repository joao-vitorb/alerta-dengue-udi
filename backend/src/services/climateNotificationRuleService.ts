type WeatherContextLike = {
  neighborhood: string;
  current: {
    temperatureC: number | null;
    relativeHumidity: number | null;
    windSpeedKmh: number | null;
  };
  today: {
    precipitationProbabilityMax: number | null;
    precipitationSumMm: number | null;
  };
  recent: {
    pastThreeDaysPrecipitationSumMm: number;
  };
  signals: {
    rainExpectedToday: boolean;
    recentRainDetected: boolean;
    warmAndHumidNow: boolean;
    stagnantWaterFavorable: boolean;
  };
  preventionWindowScore: number;
};

export type ClimateNotificationRule = {
  ruleKey: string;
  title: string;
  message: string;
  severity: "attention" | "high";
};

export function evaluateClimateNotificationRule(
  context: WeatherContextLike,
): ClimateNotificationRule | null {
  const neighborhood = context.neighborhood;
  const probability = context.today.precipitationProbabilityMax ?? 0;
  const recentRain = context.recent.pastThreeDaysPrecipitationSumMm ?? 0;

  if (
    context.signals.rainExpectedToday &&
    context.signals.recentRainDetected &&
    context.preventionWindowScore >= 2
  ) {
    return {
      ruleKey: "RAIN_AND_RECENT_WATER",
      title: `Atenção em ${neighborhood}`,
      message:
        `Há combinação de chuva prevista e acúmulo recente de água em ${neighborhood}. ` +
        `Faça hoje uma vistoria rápida em vasos, calhas, ralos e recipientes que possam armazenar água.`,
      severity: "high",
    };
  }

  if (context.signals.rainExpectedToday && probability >= 50) {
    return {
      ruleKey: "RAIN_EXPECTED_TODAY",
      title: `Chuva prevista para ${neighborhood}`,
      message:
        `A previsão aponta maior chance de chuva em ${neighborhood}. ` +
        `Reforce a prevenção e elimine possíveis focos antes do fim do dia.`,
      severity: "attention",
    };
  }

  if (context.signals.recentRainDetected && recentRain >= 8) {
    return {
      ruleKey: "RECENT_RAIN_DETECTED",
      title: `Choveu recentemente em ${neighborhood}`,
      message:
        `Foi detectado volume recente de chuva em ${neighborhood}. ` +
        `Vale revisar quintal, caixas, lonas e recipientes para evitar água parada.`,
      severity: "attention",
    };
  }

  if (context.signals.warmAndHumidNow) {
    return {
      ruleKey: "WARM_AND_HUMID_NOW",
      title: `Condições favoráveis em ${neighborhood}`,
      message:
        `O clima atual em ${neighborhood} está mais quente e úmido, um cenário que pede atenção preventiva. ` +
        `Reserve alguns minutos para vistoriar sua casa hoje.`,
      severity: "attention",
    };
  }

  return null;
}
