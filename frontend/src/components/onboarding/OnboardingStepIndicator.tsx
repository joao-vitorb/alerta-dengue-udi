type OnboardingStepIndicatorProps = {
  currentStep: number;
  totalSteps?: number;
};

export function OnboardingStepIndicator({
  currentStep,
  totalSteps = 4,
}: OnboardingStepIndicatorProps) {
  return (
    <div className="mt-6 flex items-center justify-center gap-1.5 sm:mt-8 sm:gap-2">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isActive = index === currentStep;

        return (
          <span
            key={index}
            className={`block h-1.5 rounded-full transition-all duration-200 sm:h-2 ${
              isActive
                ? "w-8 bg-[#13a36d] sm:w-12"
                : "w-7 bg-[#d9dde3] sm:w-10"
            }`}
          />
        );
      })}
    </div>
  );
}
