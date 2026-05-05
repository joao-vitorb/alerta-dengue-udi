import type { CorsOptions } from "cors";
import { env } from "./env";

const WILDCARD_ORIGIN = "*";
const TUNNEL_SUFFIXES = [
  ".trycloudflare.com",
  ".ngrok-free.app",
  ".ngrok.app",
  ".ngrok.io",
];

function isProduction(): boolean {
  return env.nodeEnv === "production";
}

function extractHost(origin: string): string | null {
  try {
    return new URL(origin).host;
  } catch {
    return null;
  }
}

function matchesSuffixWildcard(host: string, allowed: string): boolean {
  if (!allowed.startsWith(".")) return false;

  const bareSuffix = allowed.slice(1);
  return host === bareSuffix || host.endsWith(allowed);
}

function assertAllowedOriginsAreSafe(allowedOrigins: string[]): void {
  if (!isProduction()) return;

  if (allowedOrigins.includes(WILDCARD_ORIGIN)) {
    throw new Error(
      "ALLOWED_ORIGINS contains '*' in production. Refusing to start with an open CORS policy.",
    );
  }

  const tunnelEntries = allowedOrigins.filter((origin) =>
    TUNNEL_SUFFIXES.some((suffix) => origin === suffix || origin.endsWith(suffix)),
  );

  if (tunnelEntries.length > 0) {
    console.warn(
      "[cors] Aviso: ALLOWED_ORIGINS contém domínios de túnel em produção:",
      tunnelEntries,
    );
  }
}

function isOriginAllowed(origin: string): boolean {
  if (env.allowedOrigins.includes(WILDCARD_ORIGIN)) return true;
  if (env.allowedOrigins.includes(origin)) return true;

  const host = extractHost(origin);
  if (!host) return false;

  return env.allowedOrigins.some((allowed) =>
    matchesSuffixWildcard(host, allowed),
  );
}

assertAllowedOriginsAreSafe(env.allowedOrigins);

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin || isOriginAllowed(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
};
