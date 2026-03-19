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
    <div className="fixed inset-0 z-3500 flex items-start justify-center bg-black/20 px-4 py-6">
      <div className="w-full max-w-135 rounded-[20px] border border-[#d9dede] bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.14)]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[#10a672]">{icon}</span>
            <h2 className="text-[19px] font-semibold text-[#111318]">
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[#d7dcdf] text-[#666b78] transition cursor-pointer hover:bg-[#f4f6f7]"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}
