import "dotenv/config";

function parsePort(value: string | undefined) {
  const parsedPort = Number(value ?? "3333");

  if (Number.isNaN(parsedPort)) {
    throw new Error("Invalid PORT value");
  }

  return parsedPort;
}

function parseDatabaseUrl(value: string | undefined) {
  if (!value) {
    throw new Error("DATABASE_URL is required");
  }

  return value;
}

export const env = {
  port: parsePort(process.env.PORT),
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:5173",
  nodeEnv: process.env.NODE_ENV ?? "development",
  databaseUrl: parseDatabaseUrl(process.env.DATABASE_URL),
  weatherApiBaseUrl:
    process.env.WEATHER_API_BASE_URL ?? "https://api.open-meteo.com/v1",
  weatherTimezone: process.env.WEATHER_TIMEZONE ?? "America/Sao_Paulo",
  emailJsServiceId: process.env.EMAILJS_SERVICE_ID ?? "",
  emailJsTemplateId: process.env.EMAILJS_TEMPLATE_ID ?? "",
  emailJsPublicKey: process.env.EMAILJS_PUBLIC_KEY ?? "",
  emailJsPrivateKey: process.env.EMAILJS_PRIVATE_KEY ?? "",
  vapidPublicKey: process.env.VAPID_PUBLIC_KEY ?? "",
  vapidPrivateKey: process.env.VAPID_PRIVATE_KEY ?? "",
  vapidSubject: process.env.VAPID_SUBJECT ?? "",
};
