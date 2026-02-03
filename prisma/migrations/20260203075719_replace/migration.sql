/*
  Warnings:

  - You are about to drop the column `lesson_id` on the `replace` table. All the data in the column will be lost.
  - Added the required column `classroom` to the `replace` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacher_id` to the `replace` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "replace" DROP CONSTRAINT "replace_lesson_id_fkey";

-- DropIndex
DROP INDEX "replace_lesson_id_key";

-- AlterTable
ALTER TABLE "replace" DROP COLUMN "lesson_id",
ADD COLUMN     "classroom" TEXT NOT NULL,
ADD COLUMN     "is_available" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "teacher_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "replace" ADD CONSTRAINT "replace_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
