-- AlterTable
ALTER TABLE "ClimateNotificationLog" ADD COLUMN     "recipientEmail" TEXT;

-- CreateIndex
CREATE INDEX "ClimateNotificationLog_recipientEmail_channel_ruleKey_windo_idx" ON "ClimateNotificationLog"("recipientEmail", "channel", "ruleKey", "windowKey", "status");
