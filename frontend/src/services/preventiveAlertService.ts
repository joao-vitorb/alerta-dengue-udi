import { apiClient } from "../lib/apiClient";
import type { PreventiveAlertsResponse } from "../types/preventiveAlert";

export function getPreventiveAlerts(neighborhood: string) {
  return apiClient.get<PreventiveAlertsResponse>("/preventive-alerts", {
    query: { neighborhood },
  });
}
