-- DropForeignKey
ALTER TABLE "Editorial" DROP CONSTRAINT "Editorial_userId_fkey";

-- AlterTable
ALTER TABLE "Editorial" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Editorial" ADD CONSTRAINT "Editorial_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
