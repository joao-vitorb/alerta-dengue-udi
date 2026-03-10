import type { UserPreference } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";
import { AppError } from "../errors/AppError";
import type {
  CreateUserPreferenceInput,
  UpdateUserPreferenceInput,
} from "../schemas/userPreferenceSchemas";

function normalizeCreateInput(input: CreateUserPreferenceInput) {
  const email = input.email?.trim() || null;
  const notificationsEnabled = input.notificationsEnabled;
  const emailNotificationsEnabled = Boolean(
    notificationsEnabled && email && input.emailNotificationsEnabled,
  );
  const pushNotificationsEnabled = Boolean(
    notificationsEnabled &&
    input.deviceType === "MOBILE" &&
    input.pushNotificationsEnabled,
  );

  return {
    anonymousId: input.anonymousId.trim(),
    neighborhood: input.neighborhood.trim(),
    email,
    notificationsEnabled,
    emailNotificationsEnabled,
    pushNotificationsEnabled,
    deviceType: input.deviceType,
  };
}

function normalizeUpdateInput(
  input: UpdateUserPreferenceInput,
  current: UserPreference,
) {
  const deviceType = input.deviceType ?? current.deviceType;
  const notificationsEnabled =
    input.notificationsEnabled ?? current.notificationsEnabled;

  const email =
    input.email !== undefined ? input.email?.trim() || null : current.email;

  const emailNotificationsEnabled = Boolean(
    notificationsEnabled &&
    email &&
    (input.emailNotificationsEnabled ?? current.emailNotificationsEnabled),
  );

  const pushNotificationsEnabled = Boolean(
    notificationsEnabled &&
    deviceType === "MOBILE" &&
    (input.pushNotificationsEnabled ?? current.pushNotificationsEnabled),
  );

  return {
    neighborhood: input.neighborhood?.trim() ?? current.neighborhood,
    email,
    notificationsEnabled,
    emailNotificationsEnabled,
    pushNotificationsEnabled,
    deviceType,
  };
}

export async function getUserPreferenceByAnonymousId(anonymousId: string) {
  const userPreference = await prisma.userPreference.findUnique({
    where: {
      anonymousId,
    },
  });

  if (!userPreference) {
    throw new AppError("User preference not found", 404);
  }

  return userPreference;
}

export async function upsertUserPreference(input: CreateUserPreferenceInput) {
  const data = normalizeCreateInput(input);

  return prisma.userPreference.upsert({
    where: {
      anonymousId: data.anonymousId,
    },
    update: data,
    create: data,
  });
}

export async function updateUserPreference(
  anonymousId: string,
  input: UpdateUserPreferenceInput,
) {
  const current = await prisma.userPreference.findUnique({
    where: {
      anonymousId,
    },
  });

  if (!current) {
    throw new AppError("User preference not found", 404);
  }

  const data = normalizeUpdateInput(input, current);

  return prisma.userPreference.update({
    where: {
      anonymousId,
    },
    data,
  });
}
