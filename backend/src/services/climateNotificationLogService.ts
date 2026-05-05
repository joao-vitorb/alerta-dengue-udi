import type { Prisma } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";

export type ClimateNotificationChannel = "EMAIL" | "PUSH";
export type ClimateNotificationStatus = "SENT" | "FAILED" | "SKIPPED";

const CLIMATE_NOTIFICATION_TIMEZONE = "America/Sao_Paulo";

export function getClimateNotificationWindowKey(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: CLIMATE_NOTIFICATION_TIMEZONE,
  }).format(date);
}

export async function hasSentClimateNotification(input: {
  anonymousId: string;
  channel: ClimateNotificationChannel;
  ruleKey: string;
  windowKey: string;
}) {
  const existing = await prisma.climateNotificationLog.findFirst({
    where: {
      anonymousId: input.anonymousId,
      channel: input.channel,
      ruleKey: input.ruleKey,
      windowKey: input.windowKey,
      status: "SENT",
    },
    select: { id: true },
  });

  return existing !== null;
}

export async function createClimateNotificationLog(input: {
  anonymousId: string;
  neighborhood: string;
  channel: ClimateNotificationChannel;
  ruleKey: string;
  windowKey: string;
  status: ClimateNotificationStatus;
  message: string;
  metadata?: unknown;
}) {
  await prisma.climateNotificationLog.create({
    data: {
      anonymousId: input.anonymousId,
      neighborhood: input.neighborhood,
      channel: input.channel,
      ruleKey: input.ruleKey,
      windowKey: input.windowKey,
      status: input.status,
      message: input.message,
      metadata: serializeMetadata(input.metadata),
    },
  });
}

function serializeMetadata(metadata: unknown): Prisma.InputJsonValue | undefined {
  if (metadata === undefined || metadata === null) {
    return undefined;
  }

  return metadata as Prisma.InputJsonValue;
}
