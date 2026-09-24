import { NextResponse } from "next/server";
import { revokeSanctionAsSuperAdmin } from "../../../../../../server/admin/audit";
import { AuthError } from "../../../../../../server/auth/auth";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { await revokeSanctionAsSuperAdmin((await params).id); return NextResponse.json({ ok: true }); }
  catch (error) { if (error instanceof AuthError) return NextResponse.json({ error: error.message === "Forbidden" ? "Bu işlem yalnızca SUPER_ADMIN için kullanılabilir." : "Oturumunuz sona ermiş. Lütfen tekrar giriş yapın." }, { status: error.message === "Forbidden" ? 403 : 401 }); if (error instanceof Error && error.message === "STRIKE_NOT_FOUND") return NextResponse.json({ error: "Yaptırım bulunamadı." }, { status: 404 }); console.error("Super Admin sanction revocation failed", error); return NextResponse.json({ error: "Yaptırım geri çekilemedi." }, { status: 500 }); }
}