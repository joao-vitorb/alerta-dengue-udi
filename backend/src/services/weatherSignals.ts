type SignalsInput = {
  todayProbability: number | null;
  todayPrecipitation: number | null;
  pastThreeDaysPrecipitation: number;
  currentTemperature: number | null;
  currentRelativeHumidity: number | null;
};

export type WeatherSignals = {
  rainExpectedToday: boolean;
  recentRainDetected: boolean;
  warmAndHumidNow: boolean;
  stagnantWaterFavorable: boolean;
  preventionWindowScore: number;
};

const RAIN_PROBABILITY_THRESHOLD = 50;
const TODAY_PRECIPITATION_THRESHOLD = 5;
const RECENT_RAIN_THRESHOLD_MM = 8;
const WARM_TEMPERATURE_THRESHOLD = 27;
const HUMID_THRESHOLD = 70;

export function buildWeatherSignals(input: SignalsInput): WeatherSignals {
  const rainExpectedToday =
    (input.todayProbability ?? 0) >= RAIN_PROBABILITY_THRESHOLD ||
    (input.todayPrecipitation ?? 0) >= TODAY_PRECIPITATION_THRESHOLD;

  const recentRainDetected =
    input.pastThreeDaysPrecipitation >= RECENT_RAIN_THRESHOLD_MM;

  const warmAndHumidNow =
    (input.currentTemperature ?? 0) >= WARM_TEMPERATURE_THRESHOLD &&
    (input.currentRelativeHumidity ?? 0) >= HUMID_THRESHOLD;

  const stagnantWaterFavorable =
    rainExpectedToday || recentRainDetected || warmAndHumidNow;

  const preventionWindowScore = [
    rainExpectedToday,
    recentRainDetected,
    warmAndHumidNow,
    stagnantWaterFavorable,
  ].filter(Boolean).length;

  return {
    rainExpectedToday,
    recentRainDetected,
    warmAndHumidNow,
    stagnantWaterFavorable,
    preventionWindowScore,
  };
}
