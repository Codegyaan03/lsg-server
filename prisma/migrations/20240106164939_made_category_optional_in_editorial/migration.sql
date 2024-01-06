-- DropForeignKey
ALTER TABLE "Editorial" DROP CONSTRAINT "Editorial_categoryId_fkey";

-- AlterTable
ALTER TABLE "Editorial" ALTER COLUMN "categoryId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Editorial" ADD CONSTRAINT "Editorial_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
