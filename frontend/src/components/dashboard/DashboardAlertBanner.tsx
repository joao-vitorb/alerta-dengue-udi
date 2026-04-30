import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "../../lib/icons";

type DashboardAlertBannerProps = {
  title: string;
  description: string;
};

export function DashboardAlertBanner({
  title,
  description,
}: DashboardAlertBannerProps) {
  return (
    <section className="rounded-[14px] border border-warning-border bg-warning-bg px-3 py-3 sm:rounded-[18px] sm:px-4">
      <div className="flex items-start gap-2 sm:gap-3">
        <span className="mt-0.5 text-[18px] text-warning-icon sm:text-[20px]">
          <FontAwesomeIcon icon={faTriangleExclamation} />
        </span>

        <div>
          <p className="text-[15px] font-semibold text-warning-title sm:text-[16px] lg:text-[18px]">
            {title}
          </p>
          <p className="mt-1 text-[13px] leading-5 text-warning-body sm:text-[14px] sm:leading-6">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
