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
};
