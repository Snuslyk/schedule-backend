-- CreateEnum
CREATE TYPE "Mode" AS ENUM ('PARITY', 'OTHER');

-- AlterTable
ALTER TABLE "schedule" ADD COLUMN     "mode" "Mode" NOT NULL DEFAULT 'OTHER';
