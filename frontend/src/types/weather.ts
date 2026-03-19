export type WeatherSignals = {
  rainExpectedToday: boolean;
  recentRainDetected: boolean;
  warmAndHumidNow: boolean;
  stagnantWaterFavorable: boolean;
};

export type WeatherContextResponse = {
  neighborhood: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  source: string;
  fetchedAt: string;
  current: {
    temperatureC: number | null;
    rainMm: number | null;
    relativeHumidity: number | null;
    weatherCode: number | null;
    windSpeedKmh: number | null;
  };
  today: {
    precipitationProbabilityMax: number | null;
    precipitationSumMm: number | null;
    temperatureMaxC: number | null;
    temperatureMinC: number | null;
  };
  tomorrow: {
    precipitationProbabilityMax: number | null;
    precipitationSumMm: number | null;
  };
  recent: {
    pastThreeDaysPrecipitationSumMm: number;
  };
  signals: WeatherSignals;
  preventionWindowScore: number;
};
