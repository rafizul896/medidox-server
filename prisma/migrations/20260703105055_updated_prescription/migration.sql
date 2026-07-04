/*
  Warnings:

  - You are about to drop the column `dosage` on the `prescriptions` table. All the data in the column will be lost.
  - You are about to drop the column `medications` on the `prescriptions` table. All the data in the column will be lost.
  - You are about to drop the column `nextVisitRequired` on the `prescriptions` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `prescriptions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "prescriptions" DROP COLUMN "dosage",
DROP COLUMN "medications",
DROP COLUMN "nextVisitRequired",
DROP COLUMN "notes";
