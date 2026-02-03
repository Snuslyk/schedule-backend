/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `subject` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `subject_id` to the `lesson` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "lesson" ADD COLUMN     "subject_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "subject_name_key" ON "subject"("name");

-- AddForeignKey
ALTER TABLE "lesson" ADD CONSTRAINT "lesson_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
