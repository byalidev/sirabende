CREATE TYPE "MessageModerationType" AS ENUM ('PROFANITY', 'PHONE_NUMBER', 'BANKING', 'EXTERNAL_CONTACT', 'SUSPICIOUS_CONTENT');
CREATE TYPE "MessageModerationSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH');
CREATE TYPE "MessageModerationReviewStatus" AS ENUM ('PENDING', 'CONFIRMED', 'REJECTED', 'IN_REVIEW');

CREATE TABLE "MessageModerationFlag" (
    "id" UUID NOT NULL,
    "messageId" UUID NOT NULL,
    "type" "MessageModerationType" NOT NULL,
    "severity" "MessageModerationSeverity" NOT NULL,
    "matchedRule" TEXT NOT NULL,
    "maskedText" TEXT,
    "reviewStatus" "MessageModerationReviewStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedAt" TIMESTAMP(3),
    "reviewedById" UUID,
    "adminNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MessageModerationFlag_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "MessageModerationFlag_reviewStatus_createdAt_idx" ON "MessageModerationFlag"("reviewStatus", "createdAt");
CREATE INDEX "MessageModerationFlag_type_reviewStatus_createdAt_idx" ON "MessageModerationFlag"("type", "reviewStatus", "createdAt");
CREATE INDEX "MessageModerationFlag_messageId_createdAt_idx" ON "MessageModerationFlag"("messageId", "createdAt");

ALTER TABLE "MessageModerationFlag" ADD CONSTRAINT "MessageModerationFlag_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MessageModerationFlag" ADD CONSTRAINT "MessageModerationFlag_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;