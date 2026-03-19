import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBug, faSliders } from "../../lib/icons";

type DashboardHeaderProps = {
  onOpenPreferences: () => void;
};

export function DashboardHeader({ onOpenPreferences }: DashboardHeaderProps) {
  return (
    <header className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0b9f6a] text-[26px] text-white">
          <FontAwesomeIcon icon={faBug} />
        </div>

        <div>
          <h1 className="text-[28px] font-semibold leading-none tracking-[-0.02em] text-[#0b7e60]">
            Alerta Dengue UDI
          </h1>
          <p className="mt-1 text-[15px] text-[#2e9d7c]">
            Monitoramento em tempo real - Uberlândia, MG
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onOpenPreferences}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d7dbd7] bg-white text-[18px] text-[#02051f] transition cursor-pointer hover:bg-[#f5f7f8]"
      >
        <FontAwesomeIcon icon={faSliders} />
      </button>
    </header>
  );
}
