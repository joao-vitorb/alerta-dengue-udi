export type PreventiveAlertSeverity = "LOW" | "MEDIUM" | "HIGH";

export type PreventiveAlert = {
  id: string;
  severity: PreventiveAlertSeverity;
  title: string;
  description: string;
  recommendation: string;
  neighborhood: string;
  reasonTags: string[];
};

export type PreventiveAlertsResponse = {
  neighborhood: string;
  generatedAt: string;
  preventionWindowScore: number;
  alerts: PreventiveAlert[];
};
