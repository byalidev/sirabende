CREATE TABLE "RequestFeatureUsage" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "requestId" UUID NOT NULL,
    "feature" TEXT NOT NULL,
    "durationHours" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RequestFeatureUsage_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "RequestFeatureUsage_userId_createdAt_idx"
ON "RequestFeatureUsage"("userId", "createdAt");

CREATE INDEX "RequestFeatureUsage_requestId_createdAt_idx"
ON "RequestFeatureUsage"("requestId", "createdAt");

ALTER TABLE "RequestFeatureUsage"
ADD CONSTRAINT "RequestFeatureUsage_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "RequestFeatureUsage"
ADD CONSTRAINT "RequestFeatureUsage_requestId_fkey"
FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;