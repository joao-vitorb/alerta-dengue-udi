import cors, { type CorsOptions } from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env";
import { errorHandler } from "./middlewares/errorHandler";
import { notFoundHandler } from "./middlewares/notFoundHandler";
import { generalApiRateLimiter } from "./middlewares/rateLimiters";
import { router } from "./routes";

const WILDCARD_ORIGIN = "*";

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

function isOriginAllowed(origin: string): boolean {
  if (env.allowedOrigins.includes(WILDCARD_ORIGIN)) return true;
  if (env.allowedOrigins.includes(origin)) return true;

  const host = extractHost(origin);
  if (!host) return false;

  return env.allowedOrigins.some((allowed) =>
    matchesSuffixWildcard(host, allowed),
  );
}

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin || isOriginAllowed(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
};

const app = express();

app.set("trust proxy", 1);

app.use(helmet());
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_request, response) => {
  return response.status(200).json({
    name: "API Alerta Dengue UDI",
    status: "running",
  });
});

app.use("/api", generalApiRateLimiter, router);
app.use(notFoundHandler);
app.use(errorHandler);

export { app };
