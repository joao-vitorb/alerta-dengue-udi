import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSliders } from "../../lib/icons";
import mainLogo from "/assets/logo/main-logo.png";

type DashboardHeaderProps = {
  onOpenPreferences: () => void;
};

export function DashboardHeader({ onOpenPreferences }: DashboardHeaderProps) {
  return (
    <header className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3">
          <img src={mainLogo} alt="Alerta Dengue UDI" className="h-18 w-auto" />
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
