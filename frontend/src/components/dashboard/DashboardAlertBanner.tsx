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
    <section className="rounded-[18px] border border-[#f0c86b] bg-[#f8f3e8] px-4 py-3">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-[20px] text-[#df7c1d]">
          <FontAwesomeIcon icon={faTriangleExclamation} />
        </span>

        <div>
          <p className="text-[18px] font-semibold text-[#a55b14]">{title}</p>
          <p className="mt-1 text-[14px] leading-6 text-[#bd6c1f]">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
