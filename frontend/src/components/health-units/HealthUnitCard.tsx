import type { HealthUnit } from "../../types/healthUnit";

type HealthUnitCardProps = {
  unit: HealthUnit;
  highlight?: boolean;
};

function getCareLevelLabel(careLevel: HealthUnit["careLevel"]) {
  switch (careLevel) {
    case "PRIMARY_CARE":
      return "Atenção primária";
    case "URGENT_CARE":
      return "Urgência";
    case "SPECIALTY_CARE":
      return "Especializado";
    case "SUPPORT_SERVICE":
      return "Apoio";
    default:
      return careLevel;
  }
}

function getUnitTypeLabel(unitType: HealthUnit["unitType"]) {
  switch (unitType) {
    case "UAI":
      return "UAI";
    case "UBS":
      return "UBS";
    case "UBSF":
      return "UBSF";
    default:
      return unitType;
  }
}

export function HealthUnitCard({
  unit,
  highlight = false,
}: HealthUnitCardProps) {
  return (
    <article
      className={`rounded-[28px] border p-5 ${
        highlight ? "border-sky-200 bg-sky-50" : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
            {getUnitTypeLabel(unit.unitType)}
          </p>
          <h3 className="mt-2 text-lg font-semibold leading-7 text-slate-900">
            {unit.name}
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
            {getCareLevelLabel(unit.careLevel)}
          </span>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
            {unit.sector}
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-2 text-sm leading-6 text-slate-600">
        <p>
          <span className="font-medium text-slate-800">Bairro:</span>{" "}
          {unit.neighborhood ?? "Não informado"}
        </p>
        <p>
          <span className="font-medium text-slate-800">Endereço:</span>{" "}
          {unit.address}
        </p>
        <p>
          <span className="font-medium text-slate-800">Telefone:</span>{" "}
          {unit.phone ?? "Não informado"}
        </p>
        <p>
          <span className="font-medium text-slate-800">Horário:</span>{" "}
          {unit.openingHours ?? "Não informado"}
        </p>
      </div>

      <a
        href={unit.officialSourceUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-5 inline-flex rounded-full border border-sky-200 bg-white px-4 py-2 text-sm font-medium text-sky-700 transition hover:bg-sky-100"
      >
        Abrir fonte oficial
      </a>
    </article>
  );
}
