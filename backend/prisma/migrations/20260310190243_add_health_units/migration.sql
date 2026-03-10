-- CreateEnum
CREATE TYPE "HealthUnitType" AS ENUM ('UAI', 'UBS', 'UBSF', 'HOSPITAL', 'CAPS', 'CER', 'COV', 'CMAD', 'CEREST', 'LABORATORY', 'OTHER');

-- CreateEnum
CREATE TYPE "HealthCareLevel" AS ENUM ('PRIMARY_CARE', 'URGENT_CARE', 'SPECIALTY_CARE', 'SUPPORT_SERVICE');

-- CreateEnum
CREATE TYPE "HealthSector" AS ENUM ('CENTRAL', 'EAST', 'NORTH', 'SOUTH', 'WEST', 'RURAL');

-- CreateTable
CREATE TABLE "HealthUnit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unitType" "HealthUnitType" NOT NULL,
    "careLevel" "HealthCareLevel" NOT NULL,
    "sector" "HealthSector" NOT NULL,
    "address" TEXT NOT NULL,
    "neighborhood" TEXT,
    "phone" TEXT,
    "openingHours" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "officialSourceUrl" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HealthUnit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HealthUnit_name_idx" ON "HealthUnit"("name");

-- CreateIndex
CREATE INDEX "HealthUnit_neighborhood_idx" ON "HealthUnit"("neighborhood");

-- CreateIndex
CREATE INDEX "HealthUnit_unitType_idx" ON "HealthUnit"("unitType");

-- CreateIndex
CREATE INDEX "HealthUnit_careLevel_idx" ON "HealthUnit"("careLevel");

-- CreateIndex
CREATE INDEX "HealthUnit_sector_idx" ON "HealthUnit"("sector");

-- CreateIndex
CREATE UNIQUE INDEX "HealthUnit_name_address_key" ON "HealthUnit"("name", "address");
