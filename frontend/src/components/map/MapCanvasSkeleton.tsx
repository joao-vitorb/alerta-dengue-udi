import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapLocationDot } from "../../lib/icons";

export function MapCanvasSkeleton() {
  return (
    <section className="rounded-[14px] border border-border-soft bg-white p-3 sm:rounded-[18px] sm:p-4">
      <div className="flex items-center gap-2">
        <span className="text-brand-green-soft">
          <FontAwesomeIcon icon={faMapLocationDot} />
        </span>

        <h2 className="text-[16px] font-semibold text-text-primary sm:text-[17px] lg:text-[18px]">
          Mapa de Uberlândia
        </h2>
      </div>

      <div
        aria-hidden="true"
        className="mt-3 h-[320px] animate-pulse overflow-hidden rounded-[12px] bg-surface-muted sm:mt-4 sm:h-[400px] sm:rounded-[14px] lg:mt-5 lg:h-100.5"
      />
    </section>
  );
}
