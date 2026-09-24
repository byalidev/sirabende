import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { isValidPassword, PASSWORD_MIN_LENGTH_MESSAGE, passwordsMatch } from "../../../../lib/auth-validation";
import { hashPassword } from "../../../../server/auth/auth";
import { issueVerificationCode } from "../../../../server/auth/email-verification";
import { sendVerificationEmail } from "../../../../lib/mail";

const REGISTRATION_LIMIT = 5;
const REGISTRATION_WINDOW_MS = 15 * 60 * 1000;
const registrationAttempts = new Map<string, { count: number; resetAt: number }>();

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || request.headers.get("x-real-ip")?.trim() || "unknown";
}

function isRegistrationRateLimited(ip: string) {
  const now = Date.now();
  const current = registrationAttempts.get(ip);

  if (!current || current.resetAt <= now) {
    registrationAttempts.set(ip, { count: 1, resetAt: now + REGISTRATION_WINDOW_MS });
    return false;
  }

  current.count += 1;
  return current.count > REGISTRATION_LIMIT;
}

export async function POST(request: Request) {
  try {
    if (isRegistrationRateLimited(getClientIp(request))) {
      return NextResponse.json({ error: "Çok fazla kayıt denemesi yapıldı. Lütfen 15 dakika sonra tekrar deneyin." }, { status: 429 });
    }

    const body = await request.json() as Record<string, unknown>;
    const firstName = clean(body.firstName);
    const lastName = clean(body.lastName);
    const username = clean(body.username).toLowerCase();
    const email = clean(body.email).toLowerCase();
    const phone = clean(body.phone);
    const password = typeof body.password === "string" ? body.password : "";
    const passwordConfirmation = typeof body.passwordConfirmation === "string" ? body.passwordConfirmation : "";

    if (!firstName || !lastName || !username || !email || !phone) {
      return NextResponse.json({ error: "Ad, soyad, kullanıcı adı, e-posta ve telefon zorunludur." }, { status: 400 });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: "Geçerli bir e-posta adresi girin." }, { status: 400 });
    if (!/^[a-z0-9_\.\-]{3,30}$/.test(username)) return NextResponse.json({ error: "Kullanıcı adı 3-30 karakter olmalı ve yalnızca küçük harf, rakam, nokta, alt çizgi veya tire içermelidir." }, { status: 400 });
    if (!isValidPassword(password)) return NextResponse.json({ error: PASSWORD_MIN_LENGTH_MESSAGE }, { status: 400 });
    if (!passwordsMatch(password, passwordConfirmation)) return NextResponse.json({ error: "Şifreler eşleşmiyor." }, { status: 400 });

    const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] }, select: { email: true, username: true } });
    if (existing) return NextResponse.json({ error: "Bu e-posta veya kullanıcı adı zaten kullanılıyor." }, { status: 409 });

    const user = await prisma.user.create({ data: { firstName, lastName, username, email, phone, passwordHash: await hashPassword(password) } });
    const role = await prisma.role.upsert({ where: { name: "USER" }, update: {}, create: { name: "USER", description: "Standart kullanıcı" } });
    await prisma.userRole.create({ data: { userId: user.id, roleId: role.id } });

    try {
      const code = await issueVerificationCode(user.id);
      await sendVerificationEmail(user.email, code);
    } catch (mailError) {
      console.error("Verification email failed", mailError instanceof Error ? mailError.message : "Unknown error");
    }

    return NextResponse.json({ ok: true, email: user.email }, { status: 201 });
  } catch (error) {
    console.error("Registration failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Kayıt sırasında bir hata oluştu." }, { status: 500 });
  }
}
