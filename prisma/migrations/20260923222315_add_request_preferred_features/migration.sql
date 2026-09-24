-- AlterTable
ALTER TABLE "public"."Request" ADD COLUMN     "preferredFeatures" TEXT[] DEFAULT ARRAY[]::TEXT[];
