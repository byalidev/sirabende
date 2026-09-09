import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { createSession, hashPassword } from "../../../../server/auth/auth";

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const firstName = clean(body.firstName);
    const lastName = clean(body.lastName);
    const username = clean(body.username).toLowerCase();
    const email = clean(body.email).toLowerCase();
    const phone = clean(body.phone);
    const password = typeof body.password === "string" ? body.password : "";
    const passwordConfirmation = typeof body.passwordConfirmation === "string" ? body.passwordConfirmation : "";

    if (!firstName || !lastName || !username || !email || !phone || !/^\S+@\S+\.\S+$/.test(email) || !/^[a-z0-9_\.\-]{3,30}$/.test(username) || password.length < 8 || password !== passwordConfirmation) {
      return NextResponse.json({ error: "Bilgileri kontrol edin. Şifre en az 8 karakter olmalıdır." }, { status: 400 });
    }

    const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] }, select: { email: true, username: true } });
    if (existing) return NextResponse.json({ error: "Bu e-posta veya kullanıcı adı zaten kullanılıyor." }, { status: 409 });

    const user = await prisma.user.create({ data: { firstName, lastName, username, email, phone, passwordHash: await hashPassword(password) } });
    const role = await prisma.role.upsert({ where: { name: "USER" }, update: {}, create: { name: "USER", description: "Standart kullanıcı" } });
    await prisma.userRole.create({ data: { userId: user.id, roleId: role.id } });
    await createSession(user.id);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Registration failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Kayıt sırasında bir hata oluştu." }, { status: 500 });
  }
}
