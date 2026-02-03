/*
  Warnings:

  - You are about to drop the column `number` on the `subject` table. All the data in the column will be lost.
  - You are about to drop the column `teacher` on the `subject` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "subject" DROP COLUMN "number",
DROP COLUMN "teacher";

-- CreateTable
CREATE TABLE "_SubjectToTeacher" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_SubjectToTeacher_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_SubjectToTeacher_B_index" ON "_SubjectToTeacher"("B");

-- AddForeignKey
ALTER TABLE "_SubjectToTeacher" ADD CONSTRAINT "_SubjectToTeacher_A_fkey" FOREIGN KEY ("A") REFERENCES "subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubjectToTeacher" ADD CONSTRAINT "_SubjectToTeacher_B_fkey" FOREIGN KEY ("B") REFERENCES "teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
