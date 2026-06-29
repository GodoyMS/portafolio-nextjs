-- DropIndex
DROP INDEX "Project_year_idx";

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Project_sortOrder_idx" ON "Project"("sortOrder");
