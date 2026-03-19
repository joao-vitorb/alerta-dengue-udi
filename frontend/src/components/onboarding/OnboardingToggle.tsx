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
      className={`relative inline-flex h-7 w-13 items-center cursor-pointer rounded-full transition ${
        disabled
          ? "cursor-not-allowed bg-[#d9dde3]"
          : checked
            ? "bg-[#02051f]"
            : "bg-[#cfd3d9]"
      }`}
    >
      <span
        className={`h-5 w-5 rounded-full bg-white shadow-sm transition ${
          checked ? "translate-x-7" : "translate-x-1"
        }`}
      />
    </button>
  );
}
