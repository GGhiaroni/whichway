/*
  Warnings:

  - You are about to drop the column `avgPrice` on the `FeaturedDestination` table. All the data in the column will be lost.
  - You are about to drop the column `bestTime` on the `FeaturedDestination` table. All the data in the column will be lost.
  - You are about to drop the column `climate` on the `FeaturedDestination` table. All the data in the column will be lost.
  - Added the required column `bestTimeDesc` to the `FeaturedDestination` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bestTimeValue` to the `FeaturedDestination` table without a default value. This is not possible if the table is not empty.
  - Added the required column `costBudget` to the `FeaturedDestination` table without a default value. This is not possible if the table is not empty.
  - Added the required column `costFlight` to the `FeaturedDestination` table without a default value. This is not possible if the table is not empty.
  - Added the required column `costLuxury` to the `FeaturedDestination` table without a default value. This is not possible if the table is not empty.
  - Added the required column `costMid` to the `FeaturedDestination` table without a default value. This is not possible if the table is not empty.
  - Added the required column `offSeasonDesc` to the `FeaturedDestination` table without a default value. This is not possible if the table is not empty.
  - Added the required column `offSeasonValue` to the `FeaturedDestination` table without a default value. This is not possible if the table is not empty.
  - Added the required column `peakSeasonDesc` to the `FeaturedDestination` table without a default value. This is not possible if the table is not empty.
  - Added the required column `peakSeasonValue` to the `FeaturedDestination` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rainyDays` to the `FeaturedDestination` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `FeaturedDestination` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reviews` to the `FeaturedDestination` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sunnyDays` to the `FeaturedDestination` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tempSummer` to the `FeaturedDestination` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tempWinter` to the `FeaturedDestination` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FeaturedDestination" DROP COLUMN "avgPrice",
DROP COLUMN "bestTime",
DROP COLUMN "climate",
ADD COLUMN     "bestTimeDesc" TEXT NOT NULL,
ADD COLUMN     "bestTimeValue" TEXT NOT NULL,
ADD COLUMN     "costBudget" TEXT NOT NULL,
ADD COLUMN     "costFlight" TEXT NOT NULL,
ADD COLUMN     "costLuxury" TEXT NOT NULL,
ADD COLUMN     "costMid" TEXT NOT NULL,
ADD COLUMN     "offSeasonDesc" TEXT NOT NULL,
ADD COLUMN     "offSeasonValue" TEXT NOT NULL,
ADD COLUMN     "peakSeasonDesc" TEXT NOT NULL,
ADD COLUMN     "peakSeasonValue" TEXT NOT NULL,
ADD COLUMN     "rainyDays" TEXT NOT NULL,
ADD COLUMN     "rating" TEXT NOT NULL,
ADD COLUMN     "reviews" TEXT NOT NULL,
ADD COLUMN     "sunnyDays" TEXT NOT NULL,
ADD COLUMN     "tempSummer" TEXT NOT NULL,
ADD COLUMN     "tempWinter" TEXT NOT NULL;
