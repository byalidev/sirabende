import { NextResponse } from "next/server";
import { createManagedAdmin } from "../../../../../server/admin/audit";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { username?: unknown; email?: unknown; password?: unknown };
    if (typeof body.username !== "string" || typeof body.email !== "string" || typeof body.password !== "string") return NextResponse.json({ error: "Kullanıcı adı, e-posta ve şifre zorunludur." }, { status: 400 });
    return NextResponse.json({ admin: await createManagedAdmin({ username: body.username.trim().toLowerCase(), email: body.email.trim().toLowerCase(), password: body.password }) }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "ADMIN_EXISTS") return NextResponse.json({ error: "Bu kullanıcı adı veya e-posta zaten kullanılıyor." }, { status: 409 });
    if (error instanceof Error && error.message === "INVALID_ADMIN") return NextResponse.json({ error: "Geçersiz kullanıcı adı veya şifre." }, { status: 400 });
    return NextResponse.json({ error: "Admin oluşturulamadı." }, { status: 500 });
  }
}