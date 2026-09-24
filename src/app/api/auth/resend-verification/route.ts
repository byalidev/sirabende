import { NextResponse } from "next/server";
import { findUserByIdentifier, issueVerificationCode, VerificationError } from "../../../../server/auth/email-verification";
import { sendVerificationEmail } from "../../../../lib/mail";

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const identifier = typeof body.identifier === "string" ? body.identifier.trim() : "";
    if (!identifier) return NextResponse.json({ error: "E-posta veya kullanıcı adı gerekli." }, { status: 400 });

    const user = await findUserByIdentifier(identifier);
    if (!user) return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
    if (user.emailVerifiedAt) return NextResponse.json({ ok: true, alreadyVerified: true });

    const code = await issueVerificationCode(user.id);
    await sendVerificationEmail(user.email, code);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof VerificationError) return NextResponse.json({ error: error.message }, { status: 429 });
    console.error("Resend verification failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Kod gönderilirken bir hata oluştu." }, { status: 500 });
  }
}
