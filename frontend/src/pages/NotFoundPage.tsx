import { Link } from "react-router";
import mainLogo from "/assets/logo/main-logo.png";

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col bg-page-bg px-3 py-6 sm:px-5 sm:py-8 lg:px-8 lg:py-10">
      <header className="flex justify-center">
        <img
          src={mainLogo}
          alt="Alerta Dengue UDI"
          className="h-24 w-auto sm:h-28 md:h-32 lg:h-36"
        />
      </header>

      <div className="flex flex-1 items-center justify-center">
        <section className="w-full max-w-md rounded-[14px] border border-border-soft bg-white p-4 sm:rounded-[18px] sm:p-5 lg:p-6">
          <h2 className="text-[16px] font-semibold text-text-heading sm:text-[17px] lg:text-[18px]">
            Página Não Encontrada
          </h2>

          <p className="mt-2 text-[13px] leading-5 text-text-secondary sm:text-[14px] sm:leading-6 lg:text-[15px]">
            Desculpe, a página que você está procurando não foi encontrada. Verifique o endereço ou volte para a página inicial.
          </p>

          <Link
            to="/"
            className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-green text-[14px] font-semibold transition sm:mt-5 sm:h-12 sm:text-[15px] lg:text-[16px]"
          >
            <span className="text-white">Voltar</span>
          </Link>
        </section>
      </div>
    </main>
  );
}
