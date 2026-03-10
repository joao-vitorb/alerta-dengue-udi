import "dotenv/config";

function parsePort(value: string | undefined) {
  const parsedPort = Number(value ?? "3333");

  if (Number.isNaN(parsedPort)) {
    throw new Error("Invalid PORT value");
  }

  return parsedPort;
}

export const env = {
  port: parsePort(process.env.PORT),
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:5173",
  nodeEnv: process.env.NODE_ENV ?? "development",
};
