CREATE TYPE "StrikeLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');
CREATE TYPE "StrikeReason" AS ENUM ('SPAM', 'UNNECESSARY_MESSAGE', 'WRONG_CATEGORY', 'MINOR_PROFILE_VIOLATION', 'MISLEADING_PRODUCT_INFO', 'FAKE_REQUEST', 'REPEATED_SPAM', 'FAKE_REVIEW', 'OFF_PLATFORM_REDIRECTION', 'FRAUD', 'FAKE_IDENTITY', 'FAKE_BUSINESS', 'THREAT', 'BLACKMAIL', 'PERSONAL_DATA_MISUSE', 'PROHIBITED_PRODUCT');
CREATE TYPE "StrikeStatus" AS ENUM ('ACTIVE', 'REVOKED');

ALTER TABLE "User"
ADD COLUMN "lowStrikeCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "mediumStrikeCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "highStrikeCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "permanentlySuspendedAt" TIMESTAMP(3);

CREATE TABLE "UserStrike" (
  "id" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "adminId" UUID NOT NULL,
  "level" "StrikeLevel" NOT NULL,
  "reason" "StrikeReason" NOT NULL,
  "adminNote" TEXT,
  "status" "StrikeStatus" NOT NULL DEFAULT 'ACTIVE',
  "startsAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "endsAt" TIMESTAMP(3),
  "revokedAt" TIMESTAMP(3),
  "reportId" UUID,
  "messageId" UUID,
  "requestId" UUID,
  "offerId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "UserStrike_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "UserStrike_userId_level_status_createdAt_idx" ON "UserStrike"("userId", "level", "status", "createdAt");
CREATE INDEX "UserStrike_adminId_createdAt_idx" ON "UserStrike"("adminId", "createdAt");
CREATE INDEX "UserStrike_reportId_idx" ON "UserStrike"("reportId");
ALTER TABLE "UserStrike" ADD CONSTRAINT "UserStrike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "UserStrike" ADD CONSTRAINT "UserStrike_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "UserStrike" ADD CONSTRAINT "UserStrike_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "UserStrike" ADD CONSTRAINT "UserStrike_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "UserStrike" ADD CONSTRAINT "UserStrike_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "UserStrike" ADD CONSTRAINT "UserStrike_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
