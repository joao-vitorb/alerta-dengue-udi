import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faBell,
  faCheck,
  faLocationDot,
  faMapLocationDot,
} from "../../lib/icons";

type OnboardingStepIconVariant =
  | "welcome"
  | "location"
  | "notifications"
  | "success";

type OnboardingStepIconProps = {
  variant: OnboardingStepIconVariant;
};

const ICON_BY_VARIANT: Record<OnboardingStepIconVariant, IconDefinition> = {
  welcome: faMapLocationDot,
  location: faLocationDot,
  notifications: faBell,
  success: faCheck,
};

const SUCCESS_WRAPPER_CLASSES =
  "mx-auto flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-brand-green text-[22px] text-brand-green sm:h-14 sm:w-14 sm:border-[4px] sm:text-[26px] lg:h-16 lg:w-16 lg:text-[30px]";

const DEFAULT_WRAPPER_CLASSES =
  "mx-auto flex items-center justify-center text-[40px] text-brand-green sm:text-[46px] lg:text-[52px]";

export function OnboardingStepIcon({ variant }: OnboardingStepIconProps) {
  const wrapperClasses =
    variant === "success" ? SUCCESS_WRAPPER_CLASSES : DEFAULT_WRAPPER_CLASSES;

  return (
    <div className={wrapperClasses}>
      <FontAwesomeIcon icon={ICON_BY_VARIANT[variant]} />
    </div>
  );
}
