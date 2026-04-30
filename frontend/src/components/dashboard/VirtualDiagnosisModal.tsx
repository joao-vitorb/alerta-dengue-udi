import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSymptomChecker } from "../../hooks/useSymptomChecker";
import { faCircleInfo, faFileLines } from "../../lib/icons";
import type {
  SymptomCheckerClassification,
  SymptomCheckerPayload,
} from "../../types/symptomChecker";
import { DashboardModalShell } from "./DashboardModalShell";

type VirtualDiagnosisModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type SymptomOption = {
  key: keyof SymptomCheckerPayload;
  label: string;
};

const SYMPTOM_OPTIONS: SymptomOption[] = [
  { key: "fever", label: "Febre alta (acima de 38°C)" },
  { key: "headache", label: "Dor de cabeça intensa" },
  { key: "painBehindEyes", label: "Dor atrás dos olhos" },
  { key: "bodyAches", label: "Dores no corpo e articulações" },
  { key: "rash", label: "Manchas vermelhas na pele" },
  { key: "nausea", label: "Náuseas ou vômitos" },
  { key: "fatigue", label: "Cansaço extremo" },
  { key: "dehydrationSigns", label: "Falta de apetite" },
];

const RESULT_TONE_BY_CLASSIFICATION: Record<
  SymptomCheckerClassification,
  string
> = {
  WARNING_SIGNS: "border-warning-border bg-warning-bg text-warning-title",
  COMPATIBLE_SYMPTOMS: "border-[#cde1ff] bg-[#eef5ff] text-[#3156b5]",
  FEW_COMPATIBLE_SIGNS: "border-[#d8e8de] bg-[#effaf5] text-[#0b7e60]",
};

export function VirtualDiagnosisModal({
  isOpen,
  onClose,
}: VirtualDiagnosisModalProps) {
  const {
    payload,
    result,
    isSubmitting,
    errorMessage,
    selectedSymptomsCount,
    setSymptomValue,
    submit,
    reset,
  } = useSymptomChecker();

  function handleClose() {
    reset();
    onClose();
  }

  return (
    <DashboardModalShell
      isOpen={isOpen}
      onClose={handleClose}
      title="Diagnóstico Virtual"
      icon={<FontAwesomeIcon icon={faFileLines} className="text-[18px]" />}
    >
      <section className="rounded-[14px] border border-[#b9d5ff] bg-[#eef5ff] px-3 py-3 sm:rounded-[18px] sm:px-4 sm:py-4">
        <div className="flex items-start gap-2 sm:gap-3">
          <span className="mt-0.5 text-[16px] text-[#2868ff] sm:text-[18px]">
            <FontAwesomeIcon icon={faCircleInfo} />
          </span>

          <div>
            <p className="text-[15px] font-semibold text-[#204bb5] sm:text-[16px] lg:text-[18px]">
              Importante
            </p>
            <p className="mt-1 text-[13px] leading-5 text-[#3156b5] sm:text-[14px] sm:leading-6">
              Este é apenas um diagnóstico preliminar. Sempre consulte um médico
              para um diagnóstico preciso.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-4 sm:mt-5">
        <p className="text-[15px] text-text-primary sm:text-[16px] lg:text-[17px]">
          Selecione os sintomas que você está sentindo:
        </p>

        <div className="mt-3 space-y-2 sm:mt-4 sm:space-y-3">
          {SYMPTOM_OPTIONS.map((item) => (
            <label
              key={item.key}
              className="flex items-center gap-2 text-[14px] text-text-primary sm:gap-3 sm:text-[15px] lg:text-[16px]"
            >
              <input
                type="checkbox"
                checked={payload[item.key]}
                onChange={(event) =>
                  setSymptomValue(item.key, event.target.checked)
                }
                className="h-4 w-4 rounded border border-[#d3d8de] accent-[#12b58a] sm:h-5 sm:w-5"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {errorMessage ? (
        <div className="mt-4 rounded-xl border border-error-border bg-error-bg px-3 py-3 text-sm text-error-text sm:mt-5 sm:rounded-2xl sm:px-4">
          {errorMessage}
        </div>
      ) : null}

      {result ? (
        <section
          className={`mt-4 rounded-[14px] border px-3 py-3 sm:mt-5 sm:rounded-[18px] sm:px-4 sm:py-4 ${RESULT_TONE_BY_CLASSIFICATION[result.classification]}`}
        >
          <p className="text-[15px] font-semibold sm:text-[16px] lg:text-[18px]">
            {result.headline}
          </p>
          <p className="mt-2 text-[13px] leading-5 sm:text-[14px] sm:leading-6">
            {result.message}
          </p>
          <p className="mt-3 text-[13px] leading-5 sm:text-[14px] sm:leading-6">
            {result.recommendation}
          </p>
          <p className="mt-3 text-[13px] sm:text-[14px]">
            Sintomas marcados: {selectedSymptomsCount}
          </p>
        </section>
      ) : null}

      <button
        type="button"
        onClick={() => void submit()}
        disabled={isSubmitting}
        className="mt-5 flex h-11 w-full items-center justify-center rounded-xl bg-[#88ccb8] text-[15px] font-semibold text-white transition hover:bg-[#76c3ad] disabled:cursor-not-allowed disabled:opacity-70 sm:mt-6 sm:h-12 sm:text-[16px] lg:text-[18px]"
      >
        {isSubmitting ? "Analisando..." : "Analisar sintomas"}
      </button>
    </DashboardModalShell>
  );
}
