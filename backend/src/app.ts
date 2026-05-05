import cors from "cors";
import express from "express";
import helmet from "helmet";
import { corsOptions } from "./config/cors";
import { errorHandler } from "./middlewares/errorHandler";
import { notFoundHandler } from "./middlewares/notFoundHandler";
import { generalApiRateLimiter } from "./middlewares/rateLimiters";
import { router } from "./routes";

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
