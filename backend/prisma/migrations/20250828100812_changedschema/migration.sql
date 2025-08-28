/*
  Warnings:

  - The values [ACTIVE] on the enum `ProjectStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."ProjectStatus_new" AS ENUM ('INACTIVE', 'COMPLETED', 'ONGOING', 'ARCHIVED');
ALTER TABLE "public"."Project" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."Project" ALTER COLUMN "status" TYPE "public"."ProjectStatus_new" USING ("status"::text::"public"."ProjectStatus_new");
ALTER TYPE "public"."ProjectStatus" RENAME TO "ProjectStatus_old";
ALTER TYPE "public"."ProjectStatus_new" RENAME TO "ProjectStatus";
DROP TYPE "public"."ProjectStatus_old";
ALTER TABLE "public"."Project" ALTER COLUMN "status" SET DEFAULT 'INACTIVE';
COMMIT;

-- AlterTable
ALTER TABLE "public"."Project" ALTER COLUMN "status" SET DEFAULT 'INACTIVE';

-- CreateTable
CREATE TABLE "public"."_UserProjects" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserProjects_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_UserProjects_B_index" ON "public"."_UserProjects"("B");

-- AddForeignKey
ALTER TABLE "public"."_UserProjects" ADD CONSTRAINT "_UserProjects_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_UserProjects" ADD CONSTRAINT "_UserProjects_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
