import { NextResponse } from "next/server";
import { clearUserBansAsSuperAdmin } from "../../../../../../../server/admin/audit";
import { AuthError } from "../../../../../../../server/auth/auth";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await clearUserBansAsSuperAdmin((await params).id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message === "Forbidden" ? "Bu işlem yalnızca SUPER_ADMIN için kullanılabilir." : "Oturumunuz sona ermiş. Lütfen tekrar giriş yapın." }, { status: error.message === "Forbidden" ? 403 : 401 });
    if (error instanceof Error && error.message === "USER_NOT_FOUND") return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
    console.error("Super Admin ban removal failed", error);
    return NextResponse.json({ error: "Yasaklar kaldırılamadı." }, { status: 500 });
  }
}