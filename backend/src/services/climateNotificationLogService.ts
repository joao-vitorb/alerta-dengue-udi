import { prisma } from "../lib/prisma";

export type ClimateNotificationChannel = "EMAIL" | "PUSH";
export type ClimateNotificationStatus = "SENT" | "FAILED" | "SKIPPED";

export function getClimateNotificationWindowKey(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
  }).format(date);
}

export async function ensureClimateNotificationLogTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "ClimateNotificationLog" (
      "id" BIGSERIAL PRIMARY KEY,
      "anonymousId" TEXT NOT NULL,
      "neighborhood" TEXT NOT NULL,
      "channel" TEXT NOT NULL,
      "ruleKey" TEXT NOT NULL,
      "windowKey" TEXT NOT NULL,
      "status" TEXT NOT NULL,
      "message" TEXT NOT NULL,
      "metadata" JSONB,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "ClimateNotificationLog_anonymousId_idx"
    ON "ClimateNotificationLog" ("anonymousId");
  `);

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "ClimateNotificationLog_windowKey_idx"
    ON "ClimateNotificationLog" ("windowKey");
  `);
}

export async function hasSentClimateNotification(input: {
  anonymousId: string;
  channel: ClimateNotificationChannel;
  ruleKey: string;
  windowKey: string;
}) {
  const rows = await prisma.$queryRawUnsafe<Array<{ id: bigint }>>(
    `
      SELECT "id"
      FROM "ClimateNotificationLog"
      WHERE "anonymousId" = $1
        AND "channel" = $2
        AND "ruleKey" = $3
        AND "windowKey" = $4
        AND "status" = 'SENT'
      LIMIT 1
    `,
    input.anonymousId,
    input.channel,
    input.ruleKey,
    input.windowKey,
  );

  return rows.length > 0;
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
  const metadataAsJson = input.metadata ? JSON.stringify(input.metadata) : null;

  await prisma.$executeRawUnsafe(
    `
      INSERT INTO "ClimateNotificationLog" (
        "anonymousId",
        "neighborhood",
        "channel",
        "ruleKey",
        "windowKey",
        "status",
        "message",
        "metadata"
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb)
    `,
    input.anonymousId,
    input.neighborhood,
    input.channel,
    input.ruleKey,
    input.windowKey,
    input.status,
    input.message,
    metadataAsJson,
  );
}
