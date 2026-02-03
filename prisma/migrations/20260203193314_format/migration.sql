/*
  Warnings:

  - Added the required column `subject_id` to the `replace` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "replace" ADD COLUMN     "subject_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "replace" ADD CONSTRAINT "replace_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
