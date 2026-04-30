import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faCloud, faFileLines, faLocationDot } from "../../lib/icons";
import { DashboardToolButton } from "./DashboardToolButton";

type DashboardToolsPanelProps = {
  onOpenClimate: () => void;
  onOpenNearbyUnits: () => void;
  onOpenDiagnosis: () => void;
};

type Tool = {
  title: string;
  description: string;
  icon: IconDefinition;
  onClickKey: keyof DashboardToolsPanelProps;
};

const TOOLS: Tool[] = [
  {
    title: "Clima",
    description: "Condições atuais",
    icon: faCloud,
    onClickKey: "onOpenClimate",
  },
  {
    title: "Postos Próximos",
    description: "Unidades de saúde",
    icon: faLocationDot,
    onClickKey: "onOpenNearbyUnits",
  },
  {
    title: "Diagnóstico Virtual",
    description: "Avalie seus sintomas",
    icon: faFileLines,
    onClickKey: "onOpenDiagnosis",
  },
];

export function DashboardToolsPanel(props: DashboardToolsPanelProps) {
  return (
    <section className="rounded-[14px] border border-border-soft bg-white p-3 sm:rounded-[18px] sm:p-4">
      <h2 className="text-[16px] font-semibold text-text-heading sm:text-[17px] lg:text-[18px]">
        Ferramentas
      </h2>

      <div className="mt-3 space-y-2 sm:mt-4 sm:space-y-3">
        {TOOLS.map((tool) => (
          <DashboardToolButton
            key={tool.title}
            title={tool.title}
            description={tool.description}
            onClick={props[tool.onClickKey]}
            icon={<FontAwesomeIcon icon={tool.icon} className="text-[18px]" />}
          />
        ))}
      </div>
    </section>
  );
}
