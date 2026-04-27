import "dotenv/config";

function readRequiredString(name: string): string {
  const value = process.env[name];

  if (!value || value.trim().length === 0) {
    throw new Error(`Environment variable ${name} is required`);
  }

  return value;
}

function readOptionalString(name: string, fallback = ""): string {
  return process.env[name] ?? fallback;
}

function readPort(name: string, fallback: number): number {
  const raw = process.env[name];

  if (raw === undefined) {
    return fallback;
  }

  const parsed = Number(raw);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`Environment variable ${name} must be a positive number`);
  }

  return parsed;
}

function readBoolean(name: string, fallback: boolean): boolean {
  const raw = process.env[name];

  if (raw === undefined) {
    return fallback;
  }

  return raw.toLowerCase() === "true";
}

function readPositiveNumber(name: string, fallback: number): number {
  const raw = process.env[name];

  if (raw === undefined) {
    return fallback;
  }

  const parsed = Number(raw);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return fallback;
  }

  return parsed;
}

export const env = {
  port: readPort("PORT", 3333),
  nodeEnv: readOptionalString("NODE_ENV", "development"),
  frontendUrl: readOptionalString("FRONTEND_URL", "http://localhost:5173"),
  appPublicUrl: readOptionalString(
    "APP_PUBLIC_URL",
    process.env.FRONTEND_URL ?? "http://localhost:5173",
  ),
  databaseUrl: readRequiredString("DATABASE_URL"),
  weather: {
    apiBaseUrl: readOptionalString(
      "WEATHER_API_BASE_URL",
      "https://api.open-meteo.com/v1",
    ),
    timezone: readOptionalString("WEATHER_TIMEZONE", "America/Sao_Paulo"),
  },
  emailJs: {
    serviceId: readOptionalString("EMAILJS_SERVICE_ID"),
    templateId: readOptionalString("EMAILJS_TEMPLATE_ID"),
    climateAlertTemplateId: readOptionalString(
      "EMAILJS_TEMPLATE_ID_CLIMATE_ALERT",
    ),
    publicKey: readOptionalString("EMAILJS_PUBLIC_KEY"),
    privateKey: readOptionalString("EMAILJS_PRIVATE_KEY"),
  },
  webPush: {
    publicKey: readOptionalString("VAPID_PUBLIC_KEY"),
    privateKey: readOptionalString("VAPID_PRIVATE_KEY"),
    subject: readOptionalString("VAPID_SUBJECT"),
  },
  climateNotifications: {
    automationEnabled: readBoolean(
      "CLIMATE_NOTIFICATION_AUTOMATION_ENABLED",
      false,
    ),
    intervalMinutes: readPositiveNumber(
      "CLIMATE_NOTIFICATION_CHECK_INTERVAL_MINUTES",
      30,
    ),
    startupDelayMs: readPositiveNumber(
      "CLIMATE_NOTIFICATION_STARTUP_DELAY_MS",
      10_000,
    ),
  },
};
