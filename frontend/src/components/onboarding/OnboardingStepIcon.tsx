import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCheck,
  faLocationDot,
  faMapLocationDot,
} from "../../lib/icons";

type OnboardingStepIconProps = {
  variant: "welcome" | "location" | "notifications" | "success";
};

function getIconByVariant(variant: OnboardingStepIconProps["variant"]) {
  switch (variant) {
    case "welcome":
      return faMapLocationDot;
    case "location":
      return faLocationDot;
    case "notifications":
      return faBell;
    case "success":
      return faCheck;
    default:
      return faMapLocationDot;
  }
}

function getWrapperClasses(variant: OnboardingStepIconProps["variant"]) {
  if (variant === "success") {
    return "mx-auto flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-[#13a36d] text-[22px] text-[#13a36d] sm:h-14 sm:w-14 sm:border-[4px] sm:text-[26px] lg:h-16 lg:w-16 lg:text-[30px]";
  }

  return "mx-auto flex items-center justify-center text-[40px] text-[#13a36d] sm:text-[46px] lg:text-[52px]";
}

export function OnboardingStepIcon({ variant }: OnboardingStepIconProps) {
  return (
    <div className={getWrapperClasses(variant)}>
      <FontAwesomeIcon icon={getIconByVariant(variant)} />
    </div>
  );
}
