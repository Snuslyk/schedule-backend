/*
  Warnings:

  - You are about to drop the column `replace_id` on the `slot` table. All the data in the column will be lost.
  - Added the required column `order_length` to the `lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_number` to the `replace` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "slot" DROP CONSTRAINT "slot_replace_id_fkey";

-- DropIndex
DROP INDEX "slot_replace_id_key";

-- AlterTable
ALTER TABLE "lesson" ADD COLUMN     "order_length" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "replace" ADD COLUMN     "order_number" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "slot" DROP COLUMN "replace_id";
