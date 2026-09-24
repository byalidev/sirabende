import { NextResponse } from "next/server";
import { deleteUserAccountAsSuperAdmin, updateAdminUserModeration } from "../../../../../server/admin/repository";
import { AuthError } from "../../../../../server/auth/auth";

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

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await deleteUserAccountAsSuperAdmin((await params).id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message === "Forbidden" ? "Bu işlem yalnızca SUPER_ADMIN için kullanılabilir." : "Oturumunuz sona ermiş. Lütfen tekrar giriş yapın." }, { status: error.message === "Forbidden" ? 403 : 401 });
    if (error instanceof Error && error.message === "SELF_USER_DELETE") return NextResponse.json({ error: "Kendi hesabınızı silemezsiniz." }, { status: 400 });
    if (error instanceof Error && error.message === "USER_NOT_FOUND") return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
    if (error instanceof Error && error.message === "ADMIN_ACCOUNT_DELETE_NOT_ALLOWED") return NextResponse.json({ error: "Yönetici hesabı silinemez; ayrı admin kaldırma akışı kullanılır." }, { status: 400 });
    if (typeof error === "object" && error && "code" in error && error.code === "P2025") return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
    console.error("Super admin user deletion failed", error);
    return NextResponse.json({ error: "Kullanıcı hesabı silinemedi." }, { status: 500 });
  }
}