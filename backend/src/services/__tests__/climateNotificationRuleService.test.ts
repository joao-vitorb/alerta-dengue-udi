import { describe, expect, it } from "vitest";
import { evaluateClimateNotificationRule } from "../climateNotificationRuleService";

type RuleContext = Parameters<typeof evaluateClimateNotificationRule>[0];

function buildContext(overrides: Partial<RuleContext> = {}): RuleContext {
  return {
    neighborhood: "Tibery",
    current: {
      temperatureC: null,
      relativeHumidity: null,
      windSpeedKmh: null,
    },
    today: {
      precipitationProbabilityMax: 0,
      precipitationSumMm: 0,
    },
    recent: {
      pastThreeDaysPrecipitationSumMm: 0,
    },
    signals: {
      rainExpectedToday: false,
      recentRainDetected: false,
      warmAndHumidNow: false,
      stagnantWaterFavorable: false,
    },
    preventionWindowScore: 0,
    ...overrides,
  };
}

describe("evaluateClimateNotificationRule", () => {
  it("returns null when no signal is active", () => {
    const rule = evaluateClimateNotificationRule(buildContext());

    expect(rule).toBeNull();
  });

  it("prefers RAIN_AND_RECENT_WATER when rain is expected, recent rain detected, and score >= 2", () => {
    const rule = evaluateClimateNotificationRule(
      buildContext({
        today: { precipitationProbabilityMax: 60, precipitationSumMm: 8 },
        recent: { pastThreeDaysPrecipitationSumMm: 12 },
        signals: {
          rainExpectedToday: true,
          recentRainDetected: true,
          warmAndHumidNow: false,
          stagnantWaterFavorable: true,
        },
        preventionWindowScore: 3,
      }),
    );

    expect(rule).not.toBeNull();
    expect(rule?.ruleKey).toBe("RAIN_AND_RECENT_WATER");
    expect(rule?.severity).toBe("high");
    expect(rule?.title).toContain("Tibery");
  });

  it("falls back to RAIN_EXPECTED_TODAY when recent rain is missing but probability is high", () => {
    const rule = evaluateClimateNotificationRule(
      buildContext({
        today: { precipitationProbabilityMax: 75, precipitationSumMm: 4 },
        signals: {
          rainExpectedToday: true,
          recentRainDetected: false,
          warmAndHumidNow: false,
          stagnantWaterFavorable: true,
        },
        preventionWindowScore: 2,
      }),
    );

    expect(rule?.ruleKey).toBe("RAIN_EXPECTED_TODAY");
    expect(rule?.severity).toBe("attention");
  });

  it("does not raise RAIN_EXPECTED_TODAY when probability is below 50%", () => {
    const rule = evaluateClimateNotificationRule(
      buildContext({
        today: { precipitationProbabilityMax: 40, precipitationSumMm: 6 },
        signals: {
          rainExpectedToday: true,
          recentRainDetected: false,
          warmAndHumidNow: false,
          stagnantWaterFavorable: true,
        },
        preventionWindowScore: 2,
      }),
    );

    expect(rule).toBeNull();
  });

  it("returns RECENT_RAIN_DETECTED when only past rainfall is present and >= 8mm", () => {
    const rule = evaluateClimateNotificationRule(
      buildContext({
        recent: { pastThreeDaysPrecipitationSumMm: 9 },
        signals: {
          rainExpectedToday: false,
          recentRainDetected: true,
          warmAndHumidNow: false,
          stagnantWaterFavorable: true,
        },
        preventionWindowScore: 2,
      }),
    );

    expect(rule?.ruleKey).toBe("RECENT_RAIN_DETECTED");
    expect(rule?.severity).toBe("attention");
  });

  it("does not raise RECENT_RAIN_DETECTED when accumulated rain is below 8mm", () => {
    const rule = evaluateClimateNotificationRule(
      buildContext({
        recent: { pastThreeDaysPrecipitationSumMm: 7 },
        signals: {
          rainExpectedToday: false,
          recentRainDetected: true,
          warmAndHumidNow: false,
          stagnantWaterFavorable: true,
        },
        preventionWindowScore: 2,
      }),
    );

    expect(rule).toBeNull();
  });

  it("returns WARM_AND_HUMID_NOW as the lowest-priority fallback", () => {
    const rule = evaluateClimateNotificationRule(
      buildContext({
        signals: {
          rainExpectedToday: false,
          recentRainDetected: false,
          warmAndHumidNow: true,
          stagnantWaterFavorable: true,
        },
        preventionWindowScore: 2,
      }),
    );

    expect(rule?.ruleKey).toBe("WARM_AND_HUMID_NOW");
    expect(rule?.severity).toBe("attention");
  });

  it("interpolates the neighborhood name into the message", () => {
    const rule = evaluateClimateNotificationRule(
      buildContext({
        neighborhood: "Santa Mônica",
        today: { precipitationProbabilityMax: 80, precipitationSumMm: 0 },
        signals: {
          rainExpectedToday: true,
          recentRainDetected: false,
          warmAndHumidNow: false,
          stagnantWaterFavorable: true,
        },
        preventionWindowScore: 2,
      }),
    );

    expect(rule?.message).toContain("Santa Mônica");
  });
});
