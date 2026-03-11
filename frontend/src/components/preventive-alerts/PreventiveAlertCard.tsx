import type { PreventiveAlert } from "../../types/preventiveAlert";

type PreventiveAlertCardProps = {
  alert: PreventiveAlert;
};

function getSeverityLabel(severity: PreventiveAlert["severity"]) {
  switch (severity) {
    case "HIGH":
      return "Alta prioridade";
    case "MEDIUM":
      return "Atenção moderada";
    case "LOW":
      return "Rotina preventiva";
    default:
      return severity;
  }
}

function getSeverityClasses(severity: PreventiveAlert["severity"]) {
  switch (severity) {
    case "HIGH":
      return {
        container: "border-amber-200 bg-amber-50",
        badge: "border-amber-200 bg-white text-amber-700",
      };
    case "MEDIUM":
      return {
        container: "border-sky-200 bg-sky-50",
        badge: "border-sky-200 bg-white text-sky-700",
      };
    case "LOW":
      return {
        container: "border-slate-200 bg-slate-50",
        badge: "border-slate-200 bg-white text-slate-700",
      };
    default:
      return {
        container: "border-slate-200 bg-slate-50",
        badge: "border-slate-200 bg-white text-slate-700",
      };
  }
}

export function PreventiveAlertCard({ alert }: PreventiveAlertCardProps) {
  const severityClasses = getSeverityClasses(alert.severity);

  return (
    <article
      className={`rounded-[28px] border p-5 ${severityClasses.container}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
            Alerta preventivo
          </p>
          <h3 className="mt-2 text-lg font-semibold leading-7 text-slate-900">
            {alert.title}
          </h3>
        </div>

        <span
          className={`rounded-full border px-3 py-1 text-xs font-medium ${severityClasses.badge}`}
        >
          {getSeverityLabel(alert.severity)}
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-600">
        {alert.description}
      </p>

      <div className="mt-4 rounded-2xl border border-white/70 bg-white/80 px-4 py-3">
        <p className="text-sm font-medium text-slate-800">Recomendação</p>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          {alert.recommendation}
        </p>
      </div>
    </article>
  );
}
