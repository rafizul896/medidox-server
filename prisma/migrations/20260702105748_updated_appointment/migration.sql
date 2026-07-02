/*
  Warnings:

  - The `paymentStatus` column on the `appointments` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "appointments" ALTER COLUMN "status" SET DEFAULT 'SCHEDULED',
DROP COLUMN "paymentStatus",
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID';
