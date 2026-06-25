-- AlterTable
ALTER TABLE "admins" ALTER COLUMN "contactNumber" DROP NOT NULL;

-- AlterTable
ALTER TABLE "patients" ADD COLUMN     "contactNumber" TEXT;
