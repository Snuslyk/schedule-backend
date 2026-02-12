/*
  Warnings:

  - The `roles` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'TEACHER', 'STUDENT');

-- AlterTable
ALTER TABLE "user" DROP COLUMN "roles",
ADD COLUMN     "roles" "Role"[];

-- DropEnum
DROP TYPE "Roles";
