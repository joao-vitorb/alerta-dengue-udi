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
    <section className="rounded-[14px] border border-[#f0c86b] bg-[#f8f3e8] px-3 py-3 sm:rounded-[18px] sm:px-4">
      <div className="flex items-start gap-2 sm:gap-3">
        <span className="mt-0.5 text-[18px] text-[#df7c1d] sm:text-[20px]">
          <FontAwesomeIcon icon={faTriangleExclamation} />
        </span>

        <div>
          <p className="text-[15px] font-semibold text-[#a55b14] sm:text-[16px] lg:text-[18px]">
            {title}
          </p>
          <p className="mt-1 text-[13px] leading-5 text-[#bd6c1f] sm:text-[14px] sm:leading-6">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
