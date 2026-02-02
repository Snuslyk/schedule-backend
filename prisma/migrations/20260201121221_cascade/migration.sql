-- DropForeignKey
ALTER TABLE "day" DROP CONSTRAINT "day_week_template_id_fkey";

-- DropForeignKey
ALTER TABLE "lesson" DROP CONSTRAINT "lesson_day_id_fkey";

-- DropForeignKey
ALTER TABLE "lesson" DROP CONSTRAINT "lesson_replace_id_fkey";

-- DropForeignKey
ALTER TABLE "replace" DROP CONSTRAINT "replace_week_template_id_fkey";

-- DropForeignKey
ALTER TABLE "schedule" DROP CONSTRAINT "schedule_group_id_fkey";

-- DropForeignKey
ALTER TABLE "slot" DROP CONSTRAINT "slot_day_id_fkey";

-- DropForeignKey
ALTER TABLE "week_template" DROP CONSTRAINT "week_template_schedule_id_fkey";

-- AddForeignKey
ALTER TABLE "schedule" ADD CONSTRAINT "schedule_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "week_template" ADD CONSTRAINT "week_template_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "day" ADD CONSTRAINT "day_week_template_id_fkey" FOREIGN KEY ("week_template_id") REFERENCES "week_template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "replace" ADD CONSTRAINT "replace_week_template_id_fkey" FOREIGN KEY ("week_template_id") REFERENCES "schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slot" ADD CONSTRAINT "slot_day_id_fkey" FOREIGN KEY ("day_id") REFERENCES "day"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson" ADD CONSTRAINT "lesson_replace_id_fkey" FOREIGN KEY ("replace_id") REFERENCES "replace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson" ADD CONSTRAINT "lesson_day_id_fkey" FOREIGN KEY ("day_id") REFERENCES "day"("id") ON DELETE CASCADE ON UPDATE CASCADE;
