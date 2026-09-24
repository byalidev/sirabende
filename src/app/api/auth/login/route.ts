import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { createSession, verifyPassword } from "../../../../server/auth/auth";

const LOGIN_LIMIT = 10;
const LOGIN_WINDOW_MS = 10 * 60 * 1000;
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || request.headers.get("x-real-ip")?.trim() || "unknown";
}

function isLoginRateLimited(ip: string) {
  const now = Date.now();
  const current = loginAttempts.get(ip);

  if (!current || current.resetAt <= now) {
    loginAttempts.set(ip, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
    return false;
  }

  current.count += 1;
  return current.count > LOGIN_LIMIT;
}

export async function POST(request: Request) {
  try {
    if (isLoginRateLimited(getClientIp(request))) {
      return NextResponse.json({ error: "Çok fazla giriş denemesi yapıldı. Lütfen 10 dakika sonra tekrar deneyin." }, { status: 429 });
    }

    const body = await request.json() as Record<string, unknown>;
    const identifier = typeof body.identifier === "string" ? body.identifier.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const user = await prisma.user.findFirst({ where: { OR: [{ email: identifier }, { username: identifier }] } });
    if (!user || !user.isActive || !(await verifyPassword(password, user.passwordHash))) {
      return NextResponse.json({ error: "E-posta/kullanıcı adı veya şifre hatalı." }, { status: 401 });
    }
    if (!user.emailVerifiedAt) {
      return NextResponse.json({ error: "Devam etmek için e-posta adresinizi doğrulamanız gerekiyor.", code: "EMAIL_NOT_VERIFIED" }, { status: 403 });
    }
    await createSession(user.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Login failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Giriş sırasında bir hata oluştu." }, { status: 500 });
  }
}
