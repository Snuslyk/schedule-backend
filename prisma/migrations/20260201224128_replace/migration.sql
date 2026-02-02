/*
  Warnings:

  - You are about to drop the column `replace_id` on the `lesson` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[replace_id]` on the table `replace` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `replace_id` to the `replace` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "lesson" DROP CONSTRAINT "lesson_replace_id_fkey";

-- DropIndex
DROP INDEX "lesson_replace_id_key";

-- AlterTable
ALTER TABLE "lesson" DROP COLUMN "replace_id";

-- AlterTable
ALTER TABLE "replace" ADD COLUMN     "replace_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "replace_replace_id_key" ON "replace"("replace_id");

-- AddForeignKey
ALTER TABLE "replace" ADD CONSTRAINT "replace_replace_id_fkey" FOREIGN KEY ("replace_id") REFERENCES "lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
