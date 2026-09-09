import "server-only";

import { prisma } from "../../lib/prisma";
import type { ReportTargetType, ReportReason } from "./validation";

export class ReportDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReportDomainError";
  }
}

export async function createReport(reporterId: string, targetType: ReportTargetType, targetId: string, reason: ReportReason, description: string | null) {
  let targetUserId: string | null = null;
  let requestId: string | null = null;
  let offerId: string | null = null;

  if (targetType === "USER") {
    const target = await prisma.user.findUnique({ where: { id: targetId }, select: { id: true } });
    if (!target) throw new ReportDomainError("Kullanıcı bulunamadı.");
    targetUserId = target.id;
  }
  if (targetType === "REQUEST") {
    const target = await prisma.request.findUnique({ where: { id: targetId }, select: { id: true } });
    if (!target) throw new ReportDomainError("Talep bulunamadı.");
    requestId = target.id;
  }
  if (targetType === "OFFER") {
    const target = await prisma.offer.findUnique({ where: { id: targetId }, select: { id: true } });
    if (!target) throw new ReportDomainError("Teklif bulunamadı.");
    offerId = target.id;
  }
  if (targetUserId === reporterId) throw new ReportDomainError("Kendinizi şikayet edemezsiniz.");

  const existing = await prisma.report.findFirst({ where: { reporterId, reportedUserId: targetUserId, requestId, offerId, status: { in: ["PENDING", "REVIEWING"] } }, select: { id: true } });
  if (existing) throw new ReportDomainError("Bu içerik için zaten aktif bir şikayetiniz var.");

  return prisma.report.create({ data: { reporterId, reportedUserId: targetUserId, requestId, offerId, reason, description }, select: { id: true, status: true, createdAt: true } });
}
