import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DashboardToolButton } from "./DashboardToolButton";
import { faCloud, faFileLines, faLocationDot } from "../../lib/icons";

type DashboardToolsPanelProps = {
  onOpenClimate: () => void;
  onOpenNearbyUnits: () => void;
  onOpenDiagnosis: () => void;
};

export function DashboardToolsPanel({
  onOpenClimate,
  onOpenNearbyUnits,
  onOpenDiagnosis,
}: DashboardToolsPanelProps) {
  return (
    <section className="rounded-[18px] border border-[#d8dcd8] bg-white p-4">
      <h2 className="text-[18px] font-semibold text-[#1a1c21]">Ferramentas</h2>

      <div className="mt-4 space-y-3">
        <DashboardToolButton
          title="Clima"
          description="Condições atuais"
          gradientClassName="bg-[linear-gradient(90deg,#08c97a_0%,#10c0b0_100%)]"
          onClick={onOpenClimate}
          icon={<FontAwesomeIcon icon={faCloud} className="text-[18px]" />}
        />

        <DashboardToolButton
          title="Postos Próximos"
          description="Unidades de saúde"
          gradientClassName="bg-[linear-gradient(90deg,#08c97a_0%,#10c0b0_100%)]"
          onClick={onOpenNearbyUnits}
          icon={
            <FontAwesomeIcon icon={faLocationDot} className="text-[18px]" />
          }
        />

        <DashboardToolButton
          title="Diagnóstico Virtual"
          description="Avalie seus sintomas"
          gradientClassName="bg-[linear-gradient(90deg,#08c97a_0%,#10c0b0_100%)]"
          onClick={onOpenDiagnosis}
          icon={<FontAwesomeIcon icon={faFileLines} className="text-[18px]" />}
        />
      </div>
    </section>
  );
}
