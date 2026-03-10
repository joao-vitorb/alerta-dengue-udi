-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('DESKTOP', 'MOBILE');

-- CreateTable
CREATE TABLE "UserPreference" (
    "id" TEXT NOT NULL,
    "anonymousId" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "email" TEXT,
    "notificationsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "emailNotificationsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "pushNotificationsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "deviceType" "DeviceType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPreference_anonymousId_key" ON "UserPreference"("anonymousId");

-- CreateIndex
CREATE INDEX "UserPreference_neighborhood_idx" ON "UserPreference"("neighborhood");
