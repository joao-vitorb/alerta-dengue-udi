-- CreateTable
CREATE TABLE "WeatherSnapshot" (
    "id" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "source" TEXT NOT NULL,
    "currentTemperature" DOUBLE PRECISION,
    "currentRain" DOUBLE PRECISION,
    "currentRelativeHumidity" DOUBLE PRECISION,
    "currentWeatherCode" INTEGER,
    "todayPrecipitationProbabilityMax" DOUBLE PRECISION,
    "todayPrecipitationSum" DOUBLE PRECISION,
    "todayTemperatureMax" DOUBLE PRECISION,
    "todayTemperatureMin" DOUBLE PRECISION,
    "tomorrowPrecipitationProbabilityMax" DOUBLE PRECISION,
    "tomorrowPrecipitationSum" DOUBLE PRECISION,
    "pastThreeDaysPrecipitationSum" DOUBLE PRECISION NOT NULL,
    "preventionWindowScore" INTEGER NOT NULL,
    "rawPayload" JSONB NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WeatherSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WeatherSnapshot_neighborhood_idx" ON "WeatherSnapshot"("neighborhood");

-- CreateIndex
CREATE INDEX "WeatherSnapshot_fetchedAt_idx" ON "WeatherSnapshot"("fetchedAt");

-- CreateIndex
CREATE INDEX "WeatherSnapshot_neighborhood_fetchedAt_idx" ON "WeatherSnapshot"("neighborhood", "fetchedAt");
