-- CreateTable
CREATE TABLE "ClimateNotificationLog" (
    "id" SERIAL NOT NULL,
    "anonymousId" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "ruleKey" TEXT NOT NULL,
    "windowKey" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClimateNotificationLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClimateNotificationLog_anonymousId_idx" ON "ClimateNotificationLog"("anonymousId");

-- CreateIndex
CREATE INDEX "ClimateNotificationLog_windowKey_idx" ON "ClimateNotificationLog"("windowKey");

-- CreateIndex
CREATE INDEX "ClimateNotificationLog_anonymousId_channel_ruleKey_windowKe_idx" ON "ClimateNotificationLog"("anonymousId", "channel", "ruleKey", "windowKey", "status");
