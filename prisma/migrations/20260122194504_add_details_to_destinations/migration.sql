-- CreateTable
CREATE TABLE "FeaturedDestination" (
    "id" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "priceLevel" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "climate" TEXT NOT NULL,
    "bestTime" TEXT NOT NULL,
    "avgPrice" TEXT NOT NULL,
    "highlights" TEXT NOT NULL,

    CONSTRAINT "FeaturedDestination_pkey" PRIMARY KEY ("id")
);
