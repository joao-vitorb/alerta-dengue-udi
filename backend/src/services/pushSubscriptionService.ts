import { AppError } from "../errors/AppError";
import { prisma } from "../lib/prisma";
import type { UpsertPushSubscriptionInput } from "../schemas/pushSubscriptionSchemas";

export async function upsertPushSubscription(
  input: UpsertPushSubscriptionInput,
) {
  const userPreference = await prisma.userPreference.findUnique({
    where: {
      anonymousId: input.anonymousId,
    },
  });

  if (!userPreference) {
    throw new AppError("User preference not found", 404);
  }

  return prisma.pushSubscription.upsert({
    where: {
      anonymousId: input.anonymousId,
    },
    update: {
      endpoint: input.subscription.endpoint,
      p256dh: input.subscription.keys.p256dh,
      auth: input.subscription.keys.auth,
      userAgent: input.subscription.userAgent ?? null,
    },
    create: {
      anonymousId: input.anonymousId,
      endpoint: input.subscription.endpoint,
      p256dh: input.subscription.keys.p256dh,
      auth: input.subscription.keys.auth,
      userAgent: input.subscription.userAgent ?? null,
    },
  });
}

export async function deletePushSubscription(anonymousId: string) {
  const currentSubscription = await prisma.pushSubscription.findUnique({
    where: {
      anonymousId,
    },
  });

  if (!currentSubscription) {
    return {
      deleted: false,
    };
  }

  await prisma.pushSubscription.delete({
    where: {
      anonymousId,
    },
  });

  return {
    deleted: true,
  };
}
