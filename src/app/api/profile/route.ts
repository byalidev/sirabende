import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { requireUser } from "../../../server/auth/auth";

export async function PATCH(request: Request) {
  try {
    const user = await requireUser(); const body = await request.json() as Record<string, unknown>;
    const firstName = typeof body.firstName === "string" ? body.firstName.trim() : ""; const lastName = typeof body.lastName === "string" ? body.lastName.trim() : ""; const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    if (!firstName || !lastName || !phone) return NextResponse.json({ error: "Bilgileri kontrol edin." }, { status: 400 });
    await prisma.user.update({ where: { id: user.id }, data: { firstName, lastName, phone } }); return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: "Profil güncellenemedi." }, { status: 401 }); }
}
