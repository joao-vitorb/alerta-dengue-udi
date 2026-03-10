export type DeviceType = "DESKTOP" | "MOBILE";

export type UserPreference = {
  id: string;
  anonymousId: string;
  neighborhood: string;
  email: string | null;
  notificationsEnabled: boolean;
  emailNotificationsEnabled: boolean;
  pushNotificationsEnabled: boolean;
  deviceType: DeviceType;
  createdAt: string;
  updatedAt: string;
};

export type LocalExperience = {
  hasVisited: boolean;
  hasCompletedOnboarding: boolean;
  anonymousId: string;
  neighborhood: string;
  email: string;
  notificationsEnabled: boolean;
  emailNotificationsEnabled: boolean;
  pushNotificationsEnabled: boolean;
  deviceType: DeviceType;
};

export type PreferenceFormValues = {
  neighborhood: string;
  email: string;
  notificationsEnabled: boolean;
  emailNotificationsEnabled: boolean;
  pushNotificationsEnabled: boolean;
};

export type CreateUserPreferencePayload = {
  anonymousId: string;
  neighborhood: string;
  email?: string;
  notificationsEnabled: boolean;
  emailNotificationsEnabled: boolean;
  pushNotificationsEnabled: boolean;
  deviceType: DeviceType;
};

export type UpdateUserPreferencePayload = Partial<
  Omit<CreateUserPreferencePayload, "anonymousId">
>;
