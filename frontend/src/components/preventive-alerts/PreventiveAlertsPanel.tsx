import { useMemo } from "react";
import { usePreventiveAlerts } from "../../hooks/usePreventiveAlerts";
import { PreventiveAlertCard } from "./PreventiveAlertCard";

type PreventiveAlertsPanelProps = {
  selectedNeighborhood?: string;
};

export function PreventiveAlertsPanel({
  selectedNeighborhood,
}: PreventiveAlertsPanelProps) {
  const { data, isLoading, errorMessage, hasAlerts } =
    usePreventiveAlerts(selectedNeighborhood);

  const generatedAtLabel = useMemo(() => {
    if (!data) {
      return "Pendente";
    }

    return new Date(data.generatedAt).toLocaleString("pt-BR");
  }, [data]);

  return (
    <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">
            Alertas preventivos
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900">
            Recomendações baseadas no clima do seu bairro
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            O sistema já transforma o contexto climático em alertas práticos
            para orientar vistoria, prevenção e atenção com possíveis focos do
            mosquito.
          </p>
        </div>

        <div className="text-sm text-slate-700">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            Atualizado em {generatedAtLabel}
          </div>
        </div>
      </div>

      {!selectedNeighborhood ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-600">
          Defina um bairro no onboarding ou nas configurações para carregar
          alertas preventivos.
        </div>
      ) : isLoading ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-600">
          Carregando alertas preventivos...
        </div>
      ) : errorMessage ? (
        <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-5 text-sm text-rose-700">
          {errorMessage}
        </div>
      ) : !hasAlerts || !data ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-600">
          Nenhum alerta preventivo foi gerado para o contexto atual.
        </div>
      ) : (
        <div className="mt-8 grid gap-4 xl:grid-cols-2">
          {data.alerts.map((alert) => (
            <PreventiveAlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      )}
    </section>
  );
}
