/*
  Warnings:

  - You are about to drop the column `group_id` on the `student` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "student" DROP CONSTRAINT "student_group_id_fkey";

-- DropIndex
DROP INDEX "student_group_id_key";

-- AlterTable
ALTER TABLE "student" DROP COLUMN "group_id";
