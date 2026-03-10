import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { apiRouter } from "./routes";

const app = express();

app.use(
  cors({
    origin: env.frontendUrl,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_request, response) => {
  return response.status(200).json({
    name: "API Alerta Dengue UDI",
    status: "running",
  });
});

app.use("/api", apiRouter);

export { app };
