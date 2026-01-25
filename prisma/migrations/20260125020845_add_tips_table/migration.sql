-- CreateTable
CREATE TABLE "Tip" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "featuredDestinationId" TEXT NOT NULL,

    CONSTRAINT "Tip_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Tip" ADD CONSTRAINT "Tip_featuredDestinationId_fkey" FOREIGN KEY ("featuredDestinationId") REFERENCES "FeaturedDestination"("id") ON DELETE CASCADE ON UPDATE CASCADE;
