import { NextResponse } from "next/server";
import { isValidPassword, passwordsMatch } from "../../../../lib/auth-validation";
import { prisma } from "../../../../lib/prisma";
import { destroySession, hashPassword, requireUser, verifyPassword } from "../../../../server/auth/auth";

export async function POST(request: Request) {
  try {
    const user = await requireUser(); const body = await request.json() as Record<string, unknown>; const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword : ""; const newPassword = typeof body.newPassword === "string" ? body.newPassword : ""; const confirmation = typeof body.confirmation === "string" ? body.confirmation : "";
    if (!(await verifyPassword(currentPassword, user.passwordHash)) || !isValidPassword(newPassword) || !passwordsMatch(newPassword, confirmation)) return NextResponse.json({ error: "Mevcut şifre veya yeni şifre bilgileri hatalı." }, { status: 400 });
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash: await hashPassword(newPassword) } }); await prisma.session.deleteMany({ where: { userId: user.id } }); await destroySession(); return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: "Şifre değiştirilemedi." }, { status: 401 }); }
}
