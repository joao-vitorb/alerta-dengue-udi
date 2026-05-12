type OnboardingToggleProps = {
  checked: boolean;
  disabled?: boolean;
  onChange: (value: boolean) => void;
};

export function OnboardingToggle({
  checked,
  disabled = false,
  onChange,
}: OnboardingToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center cursor-pointer rounded-full px-1 transition ${
        disabled
          ? "cursor-not-allowed bg-disabled-bg"
          : checked
            ? "bg-brand-dark"
            : "bg-[#cfd3d9]"
      }`}
    >
      <span
        className={`h-5 w-5 rounded-full bg-white shadow-sm transition ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}
