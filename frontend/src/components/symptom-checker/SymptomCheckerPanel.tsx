import { HealthUnitCard } from "../health-units/HealthUnitCard";
import { useHealthUnits } from "../../hooks/useHealthUnits";
import { useSymptomChecker } from "../../hooks/useSymptomChecker";
import { SymptomCheckerResultCard } from "./SymptomCheckerResultCard";
import { SymptomChecklistForm } from "./SymptomChecklistForm";
import type { SymptomChecklistItem } from "../../types/symptomChecker";

type SymptomCheckerPanelProps = {
  selectedNeighborhood?: string;
};

const symptomChecklistItems: SymptomChecklistItem[] = [
  {
    key: "fever",
    label: "Febre",
    description: "Sensação de febre ou temperatura corporal elevada.",
    category: "compatible",
  },
  {
    key: "headache",
    label: "Dor de cabeça",
    description: "Dor de cabeça persistente ou desconforto importante.",
    category: "compatible",
  },
  {
    key: "painBehindEyes",
    label: "Dor atrás dos olhos",
    description: "Desconforto ou dor ao redor ou atrás dos olhos.",
    category: "compatible",
  },
  {
    key: "bodyAches",
    label: "Dor no corpo",
    description: "Dores musculares ou sensação de corpo dolorido.",
    category: "compatible",
  },
  {
    key: "jointPain",
    label: "Dor nas articulações",
    description: "Dor ou rigidez em articulações.",
    category: "compatible",
  },
  {
    key: "nausea",
    label: "Náusea",
    description: "Sensação de enjoo ao longo do dia.",
    category: "compatible",
  },
  {
    key: "vomiting",
    label: "Vômito",
    description: "Ocorrência de episódios de vômito.",
    category: "compatible",
  },
  {
    key: "rash",
    label: "Manchas na pele",
    description: "Aparecimento de manchas ou alterações na pele.",
    category: "compatible",
  },
  {
    key: "fatigue",
    label: "Cansaço",
    description: "Sensação de fraqueza ou fadiga fora do normal.",
    category: "compatible",
  },
  {
    key: "abdominalPain",
    label: "Dor abdominal",
    description: "Dor abdominal importante ou persistente.",
    category: "warning",
  },
  {
    key: "persistentVomiting",
    label: "Vômito persistente",
    description: "Vômitos repetidos ou que não melhoram.",
    category: "warning",
  },
  {
    key: "bleedingSigns",
    label: "Sinais de sangramento",
    description: "Sangramento nasal, gengival ou outros sinais semelhantes.",
    category: "warning",
  },
  {
    key: "drowsiness",
    label: "Sonolência ou prostração",
    description: "Muito sono, fraqueza intensa ou dificuldade para reagir.",
    category: "warning",
  },
  {
    key: "dehydrationSigns",
    label: "Sinais de desidratação",
    description: "Boca seca, tontura, fraqueza ou pouca urina.",
    category: "warning",
  },
];

export function SymptomCheckerPanel({
  selectedNeighborhood,
}: SymptomCheckerPanelProps) {
  const {
    payload,
    result,
    isSubmitting,
    errorMessage,
    selectedSymptomsCount,
    setSymptomValue,
    submit,
    reset,
  } = useSymptomChecker();

  const { recommendedUnits } = useHealthUnits(selectedNeighborhood);

  const recommendedCareUnits = result
    ? recommendedUnits.filter((unit) =>
        result.recommendedCareLevel === "URGENT_CARE"
          ? unit.careLevel === "URGENT_CARE"
          : unit.careLevel === "PRIMARY_CARE",
      )
    : [];

  return (
    <section className="space-y-6">
      <SymptomChecklistForm
        payload={payload}
        items={symptomChecklistItems}
        selectedSymptomsCount={selectedSymptomsCount}
        isSubmitting={isSubmitting}
        onChange={setSymptomValue}
        onSubmit={submit}
        onReset={reset}
      />

      {errorMessage ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 px-4 py-5 text-sm text-rose-700">
          {errorMessage}
        </div>
      ) : null}

      {result ? (
        <>
          <SymptomCheckerResultCard result={result} />

          <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">
                  Próximo passo sugerido
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-900">
                  Unidades adequadas para o contexto atual
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                  A recomendação abaixo usa o tipo de atendimento sugerido pelo
                  resultado educativo e o bairro selecionado no sistema.
                </p>
              </div>
            </div>

            {recommendedCareUnits.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-600">
                Nenhuma unidade correspondente foi encontrada no contexto atual.
              </div>
            ) : (
              <div className="mt-6 grid gap-4 xl:grid-cols-2">
                {recommendedCareUnits.map((unit) => (
                  <HealthUnitCard key={unit.id} unit={unit} highlight />
                ))}
              </div>
            )}
          </section>
        </>
      ) : null}
    </section>
  );
}
