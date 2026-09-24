-- CreateEnum
CREATE TYPE "public"."OfferWarrantyType" AS ENUM ('NONE', 'SELLER', 'MANUFACTURER', 'STORE');

-- AlterTable
ALTER TABLE "public"."Offer" ADD COLUMN     "benefits" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "warrantyMonths" INTEGER,
ADD COLUMN     "warrantyType" "public"."OfferWarrantyType" NOT NULL DEFAULT 'NONE';
