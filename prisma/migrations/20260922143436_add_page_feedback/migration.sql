-- CreateTable
CREATE TABLE "public"."PageFeedback" (
    "id" UUID NOT NULL,
    "message" TEXT NOT NULL,
    "pageUrl" TEXT NOT NULL,
    "userId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PageFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PageFeedback_createdAt_idx" ON "public"."PageFeedback"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."PageFeedback" ADD CONSTRAINT "PageFeedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
