CREATE TYPE "AdminActionType" AS ENUM ('ADMIN_CREATED', 'ADMIN_STATUS_CHANGED', 'ADMIN_ROLE_CHANGED', 'ADMIN_BAN_USER', 'ADMIN_UNBAN_USER', 'ADMIN_DELETE_REQUEST', 'ADMIN_DELETE_OFFER', 'ADMIN_APPLY_SANCTION', 'ADMIN_REVIEW_REPORT', 'ADMIN_REVIEW_MESSAGE', 'ADMIN_DELETE_REPORT');

CREATE TABLE "AdminActionLog" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "adminId" UUID NOT NULL,
    "action" "AdminActionType" NOT NULL,
    "targetUserId" UUID,
    "targetRequestId" UUID,
    "targetOfferId" UUID,
    "targetReportId" UUID,
    "targetMessageId" UUID,
    "reason" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminActionLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AdminActionLog_createdAt_idx" ON "AdminActionLog"("createdAt");
CREATE INDEX "AdminActionLog_adminId_createdAt_idx" ON "AdminActionLog"("adminId", "createdAt");
CREATE INDEX "AdminActionLog_action_createdAt_idx" ON "AdminActionLog"("action", "createdAt");
CREATE INDEX "AdminActionLog_targetUserId_createdAt_idx" ON "AdminActionLog"("targetUserId", "createdAt");
CREATE INDEX "AdminActionLog_targetRequestId_createdAt_idx" ON "AdminActionLog"("targetRequestId", "createdAt");
CREATE INDEX "AdminActionLog_targetOfferId_createdAt_idx" ON "AdminActionLog"("targetOfferId", "createdAt");

ALTER TABLE "AdminActionLog" ADD CONSTRAINT "AdminActionLog_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "User" ADD COLUMN "ownerKey" TEXT;
CREATE UNIQUE INDEX "User_ownerKey_key" ON "User"("ownerKey");