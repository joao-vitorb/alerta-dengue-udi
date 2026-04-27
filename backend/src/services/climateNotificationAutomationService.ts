import { env } from "../config/env";
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

type RunSource = "manual" | "scheduler";

type RunOptions = {
  dryRun?: boolean;
  source?: RunSource;
};

type RunSummary = {
  dryRun: boolean;
  source: RunSource;
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

type WeatherSummaryForRule = {
  probability: number | null;
  recentRainMm: number;
};

const EMAIL_SEND_SPACING_MS = 1100;

let schedulerTimer: NodeJS.Timeout | null = null;
let isRunning = false;

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
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

async function loadActiveUserPreferences(): Promise<ActiveUserPreference[]> {
  const items = await prisma.userPreference.findMany({
    where: {
      notificationsEnabled: true,
      neighborhood: { not: "" },
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
    .filter((item) => item.neighborhood.trim().length > 0)
    .map((item) => ({
      anonymousId: item.anonymousId,
      neighborhood: item.neighborhood.trim(),
      email: item.email?.trim() ? item.email.trim() : null,
      emailNotificationsEnabled: item.emailNotificationsEnabled,
      pushNotificationsEnabled: item.pushNotificationsEnabled,
    }));
}

function groupPreferencesByNeighborhood(items: ActiveUserPreference[]) {
  const map = new Map<string, ActiveUserPreference[]>();

  for (const item of items) {
    const bucket = map.get(item.neighborhood) ?? [];

    bucket.push(item);
    map.set(item.neighborhood, bucket);
  }

  return map;
}

async function deliverEmailNotification(input: {
  preference: ActiveUserPreference;
  rule: ClimateNotificationRule;
  neighborhood: string;
  windowKey: string;
  weather: WeatherSummaryForRule;
  summary: RunSummary;
}) {
  input.summary.emailEligible += 1;

  if (input.summary.dryRun) {
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
    await sleep(EMAIL_SEND_SPACING_MS);
    return;
  }

  input.summary.emailFailed += 1;
}

async function deliverPushNotification(input: {
  preference: ActiveUserPreference;
  rule: ClimateNotificationRule;
  neighborhood: string;
  windowKey: string;
  summary: RunSummary;
}) {
  const subscriptions = await listActivePushSubscriptions(
    input.preference.anonymousId,
  );

  if (subscriptions.length === 0) {
    return;
  }

  input.summary.pushEligible += 1;

  if (input.summary.dryRun) {
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

async function deliverChannelIfNeeded(input: {
  channel: ClimateNotificationChannel;
  preference: ActiveUserPreference;
  rule: ClimateNotificationRule;
  neighborhood: string;
  windowKey: string;
  weather: WeatherSummaryForRule;
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
    await deliverEmailNotification(input);
    return;
  }

  await deliverPushNotification(input);
}

async function processNeighborhood(input: {
  neighborhood: string;
  preferences: ActiveUserPreference[];
  windowKey: string;
  summary: RunSummary;
}) {
  input.summary.neighborhoodsEvaluated += 1;

  let weatherContext;

  try {
    weatherContext = await getWeatherPreventionContext(input.neighborhood);
  } catch {
    return;
  }

  const rule = evaluateClimateNotificationRule(weatherContext);

  if (!rule) {
    return;
  }

  input.summary.neighborhoodsTriggered += 1;
  input.summary.triggeredNeighborhoods.push(input.neighborhood);

  const weather: WeatherSummaryForRule = {
    probability: weatherContext.today.precipitationProbabilityMax,
    recentRainMm: weatherContext.recent.pastThreeDaysPrecipitationSumMm,
  };

  for (const preference of input.preferences) {
    if (preference.emailNotificationsEnabled && preference.email) {
      await deliverChannelIfNeeded({
        channel: "EMAIL",
        preference,
        rule,
        neighborhood: input.neighborhood,
        windowKey: input.windowKey,
        weather,
        summary: input.summary,
      });
    }

    if (preference.pushNotificationsEnabled) {
      await deliverChannelIfNeeded({
        channel: "PUSH",
        preference,
        rule,
        neighborhood: input.neighborhood,
        windowKey: input.windowKey,
        weather,
        summary: input.summary,
      });
    }
  }
}

export async function runAutomatedClimateNotificationCycle(
  options: RunOptions = {},
): Promise<RunSummary> {
  if (isRunning) {
    return buildInitialSummary(options);
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
      await processNeighborhood({
        neighborhood,
        preferences: neighborhoodPreferences,
        windowKey,
        summary,
      });
    }

    return summary;
  } finally {
    isRunning = false;
  }
}

export function startClimateNotificationScheduler() {
  if (!env.climateNotifications.automationEnabled || schedulerTimer) {
    return;
  }

  const intervalMs = env.climateNotifications.intervalMinutes * 60 * 1000;

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
  }, env.climateNotifications.startupDelayMs).unref();

  schedulerTimer = setInterval(() => {
    void runScheduledCycle();
  }, intervalMs);

  schedulerTimer.unref();
}
