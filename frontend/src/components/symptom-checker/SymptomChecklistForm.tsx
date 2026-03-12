import type {
  SymptomCheckerPayload,
  SymptomChecklistItem,
} from "../../types/symptomChecker";

type SymptomChecklistFormProps = {
  payload: SymptomCheckerPayload;
  items: SymptomChecklistItem[];
  selectedSymptomsCount: number;
  isSubmitting: boolean;
  onChange: (key: keyof SymptomCheckerPayload, value: boolean) => void;
  onSubmit: () => Promise<void> | void;
  onReset: () => void;
};

export function SymptomChecklistForm({
  payload,
  items,
  selectedSymptomsCount,
  isSubmitting,
  onChange,
  onSubmit,
  onReset,
}: SymptomChecklistFormProps) {
  return (
    <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">
            Checador educativo
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900">
            Informe os sintomas observados
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Este formulário é apenas educativo. Ele não substitui atendimento
            médico, diagnóstico ou avaliação presencial.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <p>
            <span className="font-medium text-slate-800">
              Sintomas marcados:
            </span>{" "}
            {selectedSymptomsCount}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        {items.map((item) => {
          const isWarning = item.category === "warning";

          return (
            <label
              key={item.key}
              className={`flex items-start gap-3 rounded-3xl border px-4 py-4 ${
                isWarning
                  ? "border-amber-200 bg-amber-50"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <input
                type="checkbox"
                checked={payload[item.key]}
                onChange={(event) => onChange(item.key, event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              />

              <span>
                <span className="block text-sm font-medium text-slate-900">
                  {item.label}
                </span>
                <span className="mt-1 block text-sm leading-6 text-slate-600">
                  {item.description}
                </span>
              </span>
            </label>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void onSubmit()}
          disabled={isSubmitting}
          className="inline-flex rounded-full bg-sky-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Analisando..." : "Analisar sintomas"}
        </button>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Limpar seleção
        </button>
      </div>
    </section>
  );
}
