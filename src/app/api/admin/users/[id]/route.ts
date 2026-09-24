import { NextResponse } from "next/server";
import { updateAdminUserModeration } from "../../../../../server/admin/repository";

function parseDate(value: unknown) {
  if (value === null || value === "") return null;
  if (typeof value !== "string") throw new Error("INVALID_DATE");
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error("INVALID_DATE");
  return date;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json() as { isActive?: unknown; bannedUntil?: unknown; postingBannedUntil?: unknown; offeringBannedUntil?: unknown; reason?: unknown };
    if (typeof body.isActive !== "boolean") return NextResponse.json({ error: "Hesap durumu geçersiz." }, { status: 400 });
    if (typeof body.reason !== "string" || !body.reason.trim()) return NextResponse.json({ error: "Yaptırım nedeni zorunludur." }, { status: 400 });
    const user = await updateAdminUserModeration((await params).id, { isActive: body.isActive, bannedUntil: parseDate(body.bannedUntil), postingBannedUntil: parseDate(body.postingBannedUntil), offeringBannedUntil: parseDate(body.offeringBannedUntil), reason: body.reason });
    return NextResponse.json({ user });
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_DATE") return NextResponse.json({ error: "Geçersiz tarih." }, { status: 400 });
    if (error instanceof Error && error.message === "SELF_MODERATION") return NextResponse.json({ error: "Kendi hesabınızı yönetemezsiniz." }, { status: 400 });
    if (error instanceof Error && error.message === "MODERATION_REASON_REQUIRED") return NextResponse.json({ error: "Yaptırım nedeni zorunludur." }, { status: 400 });
    if (typeof error === "object" && error && "code" in error && error.code === "P2025") return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
    console.error("Admin user moderation failed", error);
    return NextResponse.json({ error: "Kullanıcı yaptırımları güncellenemedi." }, { status: 500 });
  }
}