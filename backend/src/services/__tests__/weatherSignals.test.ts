import { describe, expect, it } from "vitest";
import { buildWeatherSignals } from "../weatherSignals";

const NEUTRAL_INPUT = {
  todayProbability: 0,
  todayPrecipitation: 0,
  pastThreeDaysPrecipitation: 0,
  currentTemperature: 20,
  currentRelativeHumidity: 50,
};

describe("buildWeatherSignals", () => {
  describe("rainExpectedToday", () => {
    it("is false when probability and precipitation are below thresholds", () => {
      const signals = buildWeatherSignals({
        ...NEUTRAL_INPUT,
        todayProbability: 49,
        todayPrecipitation: 4.9,
      });

      expect(signals.rainExpectedToday).toBe(false);
    });

    it("is true when probability hits the 50% threshold exactly", () => {
      const signals = buildWeatherSignals({
        ...NEUTRAL_INPUT,
        todayProbability: 50,
      });

      expect(signals.rainExpectedToday).toBe(true);
    });

    it("is true when precipitation hits the 5mm threshold exactly", () => {
      const signals = buildWeatherSignals({
        ...NEUTRAL_INPUT,
        todayPrecipitation: 5,
      });

      expect(signals.rainExpectedToday).toBe(true);
    });

    it("treats null probability and null precipitation as zero", () => {
      const signals = buildWeatherSignals({
        ...NEUTRAL_INPUT,
        todayProbability: null,
        todayPrecipitation: null,
      });

      expect(signals.rainExpectedToday).toBe(false);
    });
  });

  describe("recentRainDetected", () => {
    it("is false when accumulated rain is under 8mm", () => {
      const signals = buildWeatherSignals({
        ...NEUTRAL_INPUT,
        pastThreeDaysPrecipitation: 7.9,
      });

      expect(signals.recentRainDetected).toBe(false);
    });

    it("is true when accumulated rain hits 8mm exactly", () => {
      const signals = buildWeatherSignals({
        ...NEUTRAL_INPUT,
        pastThreeDaysPrecipitation: 8,
      });

      expect(signals.recentRainDetected).toBe(true);
    });
  });

  describe("warmAndHumidNow", () => {
    it("requires both temperature and humidity to cross their thresholds", () => {
      const onlyTemperature = buildWeatherSignals({
        ...NEUTRAL_INPUT,
        currentTemperature: 28,
        currentRelativeHumidity: 60,
      });
      const onlyHumidity = buildWeatherSignals({
        ...NEUTRAL_INPUT,
        currentTemperature: 25,
        currentRelativeHumidity: 80,
      });
      const both = buildWeatherSignals({
        ...NEUTRAL_INPUT,
        currentTemperature: 27,
        currentRelativeHumidity: 70,
      });

      expect(onlyTemperature.warmAndHumidNow).toBe(false);
      expect(onlyHumidity.warmAndHumidNow).toBe(false);
      expect(both.warmAndHumidNow).toBe(true);
    });

    it("treats null current readings as zero (no signal)", () => {
      const signals = buildWeatherSignals({
        ...NEUTRAL_INPUT,
        currentTemperature: null,
        currentRelativeHumidity: null,
      });

      expect(signals.warmAndHumidNow).toBe(false);
    });
  });

  describe("preventionWindowScore", () => {
    it("is 0 when no signals are active", () => {
      const signals = buildWeatherSignals(NEUTRAL_INPUT);

      expect(signals.preventionWindowScore).toBe(0);
      expect(signals.stagnantWaterFavorable).toBe(false);
    });

    it("scores 2 when a single boolean signal is active (signal + stagnantWaterFavorable mirror)", () => {
      const signals = buildWeatherSignals({
        ...NEUTRAL_INPUT,
        todayProbability: 80,
      });

      expect(signals.rainExpectedToday).toBe(true);
      expect(signals.stagnantWaterFavorable).toBe(true);
      expect(signals.preventionWindowScore).toBe(2);
    });

    it("reaches the maximum 4 when every condition is satisfied", () => {
      const signals = buildWeatherSignals({
        todayProbability: 90,
        todayPrecipitation: 10,
        pastThreeDaysPrecipitation: 20,
        currentTemperature: 30,
        currentRelativeHumidity: 80,
      });

      expect(signals.preventionWindowScore).toBe(4);
      expect(signals.rainExpectedToday).toBe(true);
      expect(signals.recentRainDetected).toBe(true);
      expect(signals.warmAndHumidNow).toBe(true);
      expect(signals.stagnantWaterFavorable).toBe(true);
    });
  });
});
