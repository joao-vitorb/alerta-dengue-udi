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
    return "mx-auto flex h-16 w-16 items-center justify-center rounded-full border-[4px] border-[#13a36d] text-[30px] text-[#13a36d]";
  }

  return "mx-auto flex items-center justify-center text-[52px] text-[#13a36d]";
}

export function OnboardingStepIcon({ variant }: OnboardingStepIconProps) {
  return (
    <div className={getWrapperClasses(variant)}>
      <FontAwesomeIcon icon={getIconByVariant(variant)} />
    </div>
  );
}
