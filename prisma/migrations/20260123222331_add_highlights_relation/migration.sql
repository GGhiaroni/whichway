/*
  Warnings:

  - You are about to drop the column `highlights` on the `FeaturedDestination` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FeaturedDestination" DROP COLUMN "highlights";

-- CreateTable
CREATE TABLE "Highlight" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "featuredDestinationId" TEXT NOT NULL,

    CONSTRAINT "Highlight_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Highlight" ADD CONSTRAINT "Highlight_featuredDestinationId_fkey" FOREIGN KEY ("featuredDestinationId") REFERENCES "FeaturedDestination"("id") ON DELETE CASCADE ON UPDATE CASCADE;
