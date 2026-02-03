/*
  Warnings:

  - You are about to drop the `subjects` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "subjects";

-- CreateTable
CREATE TABLE "subject" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "teacher" TEXT NOT NULL,
    "number" INTEGER NOT NULL,

    CONSTRAINT "subject_pkey" PRIMARY KEY ("id")
);
