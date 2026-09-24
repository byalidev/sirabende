ALTER TABLE "Request"
ADD COLUMN "featuredUntil" TIMESTAMP(3),
ADD COLUMN "pinnedUntil" TIMESTAMP(3),
ADD COLUMN "urgentUntil" TIMESTAMP(3);

CREATE INDEX "Request_status_pinnedUntil_featuredUntil_createdAt_idx"
ON "Request"("status", "pinnedUntil", "featuredUntil", "createdAt");