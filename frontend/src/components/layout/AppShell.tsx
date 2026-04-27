import type { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#f8fbff]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-4 py-4 sm:flex-row sm:items-center sm:gap-4 sm:px-6 sm:py-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-sky-600 sm:text-xs">
              Alerta Dengue UDI
            </p>
            <h1 className="mt-1 text-base font-semibold text-slate-900 sm:mt-2 sm:text-lg">
              Prevenção orientada por clima em Uberlândia - MG
            </h1>
          </div>

          <div className="flex flex-wrap items-center justify-start gap-2 sm:justify-end">
            <span className="rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-[11px] font-medium text-sky-700 sm:px-3 sm:text-xs">
              Desenvolvido por João Borges
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
