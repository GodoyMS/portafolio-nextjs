-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('MAIN', 'NOTEWORTHY');

-- CreateTable
CREATE TABLE "WorkExperience" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "companyLink" TEXT,
    "companyImage" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isPresent" BOOLEAN NOT NULL DEFAULT false,
    "description" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkExperience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkExperienceLink" (
    "id" TEXT NOT NULL,
    "workExperienceId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "href" TEXT NOT NULL,

    CONSTRAINT "WorkExperienceLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkExperienceBadge" (
    "id" TEXT NOT NULL,
    "workExperienceId" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "WorkExperienceBadge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Education" (
    "id" TEXT NOT NULL,
    "institutionName" TEXT NOT NULL,
    "institutionLogo" TEXT,
    "degreeTitle" TEXT NOT NULL,
    "fieldOfStudy" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isPresent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EducationLink" (
    "id" TEXT NOT NULL,
    "educationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "href" TEXT NOT NULL,

    CONSTRAINT "EducationLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imagePreview" TEXT,
    "videoDemo" TEXT,
    "year" INTEGER NOT NULL,
    "type" "ProjectType" NOT NULL DEFAULT 'MAIN',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "githubUrl" TEXT,
    "productionUrl" TEXT,
    "playstoreUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectSkill" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ProjectSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectLink" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "href" TEXT NOT NULL,

    CONSTRAINT "ProjectLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CV" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "fileUrl" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CV_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WorkExperience_startDate_idx" ON "WorkExperience"("startDate" DESC);

-- CreateIndex
CREATE INDEX "WorkExperience_isPresent_idx" ON "WorkExperience"("isPresent");

-- CreateIndex
CREATE INDEX "WorkExperienceLink_workExperienceId_idx" ON "WorkExperienceLink"("workExperienceId");

-- CreateIndex
CREATE INDEX "WorkExperienceBadge_workExperienceId_idx" ON "WorkExperienceBadge"("workExperienceId");

-- CreateIndex
CREATE INDEX "Education_startDate_idx" ON "Education"("startDate" DESC);

-- CreateIndex
CREATE INDEX "EducationLink_educationId_idx" ON "EducationLink"("educationId");

-- CreateIndex
CREATE INDEX "Project_type_isFeatured_idx" ON "Project"("type", "isFeatured");

-- CreateIndex
CREATE INDEX "Project_year_idx" ON "Project"("year" DESC);

-- CreateIndex
CREATE INDEX "ProjectSkill_projectId_idx" ON "ProjectSkill"("projectId");

-- CreateIndex
CREATE INDEX "ProjectLink_projectId_idx" ON "ProjectLink"("projectId");

-- AddForeignKey
ALTER TABLE "WorkExperienceLink" ADD CONSTRAINT "WorkExperienceLink_workExperienceId_fkey" FOREIGN KEY ("workExperienceId") REFERENCES "WorkExperience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkExperienceBadge" ADD CONSTRAINT "WorkExperienceBadge_workExperienceId_fkey" FOREIGN KEY ("workExperienceId") REFERENCES "WorkExperience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducationLink" ADD CONSTRAINT "EducationLink_educationId_fkey" FOREIGN KEY ("educationId") REFERENCES "Education"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectSkill" ADD CONSTRAINT "ProjectSkill_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectLink" ADD CONSTRAINT "ProjectLink_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
