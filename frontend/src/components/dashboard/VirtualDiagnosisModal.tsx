import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo } from "react";
import { useSymptomChecker } from "../../hooks/useSymptomChecker";
import { DashboardModalShell } from "./DashboardModalShell";
import type { SymptomCheckerPayload } from "../../types/symptomChecker";
import { faCircleInfo, faFileLines } from "../../lib/icons";

const symptomOptions: Array<{
  key: keyof SymptomCheckerPayload;
  label: string;
}> = [
  { key: "fever", label: "Febre alta (acima de 38°C)" },
  { key: "headache", label: "Dor de cabeça intensa" },
  { key: "painBehindEyes", label: "Dor atrás dos olhos" },
  { key: "bodyAches", label: "Dores no corpo e articulações" },
  { key: "rash", label: "Manchas vermelhas na pele" },
  { key: "nausea", label: "Náuseas ou vômitos" },
  { key: "fatigue", label: "Cansaço extremo" },
  { key: "dehydrationSigns", label: "Falta de apetite" },
];

function getResultTone(classification: string) {
  if (classification === "WARNING_SIGNS") {
    return "border-[#f0c86b] bg-[#f8f3e8] text-[#a55b14]";
  }

  if (classification === "COMPATIBLE_SYMPTOMS") {
    return "border-[#cde1ff] bg-[#eef5ff] text-[#3156b5]";
  }

  return "border-[#d8e8de] bg-[#effaf5] text-[#0b7e60]";
}

type VirtualDiagnosisModalProps = {
  isOpen: boolean;
  onClose: () => void;
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
    setSymptomValue,
    submit,
    reset,
  } = useSymptomChecker();

  const selectedCount = useMemo(() => {
    return Object.values(payload).filter(Boolean).length;
  }, [payload]);

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
        <p className="text-[15px] text-[#111318] sm:text-[16px] lg:text-[17px]">
          Selecione os sintomas que você está sentindo:
        </p>

        <div className="mt-3 space-y-2 sm:mt-4 sm:space-y-3">
          {symptomOptions.map((item) => (
            <label
              key={item.key}
              className="flex items-center gap-2 text-[14px] text-[#111318] sm:gap-3 sm:text-[15px] lg:text-[16px]"
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
        <div className="mt-4 rounded-xl border border-[#ffd7d7] bg-[#fff2f2] px-3 py-3 text-sm text-[#bf4040] sm:mt-5 sm:rounded-2xl sm:px-4">
          {errorMessage}
        </div>
      ) : null}

      {result ? (
        <section
          className={`mt-4 rounded-[14px] border px-3 py-3 sm:mt-5 sm:rounded-[18px] sm:px-4 sm:py-4 ${getResultTone(result.classification)}`}
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
            Sintomas marcados: {selectedCount}
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
