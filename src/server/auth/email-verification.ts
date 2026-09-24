import "server-only";

import { createHash, randomInt } from "node:crypto";
import { prisma } from "../../lib/prisma";

const CODE_LENGTH = 6;
const CODE_TTL_MS = 1000 * 60 * 10; // 10 minutes
const MAX_ATTEMPTS = 5;
const RESEND_COOLDOWN_MS = 1000 * 60; // 1 minute

export class VerificationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "VerificationError";
  }
}

function hashCode(code: string) {
  return createHash("sha256").update(code).digest("hex");
}

function generateCode() {
  return randomInt(0, 1_000_000).toString().padStart(CODE_LENGTH, "0");
}

export async function findUserByIdentifier(identifier: string) {
  const value = identifier.trim().toLowerCase();
  return prisma.user.findFirst({ where: { OR: [{ email: value }, { username: value }] } });
}

export async function issueVerificationCode(userId: string) {
  const now = new Date();
  const lastCode = await prisma.emailVerificationCode.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } });
  if (lastCode && now.getTime() - lastCode.createdAt.getTime() < RESEND_COOLDOWN_MS) {
    const waitSeconds = Math.ceil((RESEND_COOLDOWN_MS - (now.getTime() - lastCode.createdAt.getTime())) / 1000);
    throw new VerificationError(`Yeni kod göndermeden önce lütfen ${waitSeconds} saniye bekleyin.`);
  }

  const code = generateCode();
  await prisma.$transaction([
    prisma.emailVerificationCode.updateMany({ where: { userId, usedAt: null }, data: { usedAt: now } }),
    prisma.emailVerificationCode.create({
      data: { userId, codeHash: hashCode(code), expiresAt: new Date(now.getTime() + CODE_TTL_MS) },
    }),
  ]);
  return code;
}

export async function verifyEmailCode(userId: string, code: string) {
  const record = await prisma.emailVerificationCode.findFirst({ where: { userId, usedAt: null }, orderBy: { createdAt: "desc" } });
  if (!record) throw new VerificationError("Geçerli bir doğrulama kodu bulunamadı. Yeni kod isteyin.");
  if (record.expiresAt <= new Date()) throw new VerificationError("Doğrulama kodunun süresi dolmuş. Yeni kod isteyin.");
  if (record.attempts >= MAX_ATTEMPTS) throw new VerificationError("Çok fazla hatalı deneme yapıldı. Yeni kod isteyin.");

  if (record.codeHash !== hashCode(code)) {
    await prisma.emailVerificationCode.update({ where: { id: record.id }, data: { attempts: { increment: 1 } } });
    throw new VerificationError("Girdiğiniz kod hatalı.");
  }

  await prisma.$transaction([
    prisma.emailVerificationCode.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
    prisma.user.update({ where: { id: userId }, data: { emailVerifiedAt: new Date() } }),
  ]);
}
