import "server-only";

import { Prisma, type StrikeLevel, type StrikeReason } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { requireRole } from "../auth/auth";
import { computeTrustScore, getStrikeWarningLevel, reachesStrikeSuspensionThreshold } from "./policy";

export { getStrikeWarningLevel, reachesStrikeSuspensionThreshold, computeTrustScore } from "./policy";
export type { TrustScore } from "./policy";

export const strikeReasonsByLevel = {
  LOW: ["SPAM", "UNNECESSARY_MESSAGE", "WRONG_CATEGORY", "MINOR_PROFILE_VIOLATION"],
  MEDIUM: ["MISLEADING_PRODUCT_INFO", "FAKE_REQUEST", "REPEATED_SPAM", "FAKE_REVIEW", "OFF_PLATFORM_REDIRECTION"],
  HIGH: ["FRAUD", "FAKE_IDENTITY", "FAKE_BUSINESS", "THREAT", "BLACKMAIL", "PERSONAL_DATA_MISUSE", "PROHIBITED_PRODUCT"],
} as const satisfies Record<StrikeLevel, readonly StrikeReason[]>;

export const strikeLevelLabels: Record<StrikeLevel, string> = { LOW: "Düşük", MEDIUM: "Orta", HIGH: "Yüksek" };
export const strikeReasonLabels: Record<StrikeReason, string> = {
  SPAM: "Spam", UNNECESSARY_MESSAGE: "Gereksiz mesaj", WRONG_CATEGORY: "Yanlış kategori", MINOR_PROFILE_VIOLATION: "Küçük profil ihlali",
  MISLEADING_PRODUCT_INFO: "Yanlış ürün bilgisi", FAKE_REQUEST: "Sahte talep", REPEATED_SPAM: "Sürekli spam", FAKE_REVIEW: "Sahte değerlendirme", OFF_PLATFORM_REDIRECTION: "Platform dışına yönlendirme",
  FRAUD: "Dolandırıcılık", FAKE_IDENTITY: "Sahte kimlik", FAKE_BUSINESS: "Sahte işletme", THREAT: "Tehdit", BLACKMAIL: "Şantaj", PERSONAL_DATA_MISUSE: "Kişisel bilgileri kötüye kullanma", PROHIBITED_PRODUCT: "Yasaklı ürün",
};

const counterFields: Record<StrikeLevel, "lowStrikeCount" | "mediumStrikeCount" | "highStrikeCount"> = { LOW: "lowStrikeCount", MEDIUM: "mediumStrikeCount", HIGH: "highStrikeCount" };

export class StrikeDomainError extends Error {}
export type CreateStrikeInput = { userId: string; level: StrikeLevel; reason: StrikeReason; adminNote: string | null; reportId?: string | null; messageId?: string | null; requestId?: string | null; offerId?: string | null };

function validateStrikeInput(input: CreateStrikeInput) {
  if (!(strikeReasonsByLevel[input.level] as readonly StrikeReason[]).includes(input.reason)) throw new StrikeDomainError("Seçilen sebep yaptırım seviyesiyle eşleşmiyor.");
  if (input.adminNote && input.adminNote.length > 2000) throw new StrikeDomainError("Admin notu 2.000 karakteri geçemez.");
}

export async function createStrike(input: CreateStrikeInput) {
  validateStrikeInput(input);
  const admin = await requireRole(["ADMIN", "SUPER_ADMIN"]);
  if (admin.id === input.userId) throw new StrikeDomainError("Kendi hesabınıza yaptırım uygulayamazsınız.");

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await prisma.$transaction(async (transaction) => {
        const current = await transaction.user.findUnique({ where: { id: input.userId }, select: { id: true, isActive: true, permanentlySuspendedAt: true } });
        if (!current) throw new StrikeDomainError("Kullanıcı bulunamadı.");
        if (current.permanentlySuspendedAt) throw new StrikeDomainError("Bu hesap kalıcı olarak kapatılmış.");

        const counterField = counterFields[input.level];
        const user = await transaction.user.update({ where: { id: input.userId }, data: { [counterField]: { increment: 1 } }, select: { lowStrikeCount: true, mediumStrikeCount: true, highStrikeCount: true } });
        const strike = await transaction.userStrike.create({ data: { ...input, adminId: admin.id, adminNote: input.adminNote || null }, select: { id: true, level: true, reason: true, createdAt: true } });
        await transaction.adminActionLog.create({ data: { adminId: admin.id, action: "ADMIN_APPLY_SANCTION", targetUserId: input.userId, targetReportId: input.reportId ?? null, targetMessageId: input.messageId ?? null, targetRequestId: input.requestId ?? null, targetOfferId: input.offerId ?? null, reason: input.adminNote || strikeReasonLabels[input.reason], metadata: { level: input.level, reason: input.reason } } });
        const count = user[counterField];
        const permanentlySuspend = reachesStrikeSuspensionThreshold(input.level, count);

        if (permanentlySuspend) {
          await transaction.user.update({ where: { id: input.userId }, data: { isActive: false, permanentlySuspendedAt: new Date() } });
          await transaction.session.deleteMany({ where: { userId: input.userId } });
          await transaction.request.updateMany({ where: { userId: input.userId, status: "ACTIVE" }, data: { status: "CLOSED" } });
          await transaction.offer.updateMany({ where: { sellerId: input.userId, status: "PENDING" }, data: { status: "WITHDRAWN" } });
        }

        await transaction.notification.create({ data: { userId: input.userId, type: "SYSTEM", title: permanentlySuspend ? "Hesabınız kalıcı olarak kapatıldı" : "Hesabınıza yaptırım uygulandı", message: permanentlySuspend ? "Yaptırım eşiklerinden biri aşıldığı için hesabınız kalıcı olarak kapatıldı." : `Sebep: ${strikeReasonLabels[input.reason]}. Seviye: ${strikeLevelLabels[input.level]}.${input.adminNote ? ` Açıklama: ${input.adminNote}` : ""}` } });
        return { strike, counts: user, permanentlySuspend };
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    } catch (error) {
      if (error instanceof StrikeDomainError || attempt === 2 || !(typeof error === "object" && error && "code" in error && error.code === "P2034")) throw error;
    }
  }
  throw new StrikeDomainError("Yaptırım uygulanamadı.");
}

export type PublicStrikeWarning = { level: StrikeLevel; count: number; strikes: Array<{ reason: StrikeReason; createdAt: string }> } | null;

export async function getPublicStrikeWarning(userId: string): Promise<PublicStrikeWarning> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { lowStrikeCount: true, mediumStrikeCount: true, highStrikeCount: true } });
  if (!user) return null;
  const level = getStrikeWarningLevel(user);
  if (!level) return null;
  const counterField = counterFields[level];
  const strikes = await prisma.userStrike.findMany({ where: { userId, level, status: "ACTIVE" }, orderBy: { createdAt: "desc" }, take: 5, select: { reason: true, createdAt: true } });
  return { level, count: user[counterField], strikes: strikes.map((strike) => ({ reason: strike.reason, createdAt: strike.createdAt.toISOString() })) };
}

// Trust score reflects only currently active strikes, so revoking one restores the score automatically.
export async function getTrustScore(userId: string) {
  const grouped = await prisma.userStrike.groupBy({ by: ["level"], where: { userId, status: "ACTIVE" }, _count: { _all: true } });
  const counts: Record<StrikeLevel, number> = { LOW: 0, MEDIUM: 0, HIGH: 0 };
  for (const item of grouped) counts[item.level] = item._count._all;
  return computeTrustScore(counts);
}

export async function getStrikesForUser(userId: string) {
  return prisma.userStrike.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 50, select: { id: true, level: true, reason: true, adminNote: true, status: true, startsAt: true, endsAt: true, createdAt: true } });
}

export async function getAdminStrikesForUser(userId: string) {
  return prisma.userStrike.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 50, select: { id: true, level: true, reason: true, adminNote: true, status: true, startsAt: true, endsAt: true, createdAt: true, admin: { select: { username: true } } } });
}
