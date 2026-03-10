type MapCanvasProps = {
  selectedNeighborhood?: string;
};

const neighborhoods = [
  { name: "Tibery", position: "left-[14%] top-[18%]" },
  { name: "Santa Mônica", position: "left-[36%] top-[26%]" },
  { name: "Centro", position: "left-[46%] top-[46%]" },
  { name: "Patrimônio", position: "left-[30%] top-[58%]" },
  { name: "Luizote", position: "left-[62%] top-[34%]" },
  { name: "Morumbi", position: "left-[70%] top-[62%]" },
];

const healthUnits = [
  { name: "UAI Tibery", position: "left-[18%] top-[36%]" },
  { name: "UBSF Santa Mônica", position: "left-[42%] top-[34%]" },
  { name: "UAI Martins", position: "left-[60%] top-[48%]" },
];

export function MapCanvas({ selectedNeighborhood }: MapCanvasProps) {
  return (
    <section className="overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">
            Visão principal
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            Mapa focado em Uberlândia
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Pré exibição do mapa
          </p>
        </div>

        <div className="grid gap-2 text-sm text-slate-700">
          <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3">
            Bairro atual: {selectedNeighborhood || "Não definido"}
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            Clima e prevenção
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            Unidades próximas
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="relative h-140 overflow-hidden rounded-[28px] border border-slate-200 bg-[#f9fbfe]">
          <div className="absolute inset-0 opacity-60 bg-[radial-gradient(rgba(148,163,184,0.28)_1px,transparent_1px)] bg-size-[22px_22px]" />

          <div className="absolute left-6 top-6 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
              Município monitorado
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              Uberlândia - MG
            </p>
          </div>

          {neighborhoods.map((neighborhood) => {
            const isSelected = neighborhood.name === selectedNeighborhood;

            return (
              <div
                key={neighborhood.name}
                className={`absolute ${neighborhood.position} rounded-full px-4 py-2 text-sm font-medium ${
                  isSelected
                    ? "border border-sky-500 bg-sky-600 text-white shadow-sm"
                    : "border border-sky-200 bg-sky-100 text-sky-700"
                }`}
              >
                {neighborhood.name}
              </div>
            );
          })}

          {healthUnits.map((unit) => (
            <div
              key={unit.name}
              className={`absolute ${unit.position} rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700`}
            >
              {unit.name}
            </div>
          ))}

          <div className="absolute bottom-6 left-6 right-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
                Alerta preventivo
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Chuva e calor exigem vistoria rápida em vasos, ralos, calhas e
                recipientes
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
                Sintomas
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                O assistente virtual vai orientar quando procurar avaliação
                presencial
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
                Atendimento
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Recomendação de unidades de saúde próximas à localização do
                usuário
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
