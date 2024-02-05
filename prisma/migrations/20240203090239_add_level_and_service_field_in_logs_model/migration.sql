/*
  Warnings:

  - Added the required column `level` to the `Logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `service` to the `Logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Logs" ADD COLUMN     "level" TEXT NOT NULL,
ADD COLUMN     "service" TEXT NOT NULL;
