import type { SymptomCheckerResponse } from "../../types/symptomChecker";

type SymptomCheckerResultCardProps = {
  result: SymptomCheckerResponse;
};

function getResultClasses(
  classification: SymptomCheckerResponse["classification"],
) {
  switch (classification) {
    case "WARNING_SIGNS":
      return {
        container: "border-amber-200 bg-amber-50",
        badge: "border-amber-200 bg-white text-amber-700",
      };
    case "COMPATIBLE_SYMPTOMS":
      return {
        container: "border-sky-200 bg-sky-50",
        badge: "border-sky-200 bg-white text-sky-700",
      };
    case "FEW_COMPATIBLE_SIGNS":
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

function getCareLevelLabel(
  careLevel: SymptomCheckerResponse["recommendedCareLevel"],
) {
  switch (careLevel) {
    case "URGENT_CARE":
      return "Urgência";
    case "PRIMARY_CARE":
      return "Atenção primária";
    default:
      return careLevel;
  }
}

export function SymptomCheckerResultCard({
  result,
}: SymptomCheckerResultCardProps) {
  const classes = getResultClasses(result.classification);

  return (
    <section className={`rounded-4xl border p-6 ${classes.container}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">
            Resultado educativo
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900">
            {result.headline}
          </h2>
        </div>

        <span
          className={`rounded-full border px-4 py-2 text-sm font-medium ${classes.badge}`}
        >
          {getCareLevelLabel(result.recommendedCareLevel)}
        </span>
      </div>

      <p className="mt-4 text-sm leading-7 text-slate-700">{result.message}</p>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
            Compatíveis
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {result.compatibleSymptomsCount}
          </p>
        </div>

        <div className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
            Sinais de alerta
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {result.warningSignsCount}
          </p>
        </div>

        <div className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
            Atendimento sugerido
          </p>
          <p className="mt-2 text-base font-semibold text-slate-900">
            {getCareLevelLabel(result.recommendedCareLevel)}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-3xl border border-white/70 bg-white/80 p-4">
        <p className="text-sm font-medium text-slate-900">Recomendação</p>
        <p className="mt-2 text-sm leading-7 text-slate-700">
          {result.recommendation}
        </p>
      </div>

      <div className="mt-5">
        <p className="text-sm font-medium text-slate-900">
          Sintomas informados
        </p>

        {result.detectedSymptoms.length === 0 ? (
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Nenhum sintoma foi selecionado.
          </p>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {result.detectedSymptoms.map((symptom) => (
              <span
                key={symptom}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700"
              >
                {symptom}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-600">
        {result.disclaimer}
      </div>
    </section>
  );
}
