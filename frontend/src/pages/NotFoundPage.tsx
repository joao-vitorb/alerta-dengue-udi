import { Link } from "react-router";
import { AppShell } from "../components/layout/AppShell";

export function NotFoundPage() {
  return (
    <AppShell>
      <section className="flex min-h-[70vh] items-center justify-center">
        <div className="max-w-xl rounded-4xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">
            Página não encontrada
          </p>

          <h2 className="mt-4 text-3xl font-semibold text-slate-900">
            Não encontramos a rota que você tentou acessar.
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            Volte para o mapa principal para continuar a navegação pelo sistema.
          </p>

          <Link
            to="/"
            className="mt-6 inline-flex rounded-full border border-sky-200 bg-sky-50 px-5 py-3 text-sm font-medium text-sky-700 transition hover:bg-sky-100"
          >
            Voltar para o mapa
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
