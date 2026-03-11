import { HealthUnitCard } from "./HealthUnitCard";
import { useHealthUnits } from "../../hooks/useHealthUnits";
import type { HealthCareLevel, HealthUnitType } from "../../types/healthUnit";

type HealthUnitsPanelProps = {
  selectedNeighborhood?: string;
};

const unitTypeOptions: Array<"ALL" | HealthUnitType> = [
  "ALL",
  "UAI",
  "UBS",
  "UBSF",
];

const careLevelOptions: Array<"ALL" | HealthCareLevel> = [
  "ALL",
  "PRIMARY_CARE",
  "URGENT_CARE",
];

function getUnitTypeLabel(value: "ALL" | HealthUnitType) {
  switch (value) {
    case "ALL":
      return "Todos os tipos";
    case "UAI":
      return "UAI";
    case "UBS":
      return "UBS";
    case "UBSF":
      return "UBSF";
    default:
      return value;
  }
}

function getCareLevelLabel(value: "ALL" | HealthCareLevel) {
  switch (value) {
    case "ALL":
      return "Todos os níveis";
    case "PRIMARY_CARE":
      return "Atenção primária";
    case "URGENT_CARE":
      return "Urgência";
    default:
      return value;
  }
}

export function HealthUnitsPanel({
  selectedNeighborhood,
}: HealthUnitsPanelProps) {
  const {
    filteredItems,
    recommendedUnits,
    isLoading,
    errorMessage,
    filters,
    setSearch,
    setUnitType,
    setCareLevel,
    setOnlySelectedNeighborhood,
  } = useHealthUnits(selectedNeighborhood);

  return (
    <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">
            Unidades de saúde
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900">
            Atendimento oficial organizado pelo sistema
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Nesta etapa, o sistema já consome as unidades oficiais cadastradas
            no banco e recomenda opções a partir do bairro escolhido no
            onboarding.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <label
            htmlFor="health-unit-search"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Buscar unidade
          </label>

          <input
            id="health-unit-search"
            type="text"
            value={filters.search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Nome, endereço, bairro ou telefone"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
          />
        </div>

        <div>
          <label
            htmlFor="health-unit-type"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Tipo
          </label>

          <select
            id="health-unit-type"
            value={filters.unitType}
            onChange={(event) =>
              setUnitType(event.target.value as "ALL" | HealthUnitType)
            }
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
          >
            {unitTypeOptions.map((option) => (
              <option key={option} value={option}>
                {getUnitTypeLabel(option)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="health-unit-care-level"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Atendimento
          </label>

          <select
            id="health-unit-care-level"
            value={filters.careLevel}
            onChange={(event) =>
              setCareLevel(event.target.value as "ALL" | HealthCareLevel)
            }
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
          >
            {careLevelOptions.map((option) => (
              <option key={option} value={option}>
                {getCareLevelLabel(option)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <label className="mt-4 flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
        <input
          type="checkbox"
          checked={filters.onlySelectedNeighborhood}
          onChange={(event) =>
            setOnlySelectedNeighborhood(event.target.checked)
          }
          className="mt-1 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
        />

        <span>
          <span className="block text-sm font-medium text-slate-800">
            Mostrar somente unidades do meu bairro
          </span>
        </span>
      </label>

      <div className="mt-8">
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">
            Recomendações iniciais
          </p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">
            Unidades em destaque para o contexto atual
          </h3>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-600">
            Carregando unidades de saúde...
          </div>
        ) : errorMessage ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-5 text-sm text-rose-700">
            {errorMessage}
          </div>
        ) : recommendedUnits.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-600">
            Nenhuma unidade recomendada foi encontrada para o contexto atual.
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-3">
            {recommendedUnits.map((unit) => (
              <HealthUnitCard key={unit.id} unit={unit} highlight />
            ))}
          </div>
        )}
      </div>

      <div className="mt-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">
              Base consultável
            </p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">
              Unidades disponíveis
            </h3>
          </div>

          <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
            {filteredItems.length} unidade(s)
          </span>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-600">
            Carregando unidades de saúde...
          </div>
        ) : errorMessage ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-5 text-sm text-rose-700">
            {errorMessage}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-600">
            Nenhuma unidade encontrada com os filtros atuais.
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {filteredItems.map((unit) => (
              <HealthUnitCard key={unit.id} unit={unit} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
