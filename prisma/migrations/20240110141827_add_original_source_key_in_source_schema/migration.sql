/*
  Warnings:

  - A unique constraint covering the columns `[originalSource]` on the table `Source` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Source_link_idx";

-- AlterTable
ALTER TABLE "Source" ADD COLUMN     "originalSource" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Source_originalSource_key" ON "Source"("originalSource");

-- CreateIndex
CREATE INDEX "Source_link_originalSource_idx" ON "Source"("link", "originalSource");
