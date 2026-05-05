import { app } from "./app";
import { env } from "./config/env";
import { logger } from "./lib/logger";
import { startClimateNotificationScheduler } from "./services/climateNotificationAutomationService";

app.listen(env.port, () => {
  logger.info({ port: env.port }, "Server is listening");
  startClimateNotificationScheduler();
});
