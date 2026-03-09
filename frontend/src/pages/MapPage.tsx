import { AppShell } from "../components/layout/AppShell";
import { MapCanvas } from "../components/map/MapCanvas";
import { InfoCard } from "../components/ui/InfoCard";

const checklistItems = [
  "Checklist de prevenção 1",
  "Checklist de prevenção 2",
  "Checklist de prevenção 3",
];

export function MapPage() {
  return (
    <AppShell>
      <section className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <aside className="space-y-6">
          <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">
              Plataforma de prevenção
            </p>

            <h2 className="mt-4 text-xl font-semibold leading-tight text-slate-900">
              Acompanhe alertas preventivos, sintomas compatíveis e unidades de
              saúde em um só lugar.
            </h2>
          </section>

          <InfoCard
            eyebrow="Clima"
            value="Hoje"
            title="Alertas preventivos automáticos"
            description="Exibição do clima atual na cidade"
          />

          <InfoCard
            eyebrow="Saúde"
            title="Assistente virtual de sintomas"
            description="Assistente virtual para orientar sobre sintomas e quando procurar avaliação médica"
          />

          <InfoCard
            eyebrow="Atendimento"
            title="Unidades de saúde próximas"
            description="Exibição de unidades de saúde próximas baseadas na localização do usuário"
          />

          <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">
              Rotina preventiva
            </p>

            <ul className="mt-4 space-y-3">
              {checklistItems.map((item) => (
                <li
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </aside>

        <div>
          <MapCanvas />
        </div>
      </section>
    </AppShell>
  );
}
