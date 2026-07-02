/*
  Warnings:

  - You are about to drop the column `idBooked` on the `doctor_schedules` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "doctor_schedules" DROP COLUMN "idBooked",
ADD COLUMN     "isBooked" BOOLEAN NOT NULL DEFAULT false;
