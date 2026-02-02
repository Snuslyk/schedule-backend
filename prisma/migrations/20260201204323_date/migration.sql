/*
  Warnings:

  - You are about to drop the column `created_at` on the `day` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `day` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `group` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `group` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `lesson` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `lesson` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `organizations` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `organizations` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `owner` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `owner` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `replace` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `replace` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `schedule` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `schedule` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `slot` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `slot` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `week_template` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `week_template` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "day" DROP COLUMN "created_at",
DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "group" DROP COLUMN "created_at",
DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "lesson" DROP COLUMN "created_at",
DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "organizations" DROP COLUMN "created_at",
DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "owner" DROP COLUMN "created_at",
DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "replace" DROP COLUMN "created_at",
DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "schedule" DROP COLUMN "created_at",
DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "slot" DROP COLUMN "created_at",
DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "student" DROP COLUMN "created_at",
DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "week_template" DROP COLUMN "created_at",
DROP COLUMN "updated_at";
