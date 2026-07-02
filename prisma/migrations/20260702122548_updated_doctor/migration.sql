-- AlterTable
ALTER TABLE "doctors" ALTER COLUMN "appointmentFee" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "status" SET DEFAULT 'UNPAID';
