/*
  Warnings:

  - You are about to drop the column `source` on the `Editorial` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sourceId]` on the table `Editorial` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sourceId` to the `Editorial` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Editorial" DROP COLUMN "source",
ADD COLUMN     "sourceId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Source_link_idx" ON "Source"("link");

-- CreateIndex
CREATE UNIQUE INDEX "Editorial_sourceId_key" ON "Editorial"("sourceId");

-- AddForeignKey
ALTER TABLE "Editorial" ADD CONSTRAINT "Editorial_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
