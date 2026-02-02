-- DropForeignKey
ALTER TABLE "replace" DROP CONSTRAINT "replace_week_template_id_fkey";

-- AddForeignKey
ALTER TABLE "replace" ADD CONSTRAINT "replace_week_template_id_fkey" FOREIGN KEY ("week_template_id") REFERENCES "schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
