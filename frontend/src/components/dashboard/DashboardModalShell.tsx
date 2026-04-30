import type { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "../../lib/icons";

type DashboardModalShellProps = {
  title: string;
  icon: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function DashboardModalShell({
  title,
  icon,
  isOpen,
  onClose,
  children,
}: DashboardModalShellProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-3500 flex items-start justify-center overflow-y-auto bg-black/20 px-3 py-4 sm:px-4 sm:py-6">
      <div className="w-full max-w-135 rounded-[16px] border border-border-modal bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.14)] sm:rounded-[20px] sm:p-5">
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-brand-green-soft">{icon}</span>
            <h2 className="text-[16px] font-semibold text-text-primary sm:text-[18px] lg:text-[19px]">
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#d7dcdf] text-[#666b78] transition cursor-pointer hover:bg-[#f4f6f7]"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="mt-4 sm:mt-5">{children}</div>
      </div>
    </div>
  );
}
