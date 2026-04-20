import { app } from "./app";
import { env } from "./config/env";
import { startClimateNotificationScheduler } from "./services/climateNotificationAutomationService";

app.listen(env.port, () => {
  console.log(`Server running on http://localhost:${env.port}`);
  startClimateNotificationScheduler();
});
