import type { ReactNode } from "react";

type DashboardToolButtonProps = {
  title: string;
  description: string;
  icon: ReactNode;
  onClick: () => void;
};

export function DashboardToolButton({
  title,
  description,
  icon,
  onClick,
}: DashboardToolButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-xl bg-[linear-gradient(90deg,#08c97a_0%,#10c0b0_100%)] px-3 py-3 text-left text-white transition cursor-pointer hover:scale-[1.01] sm:gap-3 sm:rounded-2xl sm:px-4 sm:py-4"
    >
      <span className="shrink-0">{icon}</span>

      <div>
        <p className="text-[15px] font-semibold leading-none sm:text-[16px] lg:text-[18px]">
          {title}
        </p>
        <p className="mt-1 text-[12px] text-white/90 sm:text-[13px]">
          {description}
        </p>
      </div>
    </button>
  );
}
