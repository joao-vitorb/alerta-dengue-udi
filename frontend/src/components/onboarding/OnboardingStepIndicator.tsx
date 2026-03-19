type OnboardingStepIndicatorProps = {
  currentStep: number;
  totalSteps?: number;
};

export function OnboardingStepIndicator({
  currentStep,
  totalSteps = 4,
}: OnboardingStepIndicatorProps) {
  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isActive = index === currentStep;

        return (
          <span
            key={index}
            className={`block h-2 rounded-full transition-all duration-200 ${
              isActive ? "w-12 bg-[#13a36d]" : "w-10 bg-[#d9dde3]"
            }`}
          />
        );
      })}
    </div>
  );
}
