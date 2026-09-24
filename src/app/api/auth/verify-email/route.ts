import { NextResponse } from "next/server";
import { findUserByIdentifier, verifyEmailCode, VerificationError } from "../../../../server/auth/email-verification";

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const identifier = typeof body.identifier === "string" ? body.identifier.trim() : "";
    const code = typeof body.code === "string" ? body.code.trim() : "";

    if (!identifier || !/^\d{6}$/.test(code)) {
      return NextResponse.json({ error: "Geçerli bir e-posta/kullanıcı adı ve 6 haneli kod girin." }, { status: 400 });
    }

    const user = await findUserByIdentifier(identifier);
    if (!user) return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
    if (user.emailVerifiedAt) return NextResponse.json({ ok: true, alreadyVerified: true });

    await verifyEmailCode(user.id, code);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof VerificationError) return NextResponse.json({ error: error.message }, { status: 400 });
    console.error("Email verification failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Doğrulama sırasında bir hata oluştu." }, { status: 500 });
  }
}
