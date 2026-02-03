/*
  Warnings:

  - You are about to drop the column `replace_id` on the `replace` table. All the data in the column will be lost.
  - You are about to drop the `owner` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[lesson_id]` on the table `replace` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `teacher_id` to the `lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lesson_id` to the `replace` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "replace" DROP CONSTRAINT "replace_replace_id_fkey";

-- DropIndex
DROP INDEX "replace_replace_id_key";

-- AlterTable
ALTER TABLE "lesson" ADD COLUMN     "teacher_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "replace" DROP COLUMN "replace_id",
ADD COLUMN     "lesson_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "owner";

-- DropEnum
DROP TYPE "OwnerType";

-- CreateTable
CREATE TABLE "teacher" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "teacher_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "replace_lesson_id_key" ON "replace"("lesson_id");

-- AddForeignKey
ALTER TABLE "replace" ADD CONSTRAINT "replace_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson" ADD CONSTRAINT "lesson_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
