import { useEffect, useMemo, useState } from "react";
import { neighborhoodOptions } from "../../data/neighborhoodOptions";
import type {
  DeviceType,
  PreferenceFormValues,
} from "../../types/userPreference";
import { OnboardingStepIcon } from "./OnboardingStepIcon";
import { OnboardingStepIndicator } from "./OnboardingStepIndicator";
import { OnboardingToggle } from "./OnboardingToggle";

type OnboardingModalProps = {
  isOpen: boolean;
  deviceType: DeviceType;
  initialValues: PreferenceFormValues;
  isSubmitting: boolean;
  errorMessage: string | null;
  onSubmit: (values: PreferenceFormValues) => Promise<void> | void;
  onClose: () => void;
  canClose: boolean;
};

type OnboardingStep = 0 | 1 | 2 | 3;

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function getInitialNeighborhood(
  canClose: boolean,
  initialValues: PreferenceFormValues,
) {
  return canClose ? initialValues.neighborhood : "";
}

export function OnboardingModal({
  isOpen,
  deviceType,
  initialValues,
  isSubmitting,
  errorMessage,
  onSubmit,
  onClose,
  canClose,
}: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(0);
  const [neighborhood, setNeighborhood] = useState("");
  const [allowGeolocation, setAllowGeolocation] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [pushNotificationsEnabled, setPushNotificationsEnabled] =
    useState(false);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] =
    useState(false);
  const [email, setEmail] = useState("");
  const [localErrorMessage, setLocalErrorMessage] = useState<string | null>(
    null,
  );

  const isDesktop = deviceType === "DESKTOP";
  const isSuccessStep = currentStep === 3;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setCurrentStep(0);
    setNeighborhood(getInitialNeighborhood(canClose, initialValues));
    setAllowGeolocation(false);
    setNotificationsEnabled(initialValues.notificationsEnabled);
    setPushNotificationsEnabled(
      isDesktop ? false : initialValues.pushNotificationsEnabled,
    );
    setEmailNotificationsEnabled(initialValues.emailNotificationsEnabled);
    setEmail(initialValues.email);
    setLocalErrorMessage(null);
  }, [isOpen]);

  const displayedErrorMessage = localErrorMessage ?? errorMessage;

  const title = useMemo(() => {
    if (currentStep === 0) {
      return "Bem-vindo ao Alerta Dengue UDI";
    }

    if (currentStep === 1) {
      return "Localização";
    }

    if (currentStep === 2) {
      return "Notificações";
    }

    return "Tudo pronto!";
  }, [currentStep]);

  const description = useMemo(() => {
    if (currentStep === 0) {
      return "Juntos, vamos combater a dengue em Uberlândia! Configure suas preferências para receber alertas personalizados.";
    }

    if (currentStep === 1) {
      return "Selecione seu bairro para receber informações relevantes da sua região.";
    }

    if (currentStep === 2) {
      return "Escolha como deseja receber alertas sobre a dengue na sua região.";
    }

    return "Suas preferências foram configuradas. Você pode alterá-las a qualquer momento nas configurações.";
  }, [currentStep]);

  if (!isOpen) {
    return null;
  }

  function goToPreviousStep() {
    setLocalErrorMessage(null);

    if (currentStep === 3) {
      setCurrentStep(2);
      return;
    }

    if (currentStep > 0) {
      setCurrentStep((currentStep - 1) as OnboardingStep);
    }
  }

  async function goToNextStep() {
    setLocalErrorMessage(null);

    if (currentStep === 0) {
      setCurrentStep(1);
      return;
    }

    if (currentStep === 1) {
      if (!neighborhood) {
        setLocalErrorMessage("Selecione um bairro para continuar.");
        return;
      }

      setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      if (notificationsEnabled && emailNotificationsEnabled && !email.trim()) {
        setLocalErrorMessage(
          "Informe um email para receber notificações por email.",
        );
        return;
      }

      if (
        notificationsEnabled &&
        emailNotificationsEnabled &&
        !isValidEmail(email)
      ) {
        setLocalErrorMessage("Informe um email válido para continuar.");
        return;
      }

      const finalValues: PreferenceFormValues = {
        neighborhood,
        email:
          notificationsEnabled && emailNotificationsEnabled ? email.trim() : "",
        notificationsEnabled,
        emailNotificationsEnabled:
          notificationsEnabled && emailNotificationsEnabled,
        pushNotificationsEnabled:
          !isDesktop && notificationsEnabled && pushNotificationsEnabled,
      };

      await onSubmit(finalValues);

      if (allowGeolocation && "geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          () => {},
          () => {},
        );
      }

      setCurrentStep(3);
      return;
    }

    onClose();
  }

  function handleNotificationsEnabledChange(value: boolean) {
    setNotificationsEnabled(value);

    if (!value) {
      setPushNotificationsEnabled(false);
      setEmailNotificationsEnabled(false);
    }
  }

  function handlePushNotificationsEnabledChange(value: boolean) {
    if (isDesktop || !notificationsEnabled) {
      return;
    }

    setPushNotificationsEnabled(value);
  }

  function handleEmailNotificationsEnabledChange(value: boolean) {
    if (!notificationsEnabled) {
      return;
    }

    setEmailNotificationsEnabled(value);
  }

  return (
    <div className="fixed inset-0 z-3000 flex items-center justify-center overflow-y-auto bg-[#edf7f4] px-3 py-6 sm:px-6 sm:py-10">
      <div className="w-full max-w-157 rounded-[18px] border border-[#d6ddd9] bg-white px-5 py-6 shadow-[0_10px_32px_rgba(15,23,42,0.06)] sm:rounded-[22px] sm:px-8 sm:py-9">
        <OnboardingStepIcon
          variant={
            currentStep === 0
              ? "welcome"
              : currentStep === 1
                ? "location"
                : currentStep === 2
                  ? "notifications"
                  : "success"
          }
        />

        <div className="mt-5 text-center sm:mt-6">
          <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-[#02051f] sm:text-[26px] lg:text-[28px]">
            {title}
          </h2>
          <p className="mx-auto mt-2 max-w-125 text-[14px] leading-6 text-[#6d7390] sm:mt-3 sm:text-[15px] sm:leading-7">
            {description}
          </p>
        </div>

        {currentStep === 1 ? (
          <div className="mx-auto mt-6 max-w-117 sm:mt-8">
            <div>
              <label
                htmlFor="onboarding-neighborhood"
                className="mb-2 block text-[14px] font-semibold text-[#02051f] sm:mb-3 sm:text-[15px]"
              >
                Seu bairro
              </label>

              <div className="relative">
                <select
                  id="onboarding-neighborhood"
                  value={neighborhood}
                  onChange={(event) => setNeighborhood(event.target.value)}
                  className="h-11 w-full appearance-none rounded-lg border border-[#edf0f4] bg-[#f3f5f8] px-3 text-[14px] text-[#6d7390] outline-none transition cursor-pointer focus:border-[#02051f] sm:h-12 sm:rounded-xl sm:px-4 sm:text-[15px]"
                >
                  <option value="">Selecione seu bairro</option>
                  {neighborhoodOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#9aa1b5]">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 7L9 11L13 7"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3 sm:mt-6 sm:gap-4">
              <div>
                <p className="text-[14px] font-semibold text-[#02051f] sm:text-[15px]">
                  Permitir geolocalização
                </p>
              </div>

              <OnboardingToggle
                checked={allowGeolocation}
                onChange={setAllowGeolocation}
              />
            </div>
          </div>
        ) : null}

        {currentStep === 2 ? (
          <div className="mx-auto mt-6 max-w-117 sm:mt-8">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between gap-3 sm:gap-4">
                <p className="text-[14px] font-semibold text-[#02051f] sm:text-[15px]">
                  Ativar notificações
                </p>

                <OnboardingToggle
                  checked={notificationsEnabled}
                  onChange={handleNotificationsEnabledChange}
                />
              </div>

              <div className="flex items-center justify-between gap-3 sm:gap-4">
                <p
                  className={`text-[14px] font-semibold sm:text-[15px] ${
                    notificationsEnabled && !isDesktop
                      ? "text-[#02051f]"
                      : "text-[#9aa1b5]"
                  }`}
                >
                  Notificações push (somente celular)
                </p>

                <OnboardingToggle
                  checked={pushNotificationsEnabled}
                  disabled={!notificationsEnabled || isDesktop}
                  onChange={handlePushNotificationsEnabledChange}
                />
              </div>

              <div className="flex items-center justify-between gap-3 sm:gap-4">
                <p
                  className={`text-[14px] font-semibold sm:text-[15px] ${
                    notificationsEnabled ? "text-[#02051f]" : "text-[#9aa1b5]"
                  }`}
                >
                  Notificações por email
                </p>

                <OnboardingToggle
                  checked={emailNotificationsEnabled}
                  disabled={!notificationsEnabled}
                  onChange={handleEmailNotificationsEnabledChange}
                />
              </div>
            </div>

            {notificationsEnabled && emailNotificationsEnabled ? (
              <div className="mt-5 sm:mt-6">
                <label
                  htmlFor="onboarding-email"
                  className="mb-2 block text-[14px] font-semibold text-[#02051f] sm:mb-3 sm:text-[15px]"
                >
                  Email para receber alertas
                </label>

                <input
                  id="onboarding-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Digite seu email"
                  className="h-11 w-full rounded-lg border border-[#edf0f4] bg-[#f3f5f8] px-3 text-[14px] text-[#02051f] outline-none transition placeholder:text-[#9aa1b5] focus:border-[#02051f] sm:h-12 sm:rounded-xl sm:px-4 sm:text-[15px]"
                />
              </div>
            ) : null}

            {isDesktop ? (
              <p className="mt-4 text-[13px] leading-5 text-[#6d7390] sm:text-[14px] sm:leading-6">
                No desktop, o sistema utiliza somente notificações por email.
              </p>
            ) : null}
          </div>
        ) : null}

        {displayedErrorMessage ? (
          <div className="mx-auto mt-5 max-w-117 rounded-xl border border-[#ffd5d5] bg-[#fff3f3] px-3 py-3 text-sm text-[#c33939] sm:mt-6 sm:rounded-2xl sm:px-4">
            {displayedErrorMessage}
          </div>
        ) : null}

        <div className="mt-6 flex flex-col-reverse items-stretch justify-center gap-2 sm:mt-8 sm:flex-row sm:items-center sm:gap-4">
          {currentStep > 0 ? (
            <button
              type="button"
              onClick={goToPreviousStep}
              disabled={isSubmitting}
              className="inline-flex h-11 min-w-18.5 items-center justify-center rounded-lg border border-[#d6ddd9] bg-white px-4 text-[14px] font-semibold text-[#02051f] transition hover:bg-[#f8fafb] cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 sm:rounded-xl sm:px-5 sm:text-[15px]"
            >
              Voltar
            </button>
          ) : null}

          <button
            type="button"
            onClick={() => void goToNextStep()}
            disabled={isSubmitting}
            className={`inline-flex h-11 min-w-22.5 items-center justify-center rounded-lg px-5 text-[14px] font-semibold text-white transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 sm:rounded-xl sm:px-6 sm:text-[15px] ${
              isSuccessStep
                ? "bg-[#13a36d] hover:bg-[#109561]"
                : "bg-[#02051f] hover:bg-[#0a1030]"
            }`}
          >
            {isSubmitting
              ? "Salvando..."
              : currentStep === 3
                ? "Começar"
                : "Próximo"}
          </button>
        </div>

        <OnboardingStepIndicator currentStep={currentStep} />
      </div>
    </div>
  );
}
