/*
  Warnings:

  - You are about to drop the column `week_template_id` on the `replace` table. All the data in the column will be lost.
  - Added the required column `schedule_id` to the `replace` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "replace" DROP CONSTRAINT "replace_week_template_id_fkey";

-- AlterTable
ALTER TABLE "replace" DROP COLUMN "week_template_id",
ADD COLUMN     "schedule_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "replace" ADD CONSTRAINT "replace_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
