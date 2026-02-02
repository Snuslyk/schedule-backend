/*
  Warnings:

  - A unique constraint covering the columns `[group_id]` on the table `schedule` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "schedule_group_id_key" ON "schedule"("group_id");
