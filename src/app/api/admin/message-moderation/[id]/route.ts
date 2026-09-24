import { NextResponse } from "next/server";
import { MessageModerationReviewStatus } from "@prisma/client";
import { reviewMessageModerationFlag } from "../../../../../server/admin/message-moderation";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json() as { status?: unknown; adminNote?: unknown };
    if (!Object.values(MessageModerationReviewStatus).includes(body.status as MessageModerationReviewStatus)) return NextResponse.json({ error: "Geçersiz inceleme durumu." }, { status: 400 });
    if (body.adminNote !== undefined && body.adminNote !== null && typeof body.adminNote !== "string") return NextResponse.json({ error: "Admin notu geçersiz." }, { status: 400 });
    const result = await reviewMessageModerationFlag((await params).id, body.status as MessageModerationReviewStatus, typeof body.adminNote === "string" ? body.adminNote : null);
    return NextResponse.json({ flag: { ...result, reviewedAt: result.reviewedAt?.toISOString() ?? null } });
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && error.code === "P2025") return NextResponse.json({ error: "Moderasyon işareti bulunamadı." }, { status: 404 });
    console.error("Admin message moderation update failed", error);
    return NextResponse.json({ error: "Moderasyon durumu güncellenemedi." }, { status: 500 });
  }
}
