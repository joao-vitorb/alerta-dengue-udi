import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSliders } from "../../lib/icons";
import mainLogo from "/assets/logo/main-logo.png";

type DashboardHeaderProps = {
  onOpenPreferences: () => void;
};

export function DashboardHeader({ onOpenPreferences }: DashboardHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-3 sm:gap-4">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <img
            src={mainLogo}
            alt="Alerta Dengue UDI"
            className="h-12 w-auto sm:h-14 md:h-16 lg:h-18"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onOpenPreferences}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border-soft bg-white text-[16px] text-brand-dark transition cursor-pointer hover:bg-surface-muted sm:h-11 sm:w-11 sm:text-[17px] lg:h-12 lg:w-12 lg:text-[18px]"
      >
        <FontAwesomeIcon icon={faSliders} />
      </button>
    </header>
  );
}
