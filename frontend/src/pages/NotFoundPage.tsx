import { Link } from "react-router";
import { AppShell } from "../components/layout/AppShell";

export function NotFoundPage() {
  return (
    <AppShell>
      <section className="flex min-h-[60vh] items-center justify-center sm:min-h-[70vh]">
        <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm sm:rounded-3xl sm:p-6 lg:rounded-4xl lg:p-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-sky-600 sm:text-xs">
            Página não encontrada
          </p>

          <h2 className="mt-3 text-xl font-semibold text-slate-900 sm:mt-4 sm:text-2xl lg:text-3xl">
            Não encontramos a rota que você tentou acessar.
          </h2>

          <p className="mt-3 text-[13px] leading-6 text-slate-600 sm:mt-4 sm:text-sm sm:leading-7">
            Volte para o mapa principal para continuar a navegação pelo sistema.
          </p>

          <Link
            to="/"
            className="mt-5 inline-flex rounded-full border border-sky-200 bg-sky-50 px-4 py-2.5 text-[13px] font-medium text-sky-700 transition hover:bg-sky-100 sm:mt-6 sm:px-5 sm:py-3 sm:text-sm"
          >
            Voltar para o mapa
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
