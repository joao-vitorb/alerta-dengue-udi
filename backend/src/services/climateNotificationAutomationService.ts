import { prisma } from "../lib/prisma";
import {
  createClimateNotificationLog,
  ensureClimateNotificationLogTable,
  getClimateNotificationWindowKey,
  hasSentClimateNotification,
  type ClimateNotificationChannel,
} from "./climateNotificationLogService";
import {
  listActivePushSubscriptions,
  sendAutomatedClimateEmail,
  sendAutomatedClimatePush,
} from "./climateNotificationDeliveryService";
import {
  evaluateClimateNotificationRule,
  type ClimateNotificationRule,
} from "./climateNotificationRuleService";
import { getWeatherPreventionContext } from "./weatherService";

type ActiveUserPreference = {
  anonymousId: string;
  neighborhood: string;
  email: string | null;
  emailNotificationsEnabled: boolean;
  pushNotificationsEnabled: boolean;
};

type RunOptions = {
  dryRun?: boolean;
  source?: "manual" | "scheduler";
};

type RunSummary = {
  dryRun: boolean;
  source: "manual" | "scheduler";
  neighborhoodsEvaluated: number;
  neighborhoodsTriggered: number;
  usersEvaluated: number;
  emailEligible: number;
  pushEligible: number;
  emailSent: number;
  emailFailed: number;
  pushSent: number;
  pushFailed: number;
  duplicateSkips: number;
  triggeredNeighborhoods: string[];
};

const defaultIntervalMinutes = 30;
const defaultStartupDelayMs = 10000;
const emailSendSpacingMs = 1100;

let schedulerTimer: NodeJS.Timeout | null = null;
let isRunning = false;

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

function getAutomationEnabled() {
  return process.env.CLIMATE_NOTIFICATION_AUTOMATION_ENABLED === "true";
}

function getSchedulerIntervalMs() {
  const rawValue = Number(
    process.env.CLIMATE_NOTIFICATION_CHECK_INTERVAL_MINUTES ??
      defaultIntervalMinutes,
  );

  if (!Number.isFinite(rawValue) || rawValue <= 0) {
    return defaultIntervalMinutes * 60 * 1000;
  }

  return rawValue * 60 * 1000;
}

function getStartupDelayMs() {
  const rawValue = Number(
    process.env.CLIMATE_NOTIFICATION_STARTUP_DELAY_MS ?? defaultStartupDelayMs,
  );

  if (!Number.isFinite(rawValue) || rawValue < 0) {
    return defaultStartupDelayMs;
  }

  return rawValue;
}

function buildInitialSummary(options: RunOptions): RunSummary {
  return {
    dryRun: options.dryRun ?? false,
    source: options.source ?? "manual",
    neighborhoodsEvaluated: 0,
    neighborhoodsTriggered: 0,
    usersEvaluated: 0,
    emailEligible: 0,
    pushEligible: 0,
    emailSent: 0,
    emailFailed: 0,
    pushSent: 0,
    pushFailed: 0,
    duplicateSkips: 0,
    triggeredNeighborhoods: [],
  };
}

function normalizeNeighborhood(value: string) {
  return value.trim();
}

async function loadActiveUserPreferences() {
  const items = await prisma.userPreference.findMany({
    where: {
      notificationsEnabled: true,
      neighborhood: {
        not: "",
      },
    },
    select: {
      anonymousId: true,
      neighborhood: true,
      email: true,
      emailNotificationsEnabled: true,
      pushNotificationsEnabled: true,
    },
  });

  return items
    .filter(
      (item) =>
        typeof item.anonymousId === "string" &&
        typeof item.neighborhood === "string" &&
        item.neighborhood.trim().length > 0,
    )
    .map((item) => ({
      anonymousId: item.anonymousId,
      neighborhood: item.neighborhood.trim(),
      email:
        typeof item.email === "string" && item.email.trim().length > 0
          ? item.email.trim()
          : null,
      emailNotificationsEnabled: Boolean(item.emailNotificationsEnabled),
      pushNotificationsEnabled: Boolean(item.pushNotificationsEnabled),
    }));
}

function groupPreferencesByNeighborhood(items: ActiveUserPreference[]) {
  const map = new Map<string, ActiveUserPreference[]>();

  for (const item of items) {
    const key = item.neighborhood;

    if (!map.has(key)) {
      map.set(key, []);
    }

    map.get(key)?.push(item);
  }

  return map;
}

async function handleChannelDelivery(input: {
  channel: ClimateNotificationChannel;
  preference: ActiveUserPreference;
  rule: ClimateNotificationRule;
  neighborhood: string;
  windowKey: string;
  dryRun: boolean;
  weather: {
    probability: number | null;
    recentRainMm: number;
  };
  summary: RunSummary;
}) {
  const alreadySent = await hasSentClimateNotification({
    anonymousId: input.preference.anonymousId,
    channel: input.channel,
    ruleKey: input.rule.ruleKey,
    windowKey: input.windowKey,
  });

  if (alreadySent) {
    input.summary.duplicateSkips += 1;
    return;
  }

  if (input.channel === "EMAIL") {
    input.summary.emailEligible += 1;

    if (input.dryRun) {
      return;
    }

    const result = await sendAutomatedClimateEmail({
      to: input.preference.email as string,
      neighborhood: input.neighborhood,
      rule: input.rule,
      weather: input.weather,
    });

    await createClimateNotificationLog({
      anonymousId: input.preference.anonymousId,
      neighborhood: input.neighborhood,
      channel: "EMAIL",
      ruleKey: input.rule.ruleKey,
      windowKey: input.windowKey,
      status: result.delivered ? "SENT" : "FAILED",
      message: input.rule.message,
      metadata: result.metadata ?? { reason: result.reason },
    });

    if (result.delivered) {
      input.summary.emailSent += 1;
      await sleep(emailSendSpacingMs);
      return;
    }

    input.summary.emailFailed += 1;
    return;
  }

  const subscriptions = await listActivePushSubscriptions(
    input.preference.anonymousId,
  );

  if (subscriptions.length === 0) {
    return;
  }

  input.summary.pushEligible += 1;

  if (input.dryRun) {
    return;
  }

  const result = await sendAutomatedClimatePush({
    subscriptions,
    neighborhood: input.neighborhood,
    rule: input.rule,
  });

  await createClimateNotificationLog({
    anonymousId: input.preference.anonymousId,
    neighborhood: input.neighborhood,
    channel: "PUSH",
    ruleKey: input.rule.ruleKey,
    windowKey: input.windowKey,
    status: result.delivered ? "SENT" : "FAILED",
    message: input.rule.message,
    metadata: result.metadata ?? { reason: result.reason },
  });

  if (result.delivered) {
    input.summary.pushSent += 1;
    return;
  }

  input.summary.pushFailed += 1;
}

export async function runAutomatedClimateNotificationCycle(
  options: RunOptions = {},
) {
  if (isRunning) {
    return {
      ...buildInitialSummary(options),
      triggeredNeighborhoods: [],
    };
  }

  isRunning = true;

  try {
    await ensureClimateNotificationLogTable();

    const summary = buildInitialSummary(options);
    const windowKey = getClimateNotificationWindowKey();

    const preferences = await loadActiveUserPreferences();
    summary.usersEvaluated = preferences.length;

    const groupedPreferences = groupPreferencesByNeighborhood(preferences);

    for (const [neighborhood, neighborhoodPreferences] of groupedPreferences) {
      summary.neighborhoodsEvaluated += 1;

      let weatherContext;

      try {
        weatherContext = await getWeatherPreventionContext(neighborhood);
      } catch {
        continue;
      }

      const rule = evaluateClimateNotificationRule(weatherContext);

      if (!rule) {
        continue;
      }

      summary.neighborhoodsTriggered += 1;
      summary.triggeredNeighborhoods.push(neighborhood);

      for (const preference of neighborhoodPreferences) {
        if (preference.emailNotificationsEnabled && preference.email) {
          await handleChannelDelivery({
            channel: "EMAIL",
            preference,
            rule,
            neighborhood,
            windowKey,
            dryRun: summary.dryRun,
            weather: {
              probability: weatherContext.today.precipitationProbabilityMax,
              recentRainMm:
                weatherContext.recent.pastThreeDaysPrecipitationSumMm,
            },
            summary,
          });
        }

        if (preference.pushNotificationsEnabled) {
          await handleChannelDelivery({
            channel: "PUSH",
            preference,
            rule,
            neighborhood,
            windowKey,
            dryRun: summary.dryRun,
            weather: {
              probability: weatherContext.today.precipitationProbabilityMax,
              recentRainMm:
                weatherContext.recent.pastThreeDaysPrecipitationSumMm,
            },
            summary,
          });
        }
      }
    }

    return summary;
  } finally {
    isRunning = false;
  }
}

export function startClimateNotificationScheduler() {
  if (!getAutomationEnabled() || schedulerTimer) {
    return;
  }

  const runScheduledCycle = async () => {
    try {
      await runAutomatedClimateNotificationCycle({
        dryRun: false,
        source: "scheduler",
      });
    } catch (error) {
      console.error("Climate notification scheduler failed:", error);
    }
  };

  setTimeout(() => {
    void runScheduledCycle();
  }, getStartupDelayMs()).unref();

  schedulerTimer = setInterval(() => {
    void runScheduledCycle();
  }, getSchedulerIntervalMs());

  schedulerTimer.unref();
}
